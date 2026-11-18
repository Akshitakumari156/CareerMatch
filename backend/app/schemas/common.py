from typing import Any, Dict, Optional

from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str = "ok"
    app: str = "CareerMatch"


class ReadyResponse(BaseModel):
    status: str
    database: str
    pgvector: bool
    details: Optional[Dict[str, Any]] = None


class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[Dict[str, Any]] = None


class ErrorResponse(BaseModel):
    error: ErrorDetail
