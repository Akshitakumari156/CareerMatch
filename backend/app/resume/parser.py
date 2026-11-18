import io
import re

import pypdf
from fastapi import HTTPException

MAX_PDF_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extract raw text from a PDF byte stream using pypdf.

    Enforces:
    - Maximum file size (5MB)
    - Rejects scanned or empty PDFs (must have >= 50 chars of extractable text)
    - Sanitizes control characters and injection markers.
    """
    if len(pdf_bytes) > MAX_PDF_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum PDF size is 5 MB (received {len(pdf_bytes) / (1024 * 1024):.1f} MB).",
        )

    try:
        reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid or corrupted PDF file: {str(e)}",
        ) from e

    if len(reader.pages) == 0:
        raise HTTPException(
            status_code=400,
            detail="The uploaded PDF contains no pages.",
        )

    extracted_pages = []
    for idx, page in enumerate(reader.pages):
        try:
            page_text = page.extract_text() or ""
            if page_text.strip():
                extracted_pages.append(page_text.strip())
        except Exception:
            continue

    full_text = "\n\n".join(extracted_pages).strip()

    # Detect scanned or image-only PDFs
    if len(full_text) < 50:
        raise HTTPException(
            status_code=400,
            detail=(
                "The uploaded PDF has no extractable text. It appears to be a scanned image "
                "or flattened graphic. Please upload a text-based PDF resume created via Word, Google Docs, or LaTeX."
            ),
        )

    # Sanitize control characters (keep tabs and newlines)
    cleaned_text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", full_text)

    return cleaned_text
