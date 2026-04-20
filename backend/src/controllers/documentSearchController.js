// backend/src/controllers/documentSearchController.js
import { pool } from "../db.js";

/**
 * GET /api/documents/search?q=satchel+paige&year=1947&type=tournament_program
 *
 * Full-text search across all scanned NBC document archives.
 * Uses PostgreSQL tsvector index on ocr_text + title + description.
 */
export const searchDocuments = async (req, res) => {
  try {
    const { q, year, type, limit = 20 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: "Query must be at least 2 characters",
      });
    }

    const terms = q.trim().split(/\s+/).join(" & ");
    const params = [];
    let pIdx = 1;

    const conditions = ["d.is_public = true", "d.search_vector IS NOT NULL"];

    if (year) {
      conditions.push(`d.year = $${pIdx++}`);
      params.push(parseInt(year));
    }
    if (type) {
      conditions.push(`d.doc_type = $${pIdx++}`);
      params.push(type);
    }

    // Add search term as final param
    params.push(terms);
    const tsParam = `$${pIdx}`;

    const sql = `
      SELECT
        d.id,
        d.title,
        d.year,
        d.display_year,
        d.doc_type,
        d.file_url,
        d.page_count,
        d.source_name,
        ts_rank(d.search_vector, to_tsquery('english', ${tsParam})) AS rank,
        ts_headline(
          'english',
          COALESCE(d.ocr_text, d.description, ''),
          to_tsquery('english', ${tsParam}),
          'MaxWords=40, MinWords=20, ShortWord=3, MaxFragments=2, FragmentDelimiter=" … "'
        ) AS snippet
      FROM documents d
      WHERE ${conditions.join(" AND ")}
        AND d.search_vector @@ to_tsquery('english', ${tsParam})
      ORDER BY rank DESC, d.sort_year ASC
      LIMIT ${Math.min(parseInt(limit) || 20, 50)}
    `;

    const { rows } = await pool.query(sql, params);

    res.json({
      success: true,
      query: q,
      count: rows.length,
      data: rows,
    });
  } catch (err) {
    console.error("documentSearch error:", err);
    res.status(500).json({
      success: false,
      error: "Search failed",
      message: err.message,
    });
  }
};

/**
 * GET /api/documents/search/years
 * Returns distinct years that have indexed documents (for filter dropdown)
 */
export const getIndexedYears = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT DISTINCT year, display_year
      FROM documents
      WHERE is_public = true AND search_vector IS NOT NULL
      ORDER BY year
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
