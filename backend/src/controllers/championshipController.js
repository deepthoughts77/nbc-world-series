// backend/src/controllers/championshipController.js
import { pool } from "../db.js";

/**
 * @description Get all championships
 * @route GET /api/championships
 */
export const getAllChampionships = async (_req, res) => {
  try {
    const query = `
      SELECT 
        c.id,
        c.year,
        c.championship_score,
        ct.name  AS champion_name,
        ct.city  AS champion_city,
        ct.state AS champion_state,
        rt.name  AS runner_up_name,
        rt.city  AS runner_up_city,
        rt.state AS runner_up_state,
        CONCAT(p.first_name, ' ', p.last_name) as mvp
      FROM championships c
      LEFT JOIN teams ct ON c.champion_team_id = ct.id
      LEFT JOIN teams rt ON c.runner_up_team_id = rt.id
      LEFT JOIN players p ON c.mvp_player_id = p.id
      ORDER BY c.year DESC
    `;

    const result = await pool.query(query);

    res.json({
      success: true,
      count: result.rows.length,
      total: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching championships:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch championships",
    });
  }
};

/**
 * @description Get a single championship by year
 * @route GET /api/championships/:year
 */
export const getChampionshipByYear = async (req, res) => {
  try {
    const { year } = req.params;

    if (!/^\d{4}$/.test(year)) {
      return res
        .status(400)
        .json({ success: false, error: "Year must be a 4-digit number" });
    }

    const query = `
      SELECT 
        c.id,
        c.year,
        c.championship_score,
        ct.name  AS champion_name,
        ct.city  AS champion_city,
        ct.state AS champion_state,
        rt.name  AS runner_up_name,
        rt.city  AS runner_up_city,
        rt.state AS runner_up_state,
        CONCAT(p.first_name, ' ', p.last_name) as mvp
      FROM championships c
      LEFT JOIN teams ct ON c.champion_team_id = ct.id
      LEFT JOIN teams rt ON c.runner_up_team_id = rt.id
      LEFT JOIN players p ON c.mvp_player_id = p.id
      WHERE c.year = $1
      LIMIT 1
    `;

    const result = await pool.query(query, [Number(year)]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Championship not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching championship:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch championship",
    });
  }
};

/**
 * @description Get championship final stats (batting + pitching)
 * @route GET /api/championships/:year/final
 * Query:
 *   ?team=runner_up  -> runner-up only
 *   default -> champion + runner-up
 *
 * NOTE: final tables DO NOT have championship_id in your DB.
 * They only have year + team_id, so we filter by those.
 */
