// backend/src/controllers/documentsController.js
import fs from "fs";
import path from "path";
import pool from "../db.js";

const VALID_TYPES = new Set([
  "program",
  "scorebook",
  "record_book",
  "hof",
  "other",
]);

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded.",
      });
    }

    const {
      title,
      year,
      doc_type = "other",
      description,
      page_count,
      pages_with_stats,
      notes,
    } = req.body;

    if (!title || !title.trim()) {
      // delete uploaded temp file if title is missing
      if (req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        success: false,
        error: "Title is required.",
      });
    }

    const docType = VALID_TYPES.has(doc_type) ? doc_type : "other";

    // Build a browser-accessible local file URL
    const filename = path.basename(req.file.path).replace(/\\/g, "/");
    const fileUrl = `/uploads/${filename}`;

    const query = `
      INSERT INTO documents (
        title,
        year,
        doc_type,
        description,
        file_url,
        cloudinary_id,
        file_size_bytes,
        page_count,
        pages_with_stats,
        notes
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
    `;

    const values = [
      title.trim(),
      year ? parseInt(year, 10) : null,
      docType,
      description ? description.trim() : null,
      fileUrl,
      null, // no cloudinary_id when storing locally
      req.file.size || null,
      page_count ? parseInt(page_count, 10) : null,
      pages_with_stats ? pages_with_stats.trim() : null,
      notes ? notes.trim() : null,
    ];

    const { rows } = await pool.query(query, values);

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully.",
      data: rows[0],
    });
  } catch (err) {
    console.error("uploadDocument error:", err);
    console.error("uploadDocument error message:", err.message);
    console.error("uploadDocument error stack:", err.stack);

    // delete uploaded file if DB insert failed
    if (req.file?.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupErr) {
        console.error("Temp file cleanup error:", cleanupErr.message);
      }
    }

    return res.status(500).json({
      success: false,
      error: "Upload failed.",
      detail: err.message,
    });
  }
};

export const getAllDocuments = async (req, res) => {
  try {
    const { year, doc_type } = req.query;

    const conditions = [];
    const values = [];

    if (year) {
      values.push(parseInt(year, 10));
      conditions.push(`year = $${values.length}`);
    }

    if (doc_type) {
      values.push(doc_type);
      conditions.push(`doc_type = $${values.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT *
      FROM documents
      ${whereClause}
      ORDER BY year DESC NULLS LAST, id DESC
    `;

    const { rows } = await pool.query(query, values);

    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
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

export const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      `SELECT * FROM documents WHERE id = $1 LIMIT 1`,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Document not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error("getDocumentById error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch document.",
      detail: err.message,
    });
  }
};

export const getDocumentYears = async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT DISTINCT year
      FROM documents
      WHERE year IS NOT NULL
      ORDER BY year DESC
    `);

    return res.status(200).json({
      success: true,
      data: rows.map((r) => r.year),
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

export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      `SELECT * FROM documents WHERE id = $1 LIMIT 1`,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Document not found.",
      });
    }

    const document = rows[0];

    // delete local file if it exists
    if (document.file_url && document.file_url.startsWith("/uploads/")) {
      const filename = path.basename(document.file_url);
      const fullPath = path.resolve("uploads", filename);

      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (fileErr) {
          console.error("Local file delete error:", fileErr.message);
        }
      }
    }

    await pool.query(`DELETE FROM documents WHERE id = $1`, [id]);

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully.",
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
