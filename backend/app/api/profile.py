import logging
from typing import Optional

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import get_current_user_optional
from app.db.models import Profile, User
from app.db.session import get_db
from app.resume.extractor import ResumeExtractor
from app.resume.parser import extract_text_from_pdf
from app.schemas.profile import ProfileExtraction, ProfileResponse, ProfileUpdate

logger = logging.getLogger(__name__)

router = APIRouter()
extractor = ResumeExtractor()

# In-memory session store for immediate live interactive testing before auth is finalized
_active_profile_store: dict[str, ProfileResponse] = {}
DEFAULT_USER_KEY = "demo_user"


@router.post(
    "/profile/resume",
    response_model=ProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Upload PDF resume and extract structured profile via Gemini",
)
async def upload_and_parse_resume(
    file: UploadFile = File(...),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
):
    """Accepts a PDF resume, extracts raw text via pypdf, parses structured fields

    with Gemini 2.5 Flash, and computes 768-dim profile embeddings.
    """
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Please upload a standard PDF (.pdf) resume.",
        )

    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read uploaded file: {str(e)}",
        ) from e

    # Step 1: Extract clean text using pypdf
    raw_text = extract_text_from_pdf(content)

    # Step 2: Extract structured profile using Gemini
    logger.info(f"Extracting structured profile for {file.filename} ({len(raw_text)} chars)")
    extracted: ProfileExtraction = extractor.extract_profile(raw_text)

    # Step 3: Compute 768-dim embedding for vector search
    summary_text = f"{extracted.title}: {extracted.summary} Skills: {', '.join(extracted.skills)}"
    embedding_vector = extractor.embed_profile_summary(summary_text)

    # Step 4: Persist to database if authenticated
    user_id_str = str(current_user.id) if current_user else DEFAULT_USER_KEY

    if current_user:
        res = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
        db_profile = res.scalar_one_or_none()
        if not db_profile:
            db_profile = Profile(user_id=current_user.id)
            db.add(db_profile)

        db_profile.raw_resume_text = raw_text
        db_profile.parsed = extracted.model_dump()
        db_profile.skills = extracted.skills
        db_profile.years_experience = extracted.years_experience
        db_profile.seniority = extracted.seniority
        db_profile.desired_roles = extracted.desired_roles or [extracted.title]
        db_profile.preferred_locations = extracted.preferred_locations or ["Remote"]
        db_profile.remote_preference = extracted.remote_preference or "remote"
        db_profile.min_salary = extracted.min_salary
        db_profile.summary = extracted.summary
        db_profile.embedding = embedding_vector
        db_profile.version = (db_profile.version or 1) + 1

        await db.commit()

    # Step 5: Build profile response
    profile_resp = ProfileResponse(
        user_id=user_id_str,
        name=extracted.name,
        email=extracted.email or (current_user.email if current_user else None),
        title=extracted.title,
        skills=extracted.skills,
        years_experience=extracted.years_experience,
        seniority=extracted.seniority,
        desired_roles=extracted.desired_roles or [extracted.title],
        preferred_locations=extracted.preferred_locations or ["Remote"],
        remote_preference=extracted.remote_preference or "remote",
        min_salary=extracted.min_salary,
        summary=extracted.summary,
        experience=extracted.experience,
        education=extracted.education,
        projects=extracted.projects,
        version=1,
    )

    _active_profile_store[user_id_str] = profile_resp
    _active_profile_store[DEFAULT_USER_KEY] = profile_resp
    return profile_resp


@router.get(
    "/profile",
    response_model=ProfileResponse,
    summary="Get active parsed candidate profile",
)
async def get_profile(
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
):
    if current_user:
        res = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
        db_profile = res.scalar_one_or_none()
        if db_profile and db_profile.parsed:
            parsed = db_profile.parsed
            return ProfileResponse(
                user_id=str(current_user.id),
                name=parsed.get("name", "Candidate"),
                email=current_user.email,
                title=parsed.get("title", "Software Engineer"),
                skills=db_profile.skills or [],
                years_experience=float(db_profile.years_experience or 0),
                seniority=db_profile.seniority or "junior",
                desired_roles=db_profile.desired_roles or [],
                preferred_locations=db_profile.preferred_locations or ["Remote"],
                remote_preference=db_profile.remote_preference or "remote",
                min_salary=db_profile.min_salary,
                summary=db_profile.summary or "",
                experience=parsed.get("experience", []),
                education=parsed.get("education", []),
                projects=parsed.get("projects", []),
                version=db_profile.version or 1,
            )

    if DEFAULT_USER_KEY not in _active_profile_store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No profile found. Please upload a resume first.",
        )
    return _active_profile_store[DEFAULT_USER_KEY]


@router.put(
    "/profile",
    response_model=ProfileResponse,
    summary="Update profile fields and bump version",
)
async def update_profile(
    updates: ProfileUpdate,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
):
    target_key = str(current_user.id) if current_user else DEFAULT_USER_KEY

    if target_key not in _active_profile_store and not current_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No profile found. Please upload a resume first.",
        )

    current = _active_profile_store.get(target_key) or _active_profile_store.get(DEFAULT_USER_KEY)
    if not current:
        raise HTTPException(status_code=404, detail="No profile found to update.")

    updated_dict = current.model_dump()
    for field, val in updates.model_dump(exclude_unset=True).items():
        if val is not None:
            updated_dict[field] = val

    updated_dict["version"] = current.version + 1
    new_profile = ProfileResponse(**updated_dict)
    _active_profile_store[target_key] = new_profile
    _active_profile_store[DEFAULT_USER_KEY] = new_profile

    if current_user:
        res = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
        db_profile = res.scalar_one_or_none()
        if db_profile:
            if updates.skills is not None:
                db_profile.skills = updates.skills
            if updates.seniority is not None:
                db_profile.seniority = updates.seniority
            if updates.years_experience is not None:
                db_profile.years_experience = updates.years_experience
            if updates.desired_roles is not None:
                db_profile.desired_roles = updates.desired_roles
            if updates.preferred_locations is not None:
                db_profile.preferred_locations = updates.preferred_locations
            if updates.remote_preference is not None:
                db_profile.remote_preference = updates.remote_preference
            if updates.min_salary is not None:
                db_profile.min_salary = updates.min_salary
            if updates.summary is not None:
                db_profile.summary = updates.summary
            db_profile.version = (db_profile.version or 1) + 1
            await db.commit()

    return new_profile