export const getChampionshipFinalStats = async (req, res) => {
  try {
    const { year } = req.params;
    const teamMode = String(req.query.team || "").toLowerCase(); // "runner_up" or ""

    if (!/^\d{4}$/.test(year)) {
      return res
        .status(400)
        .json({ success: false, error: "Year must be a 4-digit number" });
    }

    // Find champion + runner-up team ids from championships table
    const champRes = await pool.query(
      `
      SELECT
        c.id AS championship_id,
        c.year,
        c.champion_team_id,
        c.runner_up_team_id,
        ct.name AS champion_name,
        rt.name AS runner_up_name,
        CONCAT(p.first_name, ' ', p.last_name) AS mvp_name
      FROM championships c
      LEFT JOIN teams ct ON c.champion_team_id = ct.id
      LEFT JOIN teams rt ON c.runner_up_team_id = rt.id
      LEFT JOIN players p ON c.mvp_player_id = p.id
      WHERE c.year = $1
      LIMIT 1
      `,
      [Number(year)],
    );

    if (champRes.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Championship not found" });
    }

    const champ = champRes.rows[0];

    const teamIds =
      teamMode === "runner_up"
        ? [champ.runner_up_team_id]
        : [champ.champion_team_id, champ.runner_up_team_id];

    // Batting: ONLY columns that exist in your screenshot
    const battingRes = await pool.query(
      `
      SELECT
        b.team_id,
        t.name AS team_name,
        b.player_name,
        b.ab, b.r, b.h, b.rbi, b.bb, b.so
      FROM championship_final_batting b
      JOIN teams t ON t.id = b.team_id
      WHERE b.year = $1
        AND b.team_id = ANY($2::int[])
      ORDER BY t.name, b.player_name
      `,
      [Number(year), teamIds],
    );

    // Pitching: ONLY columns that exist in your screenshot
    const pitchingRes = await pool.query(
      `
      SELECT
        p.team_id,
        t.name AS team_name,
        p.player_name,
        p.ip, p.h, p.r, p.er, p.bb, p.so, p.bf, p.hbp, p.wp, p.bk, p.rbi, p.decision, p.ab
      FROM championship_final_pitching p
      JOIN teams t ON t.id = p.team_id
      WHERE p.year = $1
        AND p.team_id = ANY($2::int[])
      ORDER BY t.name, p.player_name
      `,
      [Number(year), teamIds],
    );

    const byTeam = new Map();

    function ensureTeam(team_id, team_name) {
      if (!byTeam.has(team_id)) {
        byTeam.set(team_id, {
          team_id,
          team_name,
          batting: [],
          pitching: [],
        });
      }
      return byTeam.get(team_id);
    }

    for (const row of battingRes.rows) {
      ensureTeam(row.team_id, row.team_name).batting.push(row);
    }
    for (const row of pitchingRes.rows) {
      ensureTeam(row.team_id, row.team_name).pitching.push(row);
    }

    res.json({
      success: true,
      meta: {
        year: champ.year,
        championship_id: champ.championship_id,
        champion: {
          team_id: champ.champion_team_id,
          name: champ.champion_name,
        },
        runner_up: {
          team_id: champ.runner_up_team_id,
          name: champ.runner_up_name,
        },
        mvp: champ.mvp_name || null,
        mode: teamMode === "runner_up" ? "runner_up" : "both",
      },
      data: Array.from(byTeam.values()),
    });
  } catch (error) {
    console.error("Error fetching final stats:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch final stats" });
  }
};

/**
 * @description Get MVP stats
 * @route GET /api/championships/:year/mvp
 *
 * NOTE: Your Neon DB does NOT have championship_mvp_stats, so we do NOT query it.
 * We do best-effort from final tables.
 */
export const getChampionshipMvpStats = async (req, res) => {
  try {
    const { year } = req.params;

    if (!/^\d{4}$/.test(year)) {
      return res
        .status(400)
        .json({ success: false, error: "Year must be a 4-digit number" });
    }

    const champRes = await pool.query(
      `
      SELECT
        c.id AS championship_id,
        CONCAT(p.first_name, ' ', p.last_name) AS mvp_name
      FROM championships c
      LEFT JOIN players p ON c.mvp_player_id = p.id
      WHERE c.year = $1
      LIMIT 1
      `,
      [Number(year)],
    );

    if (champRes.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Championship not found" });
    }

    const champ = champRes.rows[0];

    if (!champ.mvp_name) {
      return res.json({ success: true, data: null, note: "No MVP awarded" });
    }

    const name = champ.mvp_name;

    const batRes = await pool.query(
      `
      SELECT b.*, t.name AS team_name
      FROM championship_final_batting b
      JOIN teams t ON t.id = b.team_id
      WHERE b.year = $1 AND b.player_name ILIKE $2
      ORDER BY t.name, b.player_name
      LIMIT 10
      `,
      [Number(year), `%${name}%`],
    );

    const pitRes = await pool.query(
      `
      SELECT p.*, t.name AS team_name
      FROM championship_final_pitching p
      JOIN teams t ON t.id = p.team_id
      WHERE p.year = $1 AND p.player_name ILIKE $2
      ORDER BY t.name, p.player_name
      LIMIT 10
      `,
      [Number(year), `%${name}%`],
    );

    res.json({
      success: true,
      data: {
        mvp_name: champ.mvp_name,
        source: "final_game_best_effort",
        batting: batRes.rows,
        pitching: pitRes.rows,
      },
    });
  } catch (error) {
    console.error("Error fetching MVP stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch MVP stats",
    });
  }
};
