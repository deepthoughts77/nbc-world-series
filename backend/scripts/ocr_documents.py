"""
NBC Document Archive — OCR Extraction Script
============================================
Downloads each PDF from libasimages.wichita.edu, runs OCR on every page,
and stores the extracted text in the documents.ocr_text column.
Builds a PostgreSQL tsvector search index automatically.

Usage:
  python ocr_documents.py                  # process all unprocessed docs
  python ocr_documents.py --doc-id 11      # process one document by ID
  python ocr_documents.py --reprocess      # reprocess all (overwrite existing)

Requirements:
  pip install pymupdf pytesseract pillow psycopg2-binary requests
  tesseract must be installed (brew install tesseract / apt install tesseract-ocr)
"""

import argparse
import io
import sys
import time

import fitz           # PyMuPDF
import psycopg2
import pytesseract
import requests
from PIL import Image

# ── Database connection ───────────────────────────────────────────────────
# Update this to point at your LOCAL nbc_world_series database
DB_CONFIG = {
    "host":     "127.0.0.1",
    "port":     5432,
    "dbname":   "nbc_world_series",
    "user":     "nbc_admin",
    "password": "Ghostweep147@",
}

# OCR settings
DPI = 200          # 200 is fast; raise to 300 for better accuracy on small text
LANG = "eng"       # Tesseract language


def ensure_columns(cur):
    """Add ocr_text and search_vector columns if they don't exist yet."""
    cur.execute("""
        ALTER TABLE documents ADD COLUMN IF NOT EXISTS ocr_text TEXT;
        ALTER TABLE documents ADD COLUMN IF NOT EXISTS search_vector tsvector;
    """)
    cur.execute("""
        CREATE INDEX IF NOT EXISTS idx_documents_search
        ON documents USING GIN(search_vector);
    """)
    print("✅ Columns and index ready")


def get_documents(cur, doc_id=None, reprocess=False):
    """Fetch documents to process."""
    if doc_id:
        cur.execute(
            "SELECT id, title, year, file_url FROM documents WHERE id = %s",
            (doc_id,)
        )
    elif reprocess:
        cur.execute(
            "SELECT id, title, year, file_url FROM documents "
            "WHERE file_url IS NOT NULL AND is_public = true "
            "ORDER BY sort_year"
        )
    else:
        cur.execute(
            "SELECT id, title, year, file_url FROM documents "
            "WHERE file_url IS NOT NULL AND is_public = true "
            "AND (ocr_text IS NULL OR ocr_text = '') "
            "ORDER BY sort_year"
        )
    return cur.fetchall()


def download_pdf(url):
    """Download PDF bytes from URL."""
    print(f"  ↓ Downloading {url}")
    r = requests.get(url, timeout=120)
    r.raise_for_status()
    return r.content


def ocr_pdf(pdf_bytes, title):
    """Extract text from all pages of a PDF using OCR."""
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    total_pages = len(doc)
    all_text = []

    print(f"  📄 {total_pages} pages — running OCR...")
    for page_num in range(total_pages):
        page = doc[page_num]

        # First try native text extraction (fast, works for text-based PDFs)
        native_text = page.get_text().strip()
        if len(native_text) > 50:
            all_text.append(native_text)
            continue

        # Fall back to OCR for scanned/image pages
        mat = fitz.Matrix(DPI / 72, DPI / 72)
        clip = page.rect
        pix = page.get_pixmap(matrix=mat, clip=clip)
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        text = pytesseract.image_to_string(img, lang=LANG)
        all_text.append(text)

        if (page_num + 1) % 10 == 0:
            print(f"    ... page {page_num + 1}/{total_pages}")

    doc.close()
    combined = "\n\n".join(all_text)
    word_count = len(combined.split())
    print(f"  ✅ Extracted ~{word_count:,} words")
    return combined


def save_to_db(cur, doc_id, ocr_text):
    """Save OCR text and update search vector."""
    cur.execute("""
        UPDATE documents
        SET ocr_text = %s,
            search_vector = to_tsvector('english',
                COALESCE(title, '') || ' ' ||
                COALESCE(description, '') || ' ' ||
                COALESCE(%s, '')
            ),
            updated_at = NOW()
        WHERE id = %s
    """, (ocr_text, ocr_text, doc_id))


def main():
    parser = argparse.ArgumentParser(description="OCR NBC document archive")
    parser.add_argument("--doc-id", type=int, help="Process a single document by ID")
    parser.add_argument("--reprocess", action="store_true", help="Reprocess all documents")
    args = parser.parse_args()

    conn = psycopg2.connect(**DB_CONFIG)
    conn.autocommit = False
    cur = conn.cursor()

    try:
        ensure_columns(cur)
        conn.commit()

        docs = get_documents(cur, doc_id=args.doc_id, reprocess=args.reprocess)
        print(f"\n📚 {len(docs)} document(s) to process\n")

        if not docs:
            print("Nothing to process. Use --reprocess to rerun all.")
            return

        for i, (doc_id, title, year, file_url) in enumerate(docs, 1):
            print(f"[{i}/{len(docs)}] {year} — {title} (id={doc_id})")
            try:
                pdf_bytes = download_pdf(file_url)
                ocr_text = ocr_pdf(pdf_bytes, title)
                save_to_db(cur, doc_id, ocr_text)
                conn.commit()
                print(f"  💾 Saved to database\n")
            except Exception as e:
                conn.rollback()
                print(f"  ❌ Error: {e}\n")
                continue

            # Small pause between documents to be polite to the server
            if i < len(docs):
                time.sleep(2)

        print("✅ OCR extraction complete!")
        print("\nNext: sync local → Neon, then the search endpoint will work.")

    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    main()