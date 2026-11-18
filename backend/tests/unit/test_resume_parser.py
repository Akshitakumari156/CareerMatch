from unittest.mock import patch

import pytest
from app.main import app
from app.resume.parser import extract_text_from_pdf
from app.schemas.profile import ProfileExtraction
from fastapi import HTTPException
from httpx import ASGITransport, AsyncClient

SAMPLE_VALID_PDF = b"""%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 210 >> stream
BT
/F1 12 Tf
72 720 Td
(Jordan Smith - Full Stack Software Engineer) Tj
0 -20 Td
(Skills: Python, TypeScript, React, Docker, FastAPI) Tj
0 -20 Td
(Experience: 2 years building cloud microservices at ScaleCorp) Tj
ET
endstream endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000224 00000 n 
0000000487 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
557
%%EOF
"""

SAMPLE_SCANNED_EMPTY_PDF = b"""%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >> endobj
xref
0 4
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
trailer << /Size 4 /Root 1 0 R >>
startxref
185
%%EOF
"""


def test_extract_text_valid_pdf():
    text = extract_text_from_pdf(SAMPLE_VALID_PDF)
    assert "Jordan Smith" in text
    assert "Python" in text
    assert len(text) >= 50


def test_extract_text_rejects_empty_scanned_pdf():
    with pytest.raises(HTTPException) as exc_info:
        extract_text_from_pdf(SAMPLE_SCANNED_EMPTY_PDF)
    assert exc_info.value.status_code == 400
    assert "scanned image" in exc_info.value.detail.lower()


def test_extract_text_rejects_oversized_file():
    huge_bytes = b"0" * (6 * 1024 * 1024)
    with pytest.raises(HTTPException) as exc_info:
        extract_text_from_pdf(huge_bytes)
    assert exc_info.value.status_code == 400
    assert "Maximum PDF size is 5 MB" in exc_info.value.detail


@pytest.mark.asyncio
async def test_upload_resume_endpoint_success():
    mock_extracted = ProfileExtraction(
        name="Jordan Smith",
        title="Full Stack Software Engineer",
        skills=["Python", "TypeScript", "React", "Docker", "FastAPI"],
        years_experience=2.0,
        seniority="junior",
        desired_roles=["Full Stack Engineer"],
        preferred_locations=["Remote"],
        remote_preference="remote",
        summary="Experienced engineer with 2 years of cloud microservices background.",
    )

    with patch("app.api.profile.extractor.extract_profile", return_value=mock_extracted), \
         patch("app.api.profile.extractor.embed_profile_summary", return_value=[0.1] * 768):

        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            files = {"file": ("resume.pdf", SAMPLE_VALID_PDF, "application/pdf")}
            response = await client.post("/api/profile/resume", files=files)

            assert response.status_code == 200
            data = response.json()
            assert data["name"] == "Jordan Smith"
            assert "Python" in data["skills"]
            assert data["seniority"] == "junior"
            assert data["version"] == 1


@pytest.mark.asyncio
async def test_update_profile_bumps_version():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        # First ensure a profile exists
        mock_extracted = ProfileExtraction(
            name="Jordan Smith",
            title="Full Stack Software Engineer",
            skills=["Python"],
            years_experience=2.0,
            seniority="junior",
            summary="Test summary",
        )
        with patch("app.api.profile.extractor.extract_profile", return_value=mock_extracted):
            await client.post(
                "/api/profile/resume",
                files={"file": ("resume.pdf", SAMPLE_VALID_PDF, "application/pdf")},
            )

        # Update profile
        update_payload = {"seniority": "mid", "years_experience": 3.0}
        put_resp = await client.put("/api/profile", json=update_payload)

        assert put_resp.status_code == 200
        data = put_resp.json()
        assert data["seniority"] == "mid"
        assert data["years_experience"] == 3.0
        assert data["version"] == 2
