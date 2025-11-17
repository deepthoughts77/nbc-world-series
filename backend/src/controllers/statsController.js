import { pool } from "../db.js";

export const getStatsOverview = async (_req, res) => {
  try {
    const champsResult = await pool.query("SELECT COUNT(*) FROM championships");
    const total_championships = parseInt(champsResult.rows[0].count, 10);

    const teamsResult = await pool.query("SELECT COUNT(*) FROM teams");
    const total_teams = parseInt(teamsResult.rows[0].count, 10);

    const mlbResult = await pool.query("SELECT COUNT(*) FROM mlb_alumni");
    const mlb_alumni = parseInt(mlbResult.rows[0].count, 10);

    const hofResult = await pool.query("SELECT COUNT(*) FROM hall_of_fame");
    const hall_of_fame_members = parseInt(hofResult.rows[0].count, 10);

    const mostSuccessfulResult = await pool.query(`
      SELECT
        t.name,
        COUNT(c.id) as championships
      FROM teams t
      LEFT JOIN championships c ON t.id = c.champion_team_id
      GROUP BY t.id, t.name
      ORDER BY championships DESC
      LIMIT 1
    `);

    const most_successful_team = mostSuccessfulResult.rows[0] || {
      name: "—",
      championships: 0,
    };

    res.json({
      total_championships: total_championships,
      total_teams: total_teams,
      hall_of_fame_members: hall_of_fame_members,
      mlb_alumni: mlb_alumni,
      most_successful_team: most_successful_team,
    });
  } catch (err) {
    console.error("statistics/overview error:", err);
    res.status(500).json({ error: "Failed to load statistics" });
  }
};

export const getPlayerStats = async (req, res) => {
  try {
    const { year, team } = req.query;
    const conditions = [];
    const params = [];

    if (year) {
      params.push(parseInt(year, 10));
      conditions.push(`year = $${params.length}`);
    }
    if (team) {
      params.push(`%${team.toLowerCase()}%`);
      conditions.push(`LOWER(team_name) LIKE $${params.length}`);
    }

    const whereSql = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const sql = `
      SELECT
        id, year, team_name, player_name, position,
        g, ab, r, h, "2b", "3b", hr, sb, sh, rbi, po, a, e, pct
      FROM public.player_stats
      ${whereSql}
      ORDER BY year DESC, team_name, player_name
    `;
    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(" /api/player-stats error:", err);
    res.status(500).json({ error: "Failed to fetch player stats" });
  }
};

export const getPlayerStatsYears = async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT DISTINCT year FROM public.player_stats ORDER BY year DESC`
    );
    res.json(rows.map((r) => r.year));
  } catch (err) {
    console.error(" /api/player-stats/years error:", err);
    res.status(500).json({ error: "Failed to fetch years" });
  }
};

export const getPitchingStats = async (req, res) => {
  try {
    const { year, team } = req.query;
    const conditions = [];
    const params = [];

    if (year) {
      params.push(parseInt(year, 10));
      conditions.push(`year = $${params.length}`);
    }
    if (team) {
      params.push(`%${team.toLowerCase()}%`);
      conditions.push(`LOWER(team_name) LIKE $${params.length}`);
    }

    const whereSql = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const sql = `
      SELECT
        id, year, team_name, player_name,
        g, w, l, ip, h, r, er, bb, so, wp, hb
      FROM public.pitching_stats
      ${whereSql}
      ORDER BY year DESC, team_name, player_name
    `;
    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(" /api/pitching-stats error:", err);
    res.status(500).json({ error: "Failed to fetch pitching stats" });
  }
};

export const getPitchingStatsYears = async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT DISTINCT year FROM public.pitching_stats ORDER BY year DESC`
    );
    res.json(rows.map((r) => r.year));
  } catch (err) {
    console.error(" /api/pitching-stats/years error:", err);
    res.status(500).json({ error: "Failed to fetch years" });
  }
};
