import io
import json
import urllib.request

import pypdf

# 1. Create a minimal valid text PDF using pypdf
writer = pypdf.PdfWriter()
page = writer.add_blank_page(width=612, height=792)

# Create a PDF with actual resume text using reportlab or raw PDF stream
# Let's write a standard PDF format directly with text stream
pdf_stream = b"""%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 260 >>
stream
BT
/F1 12 Tf
72 720 Td
(Akshita Kumari) Tj
0 -20 Td
(Software Engineer - AI & Backend Development) Tj
0 -20 Td
(Skills: Python, FastAPI, PostgreSQL, Docker, PyTorch, React, LangGraph) Tj
0 -20 Td
(Education: B.Tech in Computer Science, 2026) Tj
0 -20 Td
(Experience: AI Engineering Intern at TechLabs building LLM agents and pgvector search.) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000224 00000 n 
0000000537 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
607
%%EOF
"""

print(f"Generated test resume PDF: {len(pdf_stream)} bytes")

# Test pypdf extraction locally first
reader = pypdf.PdfReader(io.BytesIO(pdf_stream))
text = reader.pages[0].extract_text()
print(f"Extracted raw text from test PDF:\n{text}\n")

# Now upload to http://localhost:8000/api/profile/resume via multipart/form-data
boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
body = (
    f"--{boundary}\r\n"
    f'Content-Disposition: form-data; name="file"; filename="akshita_resume.pdf"\r\n'
    f"Content-Type: application/pdf\r\n\r\n"
).encode("utf-8") + pdf_stream + f"\r\n--{boundary}--\r\n".encode("utf-8")

req = urllib.request.Request(
    "http://localhost:8000/api/profile/resume",
    data=body,
    headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    method="POST",
)

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        print("SUCCESS! Endpoint response from Gemini:")
        print(json.dumps(data, indent=2))
except Exception as e:
    print(f"FAILED: {e}")
    if hasattr(e, "read"):
        print(e.read().decode("utf-8"))
