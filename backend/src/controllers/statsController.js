// backend/src/controllers/statsController.js
import { pool } from "../db.js";

/* ====================== OVERVIEW SUMMARY ====================== */

export const getStatsOverview = async (_req, res) => {
  try {
    const champsResult = await pool.query("SELECT COUNT(*) FROM championships");
    const teamsResult = await pool.query("SELECT COUNT(*) FROM teams");
    const mlbResult = await pool.query("SELECT COUNT(*) FROM mlb_alumni");
    const hofResult = await pool.query("SELECT COUNT(*) FROM hall_of_fame");

    const mostSuccessfulResult = await pool.query(`
      SELECT
        t.name,
        COUNT(c.id) AS championships
      FROM teams t
      LEFT JOIN championships c ON t.id = c.champion_team_id
      GROUP BY t.id, t.name
      ORDER BY championships DESC
      LIMIT 1
    `);

    res.json({
      total_championships: parseInt(champsResult.rows[0].count, 10),
      total_teams: parseInt(teamsResult.rows[0].count, 10),
      mlb_alumni: parseInt(mlbResult.rows[0].count, 10),
      hall_of_fame_members: parseInt(hofResult.rows[0].count, 10),
      most_successful_team: mostSuccessfulResult.rows[0] || {
        name: "—",
        championships: 0,
      },
    });
  } catch (err) {
    console.error("statistics/overview error:", err);
    res.status(500).json({ error: "Failed to load statistics" });
  }
};

/* ====================== PLAYER (BATTING) STATS ====================== */
/**
 * If year === 1966 → use legacy player_stats table.
 * Otherwise → use batting_stats + players + teams.
 */
export const getPlayerStats = async (req, res) => {
  try {
    const { year, team } = req.query;

    if (!year) {
      return res
        .status(400)
        .json({ error: "Query parameter 'year' is required" });
    }

    const y = parseInt(year, 10);
    if (Number.isNaN(y)) {
      return res.status(400).json({ error: "Invalid 'year' parameter" });
    }

    /* ---------- A) 1966 → legacy player_stats ---------- */
    if (y === 1966) {
      const params = [y];
      let teamFilterSql = "";

      if (team) {
        params.push(`%${team.toLowerCase()}%`);
        teamFilterSql = ` AND LOWER(team_name) LIKE $${params.length}`;
      }

      const sql = `
        SELECT
          id,
          year,
          team_name,
          player_name,
          g,
          ab,
          r,
          h,
          "2b",
          "3b",
          hr,
          sb,
          sh,
          rbi
        FROM public.player_stats
        WHERE year = $1
        ${teamFilterSql}
        ORDER BY team_name, player_name
      `;

      const { rows } = await pool.query(sql, params);

      const formatted = rows.map((r) => {
        const avg =
          r.ab && r.ab !== 0
            ? Number((Number(r.h) / Number(r.ab)).toFixed(3))
            : null;

        return {
          id: r.id,
          year: r.year,
          team_name: r.team_name,
          player_name: r.player_name,
          g: r.g,
          gp: r.g,
          ab: r.ab,
          r: r.r,
          h: r.h,
          "2b": r["2b"],
          "3b": r["3b"],
          hr: r.hr,
          rbi: r.rbi,
          bb: null,
          so: null,
          sb: r.sb,
          avg,
          obp: null,
          slg: null,
          ops: null,
        };
      });

      return res.json(formatted);
    }

    /* ---------- B) modern years → batting_stats path ---------- */

    const conditions = [];
    const params = [];

    if (year) {
      params.push(parseInt(year, 10));
      conditions.push(`b.year = $${params.length}`);
    }

    if (team) {
      params.push(`%${team.toLowerCase()}%`);
      conditions.push(`LOWER(t.name) LIKE $${params.length}`);
    }

    const whereSql =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const sql = `
      SELECT
        b.id,
        b.year,
        t.name AS team_name,
        p.first_name,
        p.last_name,
        b.jersey_num,
        b.position,
        b.gp,
        b.gs,
        b.ab,
        b.r,
        b.h,
        b."2b",
        b."3b",
        b.hr,
        b.rbi,
        b.tb,
        b.slg,
        b.bb,
        b.hbp,
        b.so,
        b.gdp,
        b.obp,
        b.sf,
        b.sh,
        b.sb,
        b.att,
        b.avg,
        b.po,
        b.a,
        b.e,
        b.fld
      FROM public.batting_stats AS b
      JOIN public.players AS p ON p.id = b.player_id
      JOIN public.teams   AS t ON t.id = b.team_id
      ${whereSql}
      ORDER BY b.year DESC, t.name, p.last_name, p.first_name
    `;

    const { rows } = await pool.query(sql, params);

    const formatted = rows.map((r) => ({
      id: r.id,
      year: r.year,
      team_name: r.team_name,
      player_name: `${r.first_name ?? ""} ${r.last_name ?? ""}`.trim(),
      jersey_num: r.jersey_num,
      position: r.position,
      g: r.gp,
      gp: r.gp,
      gs: r.gs,
      ab: r.ab,
      r: r.r,
      h: r.h,
      "2b": r["2b"],
      "3b": r["3b"],
      hr: r.hr,
      rbi: r.rbi,
      tb: r.tb,
      slg: r.slg,
      bb: r.bb,
      hbp: r.hbp,
      so: r.so,
      gdp: r.gdp,
      obp: r.obp,
      sf: r.sf,
      sh: r.sh,
      sb: r.sb,
      att: r.att,
      avg: r.avg,
      po: r.po,
      a: r.a,
      e: r.e,
      fld: r.fld,
      ops:
        r.obp != null && r.slg != null
          ? Number((Number(r.obp) + Number(r.slg)).toFixed(3))
          : null,
    }));

    return res.json(formatted);
  } catch (err) {
    console.error(" /api/player-stats error:", err);
    res.status(500).json({ error: "Failed to fetch player stats" });
  }
};

