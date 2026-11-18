import uuid

import pytest
from app.main import app
from httpx import ASGITransport, AsyncClient


@pytest.mark.asyncio
async def test_auth_register_and_login_flow():
    unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    password = "secretPassword123"

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        # 1. Register new user
        reg_resp = await client.post(
            "/api/auth/register",
            json={"email": unique_email, "password": password, "name": "Test Candidate"},
        )
        assert reg_resp.status_code == 201
        reg_data = reg_resp.json()
        assert "access_token" in reg_data
        assert reg_data["user"]["email"] == unique_email
        token = reg_data["access_token"]

        # 2. Duplicate registration should fail
        dup_resp = await client.post(
            "/api/auth/register",
            json={"email": unique_email, "password": password},
        )
        assert dup_resp.status_code == 400

        # 3. Login with correct credentials
        login_resp = await client.post(
            "/api/auth/login",
            json={"email": unique_email, "password": password},
        )
        assert login_resp.status_code == 200
        assert "access_token" in login_resp.json()

        # 4. Login with invalid password
        bad_login = await client.post(
            "/api/auth/login",
            json={"email": unique_email, "password": "wrongPassword"},
        )
        assert bad_login.status_code == 401

        # 5. Access /api/auth/me with bearer token
        me_resp = await client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert me_resp.status_code == 200
        assert me_resp.json()["email"] == unique_email
