// backend/src/routes/hallOfFame.js
const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// GET /api/hall-of-fame  (list with optional pagination & search)
router.get("/", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "50", 10), 100);
    const offset = parseInt(req.query.offset || "0", 10);
    const q = (req.query.q || "").trim();

    let where = "";
    const params = [];

    if (q) {
      where = `WHERE inductee_name ILIKE $1`;
      params.push(`%${q}%`);
    }

    const countSql = `SELECT COUNT(*)::int AS count FROM hall_of_fame ${where}`;
    const listSql = `
      SELECT id, inductee_name, induction_year, player_id, category, bio
      FROM hall_of_fame
      ${where}
      ORDER BY induction_year DESC, inductee_name
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const [
      {
        rows: [{ count }],
      },
      { rows },
    ] = await Promise.all([
      pool.query(countSql, params),
      pool.query(listSql, [...params, limit, offset]),
    ]);

    res.json({
      success: true,
      total: count,
      limit,
      offset,
      data: rows, // an array — good for your frontend
    });
  } catch (err) {
    console.error("HOF list error:", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to load Hall of Fame" });
  }
});

// GET /api/hall-of-fame/:id  (single member)
router.get("/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, inductee_name, induction_year, player_id, category, bio
       FROM hall_of_fame
       WHERE id = $1`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: "Not found" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("HOF detail error:", err);
    res.status(500).json({ success: false, error: "Failed to load member" });
  }
});

module.exports = router;