/**
 * Years for the Player Stats dropdown.
 * Union of:
 *  - legacy player_stats
 *  - batting_stats
 *  - pitching_stats (in case of extra years)
 */
export const getPlayerStatsYears = async (_req, res) => {
  try {
    const years = new Set();

    const collect = (rows) => {
      for (const r of rows) {
        const y = parseInt(r.year, 10);
        if (!Number.isNaN(y)) years.add(y);
      }
    };

    try {
      const r1 = await pool.query(
        `SELECT DISTINCT year FROM public.player_stats`
      );
      collect(r1.rows);
    } catch (e) {
      console.warn("player_stats year query failed:", e.message);
    }

    try {
      const r2 = await pool.query(
        `SELECT DISTINCT year FROM public.batting_stats`
      );
      collect(r2.rows);
    } catch (e) {
      console.warn("batting_stats year query failed:", e.message);
    }

    try {
      const r3 = await pool.query(
        `SELECT DISTINCT year FROM public.pitching_stats`
      );
      collect(r3.rows);
    } catch (e) {
      console.warn("pitching_stats year query failed:", e.message);
    }

    const sorted = Array.from(years).sort((a, b) => b - a);
    res.json(sorted);
  } catch (err) {
    console.error(" /api/player-stats/years error:", err);
    res.status(500).json({ error: "Failed to fetch years" });
  }
};

/* ====================== PITCHING STATS ====================== */

export const getPitchingStats = async (req, res) => {
  try {
    const { year, team } = req.query;
    const conditions = [];
    const params = [];

    if (year) {
      params.push(parseInt(year, 10));
      conditions.push(`ps.year = $${params.length}`);
    }

    if (team) {
      params.push(`%${team.toLowerCase()}%`);
      conditions.push(`LOWER(t.name) LIKE $${params.length}`);
    }

    const whereSql =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const sql = `
      SELECT
        ps.id,
        ps.year,
        t.name AS team_name,
        p.first_name,
        p.last_name,
        ps.jersey_num,
        ps.era,
        ps.w,
        ps.l,
        ps.app,
        ps.gs,
        ps.cg,
        ps.sho,
        ps.cbo,
        ps.sv,
        ps.ip,
        ps.h,
        ps.r,
        ps.er,
        ps.bb,
        ps.so,
        ps."2b",
        ps."3b",
        ps.hr,
        ps.ab,
        ps.b_avg,
        ps.wp,
        ps.hbp,
        ps.bk,
        ps.sfa,
        ps.sha
      FROM public.pitching_stats AS ps
      JOIN public.players AS p ON p.id = ps.player_id
      JOIN public.teams   AS t ON t.id = ps.team_id
      ${whereSql}
      ORDER BY ps.year DESC, t.name, p.last_name, p.first_name
    `;

    const { rows } = await pool.query(sql, params);

    const formatted = rows.map((r) => ({
      id: r.id,
      year: r.year,
      team_name: r.team_name,
      player_name: `${r.first_name ?? ""} ${r.last_name ?? ""}`.trim(),
      jersey_num: r.jersey_num,
      era: r.era,
      w: r.w,
      l: r.l,
      app: r.app,
      g: r.app,
      gs: r.gs,
      cg: r.cg,
      sho: r.sho,
      cbo: r.cbo,
      sv: r.sv,
      ip: r.ip,
      h: r.h,
      r: r.r,
      er: r.er,
      bb: r.bb,
      so: r.so,
      "2b": r["2b"],
      "3b": r["3b"],
      hr: r.hr,
      ab: r.ab,
      b_avg: r.b_avg,
      wp: r.wp,
      hbp: r.hbp,
      bk: r.bk,
      sfa: r.sfa,
      sha: r.sha,
    }));

    res.json(formatted);
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
