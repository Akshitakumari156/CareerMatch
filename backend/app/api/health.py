from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import logger
from app.db.session import get_db
from app.schemas.common import HealthResponse, ReadyResponse

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Liveness probe: verifies service is running."""
    return HealthResponse(status="ok", app="CareerMatch")


@router.get("/ready", response_model=ReadyResponse)
async def readiness_check(db: AsyncSession = Depends(get_db)) -> ReadyResponse:
    """Readiness probe: verifies database connectivity and pgvector extension."""
    try:
        # Check basic DB connection
        await db.execute(text("SELECT 1"))

        # Check pgvector extension
        res = await db.execute(text("SELECT 1 FROM pg_extension WHERE extname = 'vector'"))
        vector_installed = res.scalar() is not None

        if not vector_installed:
            logger.error("Readiness failed: pgvector extension is not installed in database")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Database connected but pgvector extension missing",
            )

        return ReadyResponse(
            status="ready",
            database="connected",
            pgvector=True,
        )
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Readiness check failed with database error: {exc}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database connection error: {str(exc)}",
        )
