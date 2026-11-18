from unittest.mock import AsyncMock, MagicMock

import pytest
from app.db.session import get_db
from fastapi import status


@pytest.mark.asyncio
async def test_health_liveness(client):
    response = await client.get("/health")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "ok"
    assert data["app"] == "CareerMatch"


@pytest.mark.asyncio
async def test_ready_success(app, client):
    mock_db = AsyncMock()
    mock_scalar = MagicMock()
    mock_scalar.scalar.return_value = 1
    mock_db.execute.return_value = mock_scalar

    async def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db] = override_get_db
    try:
        response = await client.get("/ready")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "ready"
        assert data["database"] == "connected"
        assert data["pgvector"] is True
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_ready_pgvector_missing(app, client):
    mock_db = AsyncMock()
    mock_scalar_ok = MagicMock()
    mock_scalar_none = MagicMock()
    mock_scalar_none.scalar.return_value = None
    mock_db.execute.side_effect = [mock_scalar_ok, mock_scalar_none]

    async def override_get_db():
        yield mock_db

    app.dependency_overrides[get_db] = override_get_db
    try:
        response = await client.get("/ready")
        assert response.status_code == status.HTTP_503_SERVICE_UNAVAILABLE
    finally:
        app.dependency_overrides.clear()
