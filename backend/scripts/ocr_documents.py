"""
NBC Document Archive — OCR Extraction Script (Per-Page Version)
===============================================================
Downloads each PDF from libasimages.wichita.edu, runs OCR on every page,
and stores text PER PAGE in the document_pages table.
Also updates documents.ocr_text with the full combined text.

Usage:
  python ocr_documents.py                  # process all unprocessed docs
  python ocr_documents.py --doc-id 11      # process one document by ID
  python ocr_documents.py --reprocess      # reprocess all (overwrite existing)

Requirements:
  pip install pymupdf pytesseract pillow psycopg2-binary requests
  tesseract must be installed (apt install tesseract-ocr)
"""

import argparse
import time

import fitz           # PyMuPDF
import psycopg2
import pytesseract
import requests
from PIL import Image

# ── Database connection ───────────────────────────────────────────────────
DB_CONFIG = {
    "host":     "127.0.0.1",
    "port":     5432,
    "dbname":   "nbc_world_series",
    "user":     "nbc_admin",
    "password": "Ghostweep147@",
}

DPI  = 200
LANG = "eng"


def ensure_columns(cur):
    cur.execute("""
        ALTER TABLE documents ADD COLUMN IF NOT EXISTS ocr_text TEXT;
        ALTER TABLE documents ADD COLUMN IF NOT EXISTS search_vector tsvector;
    """)
    cur.execute("""
        CREATE INDEX IF NOT EXISTS idx_documents_search
        ON documents USING GIN(search_vector);
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS document_pages (
          id            SERIAL PRIMARY KEY,
          document_id   INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
          page_number   INTEGER NOT NULL,
          page_text     TEXT,
          search_vector TSVECTOR,
          UNIQUE(document_id, page_number)
        );
        CREATE INDEX IF NOT EXISTS idx_document_pages_search
          ON document_pages USING GIN(search_vector);
        CREATE INDEX IF NOT EXISTS idx_document_pages_doc_id
          ON document_pages(document_id);
    """)
    print("✅ Schema ready")


def get_documents(cur, doc_id=None, reprocess=False):
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
        # Process docs that have no pages yet
        cur.execute(
            "SELECT d.id, d.title, d.year, d.file_url FROM documents d "
            "WHERE d.file_url IS NOT NULL AND d.is_public = true "
            "AND NOT EXISTS ("
            "  SELECT 1 FROM document_pages dp WHERE dp.document_id = d.id"
            ") "
            "ORDER BY d.sort_year"
        )
    return cur.fetchall()


def download_pdf(url):
    print(f"  ↓ Downloading {url}")
    r = requests.get(url, timeout=120)
    r.raise_for_status()
    return r.content


def ocr_pdf_pages(pdf_bytes):
    """Returns list of (page_number, page_text) tuples, 1-indexed."""
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    total = len(doc)
    pages = []

    print(f"  📄 {total} pages — running OCR...")
    for i in range(total):
        page_num = i + 1
        page = doc[i]

        # Try native text first
        native = page.get_text().strip()
        if len(native) > 50:
            pages.append((page_num, native))
            continue

        # Fall back to OCR
        mat = fitz.Matrix(DPI / 72, DPI / 72)
        pix = page.get_pixmap(matrix=mat, clip=page.rect)
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        text = pytesseract.image_to_string(img, lang=LANG)
        pages.append((page_num, text))

        if page_num % 10 == 0:
            print(f"    ... page {page_num}/{total}")

    doc.close()
    total_words = sum(len(t.split()) for _, t in pages)
    print(f"  ✅ Extracted ~{total_words:,} words across {total} pages")
    return pages


def save_to_db(cur, doc_id, pages):
    """Save per-page rows and update the document's combined ocr_text."""

    # Delete existing pages for this doc (clean reprocess)
    cur.execute("DELETE FROM document_pages WHERE document_id = %s", (doc_id,))

    # Insert each page
    for page_num, page_text in pages:
        cur.execute("""
            INSERT INTO document_pages (document_id, page_number, page_text, search_vector)
            VALUES (%s, %s, %s, to_tsvector('english', COALESCE(%s, '')))
            ON CONFLICT (document_id, page_number) DO UPDATE
              SET page_text     = EXCLUDED.page_text,
                  search_vector = EXCLUDED.search_vector
        """, (doc_id, page_num, page_text, page_text))

    # Update full-text on documents table too
    combined = "\n\n".join(text for _, text in pages)
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
    """, (combined, combined, doc_id))


def main():
    parser = argparse.ArgumentParser(description="OCR NBC document archive (per-page)")
    parser.add_argument("--doc-id", type=int, help="Process a single document by ID")
    parser.add_argument("--reprocess", action="store_true", help="Reprocess all")
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
                pages     = ocr_pdf_pages(pdf_bytes)
                save_to_db(cur, doc_id, pages)
                conn.commit()
                print(f"  💾 Saved {len(pages)} pages to database\n")
            except Exception as e:
                conn.rollback()
                print(f"  ❌ Error: {e}\n")
                continue

            if i < len(docs):
                time.sleep(2)

        print("✅ OCR complete! Sync local → Neon when ready.")

    finally:
        cur.close()
        conn.close()


if __name__ == "__main__":
    main()