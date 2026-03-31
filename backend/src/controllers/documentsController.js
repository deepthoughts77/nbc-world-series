// backend/src/controllers/documentsController.js
// Metadata controller for NBC World Series documents.
// PDFs are hosted at Wichita State University Libraries Special Collections.
// This site stores metadata + stable institutional URLs only.

import pool from "../db.js";

const VALID_TYPES = new Set([
  "annual",
  "program",
  "scorebook",
  "record_book",
  "hof",
  "photo_booklet",
  "guide",
  "other",
]);

// ── GET /api/documents ────────────────────────────────────────────────────
export const getAllDocuments = async (req, res) => {
  try {
    const {
      year,
      doc_type,
      q,
      limit = 500,
      offset = 0,
      public_only = "true",
    } = req.query;

    const conditions = [];
    const values = [];
    let p = 1;

    if (public_only !== "false") {
      conditions.push(`is_public = true`);
    }

    if (year) {
      conditions.push(`sort_year = $${p++}`);
      values.push(parseInt(year, 10));
    }

    if (doc_type && VALID_TYPES.has(doc_type)) {
      conditions.push(`doc_type = $${p++}`);
      values.push(doc_type);
    }

    if (q) {
      conditions.push(
        `(title ILIKE $${p} OR description ILIKE $${p} OR notes ILIKE $${p})`,
      );
      values.push(`%${q}%`);
      p++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const [countRes, listRes] = await Promise.all([
      pool.query(
        `SELECT COUNT(*)::int AS count FROM documents ${whereClause}`,
        values,
      ),
      pool.query(
        `SELECT id, title, display_year, sort_year, year, doc_type,
                description, file_url, page_count, pages_with_stats,
                notes, source_name, source_credit, is_public, uploaded_at
         FROM documents
         ${whereClause}
         ORDER BY sort_year ASC NULLS LAST, title ASC
         LIMIT $${p} OFFSET $${p + 1}`,
        [...values, parseInt(limit), parseInt(offset)],
      ),
    ]);

    return res.status(200).json({
      success: true,
      total: countRes.rows[0].count,
      count: listRes.rows.length,
      data: listRes.rows,
    });
  } catch (err) {
    console.error("getAllDocuments error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch documents.",
      detail: err.message,
    });
  }
};

// ── GET /api/documents/years ──────────────────────────────────────────────
export const getDocumentYears = async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT DISTINCT sort_year AS year, display_year
      FROM documents
      WHERE sort_year IS NOT NULL AND is_public = true
      ORDER BY sort_year ASC
    `);

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("getDocumentYears error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch document years.",
      detail: err.message,
    });
  }
};

// ── GET /api/documents/:id ────────────────────────────────────────────────
export const getDocumentById = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM documents WHERE id = $1 LIMIT 1`,
      [req.params.id],
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Document not found." });
    }

    return res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("getDocumentById error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch document.",
      detail: err.message,
    });
  }
};

// ── POST /api/documents ───────────────────────────────────────────────────
// ── POST /api/documents ───────────────────────────────────────────────────
export const createDocument = async (req, res) => {
  try {
    const {
      title,
      display_year,
      sort_year,
      year,
      doc_type = "other",
      description,
      file_url,
      page_count,
      pages_with_stats,
      notes,
      source_name = "Wichita State University Libraries Special Collections",
      source_credit,
      is_public = true,
    } = req.body;

    if (!title || !title.trim()) {
      return res
        .status(400)
        .json({ success: false, error: "Title is required." });
    }
    if (!file_url || !file_url.trim()) {
      return res
        .status(400)
        .json({ success: false, error: "File URL is required." });
    }

    const docType = VALID_TYPES.has(doc_type) ? doc_type : "other";
    const sortYear = sort_year
      ? parseInt(sort_year, 10)
      : year
        ? parseInt(year, 10)
        : null;
    const displayYear = display_year || (sortYear ? String(sortYear) : null);

    const { rows } = await pool.query(
      `INSERT INTO documents
          (title, display_year, sort_year, year, doc_type, description,
           file_url, page_count, pages_with_stats, notes,
           source_name, source_credit, is_public)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [
        title.trim(),
        displayYear,
        sortYear,
        sortYear,
        docType,
        description ? description.trim() : null,
        file_url.trim(),
        page_count ? parseInt(page_count, 10) : null,
        pages_with_stats ? pages_with_stats.trim() : null,
        notes ? notes.trim() : null,
        source_name,
        source_credit || null,
        is_public !== false && is_public !== "false",
      ],
    );

    // FIX: Keep the response logic INSIDE the try block
    if (rows && rows.length > 0) {
      return res.status(201).json({ success: true, data: rows[0] });
    } else {
      return res.status(201).json({
        success: true,
        message: "Document created successfully, but no data returned.",
      });
    }
  } catch (err) {
    console.error("createDocument error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to create document record.",
      detail: err.message,
    });
  }
};

// ── PUT /api/documents/:id ────────────────────────────────────────────────
export const updateDocument = async (req, res) => {
  try {
    const {
      title,
      display_year,
      sort_year,
      doc_type,
      description,
      file_url,
      page_count,
      pages_with_stats,
      notes,
      source_name,
      source_credit,
      is_public,
    } = req.body;

    const { rows } = await pool.query(
      `UPDATE documents SET
         title            = COALESCE($1,  title),
         display_year     = COALESCE($2,  display_year),
         sort_year        = COALESCE($3,  sort_year),
         doc_type         = COALESCE($4,  doc_type),
         description      = COALESCE($5,  description),
         file_url         = COALESCE($6,  file_url),
         page_count       = COALESCE($7,  page_count),
         pages_with_stats = COALESCE($8,  pages_with_stats),
         notes            = COALESCE($9,  notes),
         source_name      = COALESCE($10, source_name),
         source_credit    = COALESCE($11, source_credit),
         is_public        = COALESCE($12, is_public),
         updated_at       = NOW()
       WHERE id = $13
       RETURNING *`,
      [
        title ? title.trim() : null,
        display_year || null,
        sort_year ? parseInt(sort_year, 10) : null,
        doc_type && VALID_TYPES.has(doc_type) ? doc_type : null,
        description !== undefined ? description : null,
        file_url ? file_url.trim() : null,
        page_count ? parseInt(page_count, 10) : null,
        pages_with_stats !== undefined ? pages_with_stats : null,
        notes !== undefined ? notes : null,
        source_name || null,
        source_credit !== undefined ? source_credit : null,
        is_public !== undefined
          ? is_public !== false && is_public !== "false"
          : null,
        req.params.id,
      ],
    );

    if (!rows.length) {
      return res
        .status(404)
        .json({ success: false, error: "Document not found." });
    }
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("updateDocument error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to update document.",
      detail: err.message,
    });
  }
};

// ── DELETE /api/documents/:id ─────────────────────────────────────────────
export const deleteDocument = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, title FROM documents WHERE id = $1 LIMIT 1`,
      [req.params.id],
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Document not found." });
    }

    await pool.query(`DELETE FROM documents WHERE id = $1`, [req.params.id]);

    return res.status(200).json({
      success: true,
      message: `Deleted: ${rows[0].title}`,
    });
  } catch (err) {
    console.error("deleteDocument error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to delete document.",
      detail: err.message,
    });
  }
};
