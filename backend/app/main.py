import time
import uuid
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.health import router as health_router
from app.api.profile import router as profile_router
from app.core.config import settings
from app.core.errors import register_error_handlers
from app.core.logging import logger, setup_logging


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    # Startup
    setup_logging(settings.LOG_LEVEL)
    logger.info(f"Starting {settings.APP_NAME} in {settings.ENV} mode")
    yield
    # Shutdown
    logger.info(f"Shutting down {settings.APP_NAME}")


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version="0.1.0",
        description="CareerMatch AI Job-Matching and Career-Agent Platform API",
        lifespan=lifespan,
    )

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Request ID and access logging middleware
    @app.middleware("http")
    async def logging_middleware(request: Request, call_next):
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request.state.request_id = request_id
        start_time = time.time()

        response = await call_next(request)

        duration_ms = int((time.time() - start_time) * 1000)
        response.headers["X-Request-ID"] = request_id

        # Skip logging health checks in noisy manner
        if request.url.path not in ("/health",):
            logger.info(
                f"{request.method} {request.url.path} - {response.status_code} ({duration_ms}ms)",
                extra={
                    "request_id": request_id,
                    "method": request.method,
                    "path": request.url.path,
                    "status_code": response.status_code,
                    "latency_ms": duration_ms,
                },
            )

        return response

    # Register custom exception handlers
    register_error_handlers(app)

    # Register routers
    app.include_router(health_router)
    app.include_router(auth_router, prefix="/api", tags=["auth"])
    app.include_router(profile_router, prefix="/api", tags=["profile"])

    return app


app = create_app()
