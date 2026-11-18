import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import (
    create_access_token,
    get_current_user,
    get_password_hash,
    verify_password,
)
from app.db.models import Profile, User
from app.db.session import get_db
from app.schemas.auth import TokenResponse, UserCreate, UserLogin, UserResponse

router = APIRouter()


@router.post(
    "/auth/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user account",
)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if email exists
    result = await db.execute(select(User).where(User.email == user_in.email.lower()))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please log in instead.",
        )

    # Create user
    user_id = uuid.uuid4()
    user = User(
        id=user_id,
        email=user_in.email.lower(),
        password_hash=get_password_hash(user_in.password),
    )
    db.add(user)

    # Create associated default profile record
    profile = Profile(
        user_id=user_id,
        skills=[],
        version=1,
    )
    db.add(profile)

    await db.commit()
    await db.refresh(user)

    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})

    user_resp = UserResponse(
        id=user.id,
        email=user.email,
        name=user_in.name or user.email.split("@")[0].capitalize(),
        created_at=user.created_at,
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_resp,
    )


@router.post(
    "/auth/login",
    response_model=TokenResponse,
    summary="Log in with email and password",
)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == credentials.email.lower()))
    user = result.scalar_one_or_none()

    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})

    user_resp = UserResponse(
        id=user.id,
        email=user.email,
        name=user.email.split("@")[0].capitalize(),
        created_at=user.created_at,
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_resp,
    )


@router.get(
    "/auth/me",
    response_model=UserResponse,
    summary="Get currently authenticated user details",
)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.email.split("@")[0].capitalize(),
        created_at=current_user.created_at,
    )
