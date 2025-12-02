// backend/controllers/playerStatsController.js
import { pool } from "../db.js";

export const searchPlayerStats = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();

    if (!q) {
      return res.status(400).json({
        success: false,
        error: "Query parameter 'q' is required",
      });
    }

    // We use one string and match against:
    //   - full player name
    //   - team name
    //   - year text
    const like = `%${q}%`;

    const sql = `
      SELECT
        b.id,
        b.year,
        t.name AS team_name,
        CONCAT(p.first_name, ' ', p.last_name) AS player_name,
        b.position,
        b.gp, b.gs, b.ab, b.r, b.h,
        b."2b", b."3b", b.hr, b.rbi,
        b.tb, b.slg, b.bb, b.hbp, b.so,
        b.gdp, b.obp, b.sf, b.sh,
        b.sb, b.att, b.avg,
        b.po, b.a, b.e, b.fld
      FROM batting_stats b
      JOIN players p ON p.id = b.player_id
      JOIN teams   t ON t.id = b.team_id
      WHERE
        (p.first_name || ' ' || p.last_name) ILIKE $1
        OR t.name ILIKE $1
        OR CAST(b.year AS TEXT) ILIKE $1
      ORDER BY b.year DESC, team_name, player_name
      LIMIT 200;
    `;

    const result = await pool.query(sql, [like]);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    console.error("Error in searchPlayerStats:", err);
    res.status(500).json({
      success: false,
      error: "Failed to search player stats",
    });
  }
};
