from typing import Literal, Optional

from pydantic import BaseModel, Field


class EducationItem(BaseModel):
    degree: str = Field(description="Degree name, e.g. B.S. in Computer Science")
    institution: str = Field(description="University or college name")
    graduation_year: str = Field(description="Year of graduation, e.g. 2025")


class ExperienceItem(BaseModel):
    role: str = Field(description="Job or internship title")
    company: str = Field(description="Company or organization name")
    period: str = Field(description="Timeframe or dates, e.g. May 2024 - Aug 2024")
    bullets: list[str] = Field(default_factory=list, description="Key accomplishments or responsibilities")


class ProjectItem(BaseModel):
    name: str = Field(description="Project title")
    description: str = Field(description="Brief project overview")
    technologies: list[str] = Field(default_factory=list, description="Technologies or frameworks used")


class ProfileExtraction(BaseModel):
    name: str = Field(default="Candidate", description="Full name of candidate")
    email: Optional[str] = Field(default=None, description="Email address if present")
    title: str = Field(default="Software Engineer", description="Target professional title or headline")
    skills: list[str] = Field(default_factory=list, description="Normalized technical skills, languages, tools")
    years_experience: float = Field(default=0.0, description="Estimated total years of relevant experience")
    seniority: Literal["intern", "junior", "mid", "senior"] = Field(
        default="intern", description="Inferred seniority bracket"
    )
    education: list[EducationItem] = Field(default_factory=list)
    experience: list[ExperienceItem] = Field(default_factory=list)
    projects: list[ProjectItem] = Field(default_factory=list)
    desired_roles: list[str] = Field(default_factory=list, description="Target job titles")
    preferred_locations: list[str] = Field(default_factory=lambda: ["Remote"])
    remote_preference: Literal["remote", "hybrid", "onsite", "any"] = "remote"
    min_salary: Optional[int] = Field(default=None, description="Minimum desired yearly salary in USD")
    summary: str = Field(default="", description="Executive career summary synthesized from the resume")


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    skills: Optional[list[str]] = None
    years_experience: Optional[float] = None
    seniority: Optional[Literal["intern", "junior", "mid", "senior"]] = None
    desired_roles: Optional[list[str]] = None
    preferred_locations: Optional[list[str]] = None
    remote_preference: Optional[Literal["remote", "hybrid", "onsite", "any"]] = None
    min_salary: Optional[int] = None
    summary: Optional[str] = None


class ProfileResponse(BaseModel):
    user_id: Optional[str] = None
    name: str
    email: Optional[str] = None
    title: str
    skills: list[str]
    years_experience: float
    seniority: str
    desired_roles: list[str]
    preferred_locations: list[str]
    remote_preference: str
    min_salary: Optional[int] = None
    summary: str
    experience: list[ExperienceItem] = []
    education: list[EducationItem] = []
    projects: list[ProjectItem] = []
    version: int = 1
