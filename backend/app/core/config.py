from pathlib import Path
from typing import List, Union

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# Find root .env file
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
ENV_FILE = BASE_DIR / ".env"
if not ENV_FILE.exists():
    # Fallback to backend/.env or .env in cwd
    ENV_FILE = Path(".env")


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ENV_FILE if ENV_FILE.exists() else ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # App
    ENV: str = "development"
    LOG_LEVEL: str = "INFO"
    APP_NAME: str = "CareerMatch"
    CORS_ORIGINS: Union[str, List[str]] = "http://localhost:5173"

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    # Database
    POSTGRES_USER: str = "careermatch"
    POSTGRES_PASSWORD: str = "change_me_locally"
    POSTGRES_DB: str = "careermatch"
    DATABASE_URL: str = "postgresql+psycopg://careermatch:change_me_locally@localhost:5432/careermatch"
    CHECKPOINT_DB_URL: str = "postgresql://careermatch:change_me_locally@localhost:5432/careermatch"

    # Auth
    JWT_SECRET: str = "change_me_super_secret_jwt_key_32_bytes_long"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days

    # LLM Provider
    LLM_PROVIDER: str = "gemini"
    GOOGLE_API_KEY: str = ""
    LLM_MODEL: str = "gemini-2.5-flash"
    LLM_RERANK_MODEL: str = "gemini-2.5-flash"
    EMBEDDING_MODEL: str = "gemini-embedding-001"
    EMBEDDING_DIM: int = 768
    OPENAI_API_KEY: str = ""
    LLM_MAX_RETRIES: int = 5
    LLM_TIMEOUT_SECONDS: int = 60

    # Ingestion
    INGEST_ENABLED: bool = True
    INGEST_INTERVAL_MINUTES: int = 60
    INGEST_SOURCES: str = "remotive,arbeitnow"
    INGEST_MAX_JOBS_PER_SOURCE: int = 500
    JOB_STALE_AFTER_DAYS: int = 14
    ADZUNA_APP_ID: str = ""
    ADZUNA_APP_KEY: str = ""
    ADZUNA_COUNTRY: str = "in"
    ADMIN_TOKEN: str = "admin_secret_dev_token"

    # Matching Knobs
    MATCH_VECTOR_TOPK: int = 100
    MATCH_FTS_TOPK: int = 100
    MATCH_RERANK_TOPN: int = 15
    MATCH_USE_LLM_RERANK: bool = True

    # Observability
    LANGFUSE_PUBLIC_KEY: str = ""
    LANGFUSE_SECRET_KEY: str = ""
    LANGFUSE_HOST: str = "https://cloud.langfuse.com"

    # Frontend
    VITE_API_URL: str = "http://localhost:8000"

    @property
    def ingest_sources_list(self) -> List[str]:
        return [s.strip().lower() for s in self.INGEST_SOURCES.split(",") if s.strip()]


settings = Settings()
