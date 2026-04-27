// backend/src/controllers/documentSearchController.js
import { pool } from "../db.js";

/**
 * GET /api/documents/search?q=satchel+paige&year=1947&type=other
 *
 * Full-text search across all scanned NBC document pages.
 * Returns each matching document with the specific page numbers that matched,
 * plus a snippet from the best matching page.
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

    const docConditions = ["d.is_public = true"];
    if (year) {
      docConditions.push(`d.year = $${pIdx++}`);
      params.push(parseInt(year));
    }
    if (type) {
      docConditions.push(`d.doc_type = $${pIdx++}`);
      params.push(type);
    }

    // Add the search term as the last param
    params.push(terms);
    const tsParam = `$${pIdx}`;

    // Query document_pages for matching pages, group by document
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
        MAX(ts_rank(dp.search_vector, to_tsquery('english', ${tsParam}))) AS rank,
        -- Collect matching page numbers sorted ascending
        array_agg(DISTINCT dp.page_number ORDER BY dp.page_number ASC)
          FILTER (WHERE dp.search_vector @@ to_tsquery('english', ${tsParam}))
          AS matching_pages,
        -- Snippet from the highest-ranking page
        (
          SELECT ts_headline(
            'english',
            dp2.page_text,
            to_tsquery('english', ${tsParam}),
            'MaxWords=35, MinWords=15, ShortWord=3, MaxFragments=2, FragmentDelimiter=" … "'
          )
          FROM document_pages dp2
          WHERE dp2.document_id = d.id
            AND dp2.search_vector @@ to_tsquery('english', ${tsParam})
          ORDER BY ts_rank(dp2.search_vector, to_tsquery('english', ${tsParam})) DESC
          LIMIT 1
        ) AS snippet
      FROM documents d
      JOIN document_pages dp ON dp.document_id = d.id
      WHERE ${docConditions.join(" AND ")}
        AND dp.search_vector @@ to_tsquery('english', ${tsParam})
      GROUP BY d.id, d.title, d.year, d.display_year, d.doc_type,
               d.file_url, d.page_count, d.source_name
      ORDER BY rank DESC, d.year ASC
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
 * Returns distinct years that have indexed pages (for filter dropdown)
 */
export const getIndexedYears = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT DISTINCT d.year, d.display_year
      FROM documents d
      WHERE d.is_public = true
        AND EXISTS (
          SELECT 1 FROM document_pages dp WHERE dp.document_id = d.id
        )
      ORDER BY d.year
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
