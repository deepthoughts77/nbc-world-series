import { pool } from "../db.js";

const resolvePlayerId = async (rawId) => {
  const id = Number(rawId);
  try {
    const r = await pool.query(`SELECT 1 FROM players WHERE id = $1 LIMIT 1`, [
      id,
    ]);
    if (r.rowCount > 0) return id;
  } catch (e) {
    console.warn("resolvePlayerId: players.id lookup failed:", e.message);
  }

  try {
    const r = await pool.query(
      `SELECT player_id FROM batting_stats WHERE id = $1 LIMIT 1`,
      [id],
    );
    if (r.rows[0]?.player_id) return r.rows[0].player_id;
  } catch (e) {
    console.warn("resolvePlayerId: batting_stats.id lookup failed:", e.message);
  }

  try {
    const r = await pool.query(
      `SELECT player_id FROM pitching_stats WHERE id = $1 LIMIT 1`,
      [id],
    );
    if (r.rows[0]?.player_id) return r.rows[0].player_id;
  } catch (e) {
    console.warn(
      "resolvePlayerId: pitching_stats.id lookup failed:",
      e.message,
    );
  }

  return id;
};

const getPlayerNameSafe = async (playerId) => {
  try {
    const r = await pool.query(
      `SELECT first_name, last_name FROM players WHERE id = $1 LIMIT 1`,
      [playerId],
    );
    if (r.rows[0]) {
      const full =
        `${r.rows[0].first_name || ""} ${r.rows[0].last_name || ""}`.trim();
      if (full) return full;
    }
  } catch (e) {
    console.warn("getPlayerNameSafe: lookup failed:", e.message);
  }
  return "Unknown Player";
};

export const searchPlayers = async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.json([]);

  const term = `%${q.toLowerCase()}%`;

  try {
    const { rows } = await pool.query(
      `SELECT DISTINCT p.id, p.first_name, p.last_name,
         (p.first_name || ' ' || p.last_name) AS full_name
       FROM players p
       WHERE EXISTS (
         SELECT 1 FROM batting_stats b WHERE b.player_id = p.id
         UNION
         SELECT 1 FROM pitching_stats pi WHERE pi.player_id = p.id
       )
       AND LOWER(p.first_name || ' ' || p.last_name) LIKE $1
       ORDER BY p.last_name, p.first_name
       LIMIT 25`,
      [term],
    );

    return res.json(rows.map((r) => ({ id: r.id, full_name: r.full_name })));
  } catch (e) {
    console.warn("searchPlayers failed:", e.message);
    return res.status(500).json({ error: "Search failed" });
  }
};

export const getBattingLeaders = async (req, res) => {
  try {
    const year = Number(req.query.year) || 2025;
    const sort = (req.query.sort || "avg").toLowerCase();
    const order = (req.query.order || "desc").toLowerCase();
    const teamId = req.query.teamId ? Number(req.query.teamId) : null;

    const sortMap = {
      avg: "b.avg",
      h: "b.h",
      hr: "b.hr",
      rbi: "b.rbi",
      ab: "b.ab",
      g: "b.gp",
      r: "b.r",
      obp: "b.obp",
      slg: "b.slg",
    };

    const sortColumn = sortMap[sort] || "b.avg";
    const sortDir = order === "asc" ? "ASC" : "DESC";

    const { rows } = await pool.query(
      `SELECT
        b.player_id, p.first_name, p.last_name, b.year,
        b.gp, b.ab, b.r, b.h, b.hr, b.rbi, b.avg, b.obp, b.slg,
        b.team_id,
        COALESCE(t.name, tc.full_name, b.team_code) AS team_name
       FROM batting_stats b
       JOIN players p ON p.id = b.player_id
       LEFT JOIN teams t ON t.id = b.team_id
       LEFT JOIN team_codes tc ON tc.code = b.team_code
       WHERE b.year = $1 AND b.ab > 0
       ORDER BY ${sortColumn} ${sortDir}, p.last_name ASC
       LIMIT 500`,
      [year],
    );

    let result = rows;

    if (teamId && !Number.isNaN(teamId)) {
      result = result.filter((row) => row.team_id === teamId);
    }

    if (sort === "team") {
      result = [...result].sort((a, b) => {
        const tn = (a.team_name || "").localeCompare(b.team_name || "");
        return tn !== 0 ? tn : (Number(b.avg) || 0) - (Number(a.avg) || 0);
      });
    }

    res.json({ players: result });
  } catch (err) {
    console.error("getBattingLeaders failed:", err);
    res.status(500).json({ error: "Failed to load batting leaders" });
  }
};

export const getPitchingLeaders = async (req, res) => {
  try {
    const year = Number(req.query.year) || 2025;
    const sort = (req.query.sort || "era").toLowerCase();
    const defaultOrder = sort === "era" ? "asc" : "desc";
    const order = (req.query.order || defaultOrder).toLowerCase();
    const teamId = req.query.teamId ? Number(req.query.teamId) : null;

    const sortMap = {
      era: "p.era",
      so: "p.so",
      w: "p.w",
      sv: "p.sv",
      ip: "p.ip",
    };

    const sortColumn = sortMap[sort] || "p.era";
    const sortDir = order === "desc" ? "DESC" : "ASC";

    const { rows } = await pool.query(
      `SELECT
        p.player_id, pl.first_name, pl.last_name, p.year,
        p.app, p.gs, p.w, p.l, p.sv, p.ip, p.so, p.era, p.b_avg,
        p.team_id,
        COALESCE(t.name, tc.full_name, p.team_code) AS team_name
       FROM pitching_stats p
       JOIN players pl ON pl.id = p.player_id
       LEFT JOIN teams t ON t.id = p.team_id
       LEFT JOIN team_codes tc ON tc.code = p.team_code
       WHERE p.year = $1 AND p.ip > 0
       ORDER BY ${sortColumn} ${sortDir}, pl.last_name ASC
       LIMIT 500`,
      [year],
    );

    let result = rows;

    if (teamId && !Number.isNaN(teamId)) {
      result = result.filter((row) => row.team_id === teamId);
    }

    if (sort === "team") {
      result = [...result].sort((a, b) => {
        const tn = (a.team_name || "").localeCompare(b.team_name || "");
        return tn !== 0
          ? tn
          : (Number(a.era) || 9999) - (Number(b.era) || 9999);
      });
    }

    res.json({ players: result });
  } catch (err) {
    console.error("getPitchingLeaders failed:", err);
    res.status(500).json({ error: "Failed to load pitching leaders" });
  }
};

export const getPlayerById = async (req, res) => {
  const rawId = req.params.id;
  const numericId = Number(rawId);

  if (!Number.isInteger(numericId)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const playerId = await resolvePlayerId(numericId);

    const playerExists = await pool.query(
      `SELECT id FROM players WHERE id = $1 LIMIT 1`,
      [playerId],
    );

    if (!playerExists.rows.length) {
      return res.status(404).json({ error: "Player not found" });
    }

    const playerName = await getPlayerNameSafe(playerId);
    const nameParts = playerName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const battingStatsResult = await pool.query(
      `SELECT
        b.year,
        COALESCE(t.name, tc.full_name, b.team_code) AS team_name,
        t.city, t.state, t.id AS team_id, b.team_code,
        b.jersey_num, b.gp, b.gs, b.ab, b.r, b.h,
        b."2b" AS doubles, b."3b" AS triples,
        b.hr, b.rbi, b.tb, b.slg, b.bb, b.hbp, b.so,
        b.gdp, b.obp, b.sf, b.sh, b.sb, b.cs,
        b.att AS sb_att, b.position, b.po, b.a, b.e, b.fld, b.avg
       FROM batting_stats b
       LEFT JOIN teams t ON b.team_id = t.id
       LEFT JOIN team_codes tc ON tc.code = b.team_code
       WHERE b.player_id = $1
       ORDER BY b.year DESC`,
      [playerId],
    );

    const pitchingStatsResult = await pool.query(
      `SELECT
        p.year,
        COALESCE(t.name, tc.full_name, p.team_code) AS team_name,
        t.city, t.state, t.id AS team_id, p.team_code,
        p.jersey_num, p.era, p.w, p.l, p.app, p.gs, p.cg,
        p.sho, p.cbo, p.sv, p.ip, p.h, p.r, p.er, p.bb, p.so,
        p."2b" AS doubles, p."3b" AS triples,
        p.hr, p.ab, p.b_avg, p.wp, p.hbp, p.bk, p.sfa, p.sha
       FROM pitching_stats p
       LEFT JOIN teams t ON p.team_id = t.id
       LEFT JOIN team_codes tc ON tc.code = p.team_code
       WHERE p.player_id = $1
       ORDER BY p.year DESC`,
      [playerId],
    );

    const careerBattingResult = await pool.query(
      `SELECT
        COUNT(DISTINCT year) AS seasons,
        COUNT(DISTINCT COALESCE(team_id::text, team_code)) AS teams_count,
        SUM(gp) AS total_gp, SUM(ab) AS total_ab,
        SUM(h) AS total_h, SUM(r) AS total_r,
        SUM(rbi) AS total_rbi, SUM(hr) AS total_hr,
        SUM(bb) AS total_bb, SUM(so) AS total_so,
        SUM(sb) AS total_sb, SUM("2b") AS total_2b,
        SUM("3b") AS total_3b, SUM(COALESCE(tb, 0)) AS total_tb,
        CASE WHEN SUM(ab) > 0
          THEN ROUND(CAST(SUM(h) AS DECIMAL) / SUM(ab), 3)::TEXT
          ELSE '.000' END AS career_avg,
        CASE WHEN SUM(ab) + SUM(bb) > 0
          THEN ROUND(CAST(SUM(h) + SUM(bb) AS DECIMAL) / (SUM(ab) + SUM(bb)), 3)::TEXT
          ELSE '.000' END AS career_obp,
        CASE WHEN SUM(ab) > 0 AND SUM(COALESCE(tb, 0)) > 0
          THEN ROUND(CAST(SUM(COALESCE(tb, 0)) AS DECIMAL) / SUM(ab), 3)::TEXT
          ELSE '.000' END AS career_slg
       FROM batting_stats
       WHERE player_id = $1`,
      [playerId],
    );

    const careerPitchingResult = await pool.query(
      `SELECT
        COUNT(DISTINCT year) AS seasons,
        COUNT(DISTINCT COALESCE(team_id::text, team_code)) AS teams_count,
        SUM(w) AS total_w, SUM(l) AS total_l,
        SUM(app) AS total_app, SUM(gs) AS total_gs,
        SUM(sv) AS total_sv, SUM(ip) AS total_ip,
        SUM(so) AS total_so, SUM(h) AS total_h,
        SUM(er) AS total_er, SUM(bb) AS total_bb,
        SUM(cg) AS total_cg, SUM(sho) AS total_sho,
        CASE WHEN SUM(ip) > 0
          THEN ROUND(CAST(SUM(er) * 9 AS DECIMAL) / SUM(ip), 2)::TEXT
          ELSE '0.00' END AS career_era
       FROM pitching_stats
       WHERE player_id = $1`,
      [playerId],
    );

    const teamsResult = await pool.query(
      `SELECT team_name, team_id, team_code, city, state,
              batting_years, pitching_years, first_year
       FROM (
         -- Named teams (team_id populated)
         SELECT
           COALESCE(t.name, tc.full_name, b_sub.team_code) AS team_name,
           t.id AS team_id,
           NULL::text AS team_code,
           t.city, t.state,
           ARRAY_AGG(DISTINCT b.year ORDER BY b.year)
             FILTER (WHERE b.year IS NOT NULL) AS batting_years,
           ARRAY_AGG(DISTINCT p.year ORDER BY p.year)
             FILTER (WHERE p.year IS NOT NULL) AS pitching_years,
           MIN(COALESCE(b.year, p.year)) AS first_year
         FROM teams t
         LEFT JOIN batting_stats b ON t.id = b.team_id AND b.player_id = $1
         LEFT JOIN pitching_stats p ON t.id = p.team_id AND p.player_id = $1
         LEFT JOIN LATERAL (
           SELECT team_code
           FROM batting_stats
           WHERE team_id = t.id AND player_id = $1
           LIMIT 1
         ) b_sub ON true
         LEFT JOIN team_codes tc ON tc.code = b_sub.team_code
         WHERE b.player_id = $1 OR p.player_id = $1
         GROUP BY t.id, t.name, t.city, t.state, tc.full_name, b_sub.team_code

         UNION ALL

         -- Historical teams (team_id IS NULL, grouped by team_code)
         SELECT
           COALESCE(MAX(tc_b.full_name), MAX(tc_p.full_name),
                    MAX(b.team_code), MAX(pi.team_code)) AS team_name,
           NULL::int AS team_id,
           COALESCE(MAX(b.team_code), MAX(pi.team_code)) AS team_code,
           NULL::varchar AS city,
           NULL::varchar AS state,
           ARRAY_AGG(DISTINCT b.year ORDER BY b.year)
             FILTER (WHERE b.year IS NOT NULL) AS batting_years,
           ARRAY_AGG(DISTINCT pi.year ORDER BY pi.year)
             FILTER (WHERE pi.year IS NOT NULL) AS pitching_years,
           MIN(COALESCE(b.year, pi.year)) AS first_year
         FROM (
           SELECT *
           FROM batting_stats
           WHERE player_id = $1 AND team_id IS NULL
         ) b
         FULL OUTER JOIN (
           SELECT *
           FROM pitching_stats
           WHERE player_id = $1 AND team_id IS NULL
         ) pi
           ON b.team_code = pi.team_code AND b.year = pi.year
         LEFT JOIN team_codes tc_b ON tc_b.code = b.team_code
         LEFT JOIN team_codes tc_p ON tc_p.code = pi.team_code
         WHERE b.team_code IS NOT NULL OR pi.team_code IS NOT NULL
         GROUP BY COALESCE(b.team_code, pi.team_code)
       ) combined
       ORDER BY first_year`,
      [playerId],
    );

    const hofResult = await pool.query(
      `SELECT induction_year, category
       FROM hall_of_fame
       WHERE player_id = $1
       LIMIT 1`,
      [playerId],
    );

    const hofRow = hofResult.rows[0] || null;
    const careerBatting = careerBattingResult.rows[0];
    const careerPitching = careerPitchingResult.rows[0];

    res.json({
      player: {
        id: playerId,
        firstName,
        lastName,
        fullName: playerName,
        isHallOfFame: !!hofRow,
        hofYear: hofRow?.induction_year || null,
        hofCategory: hofRow?.category || null,
        mlbTeam: null,
      },
      batting: {
        stats: battingStatsResult.rows,
        career:
          careerBatting && Number(careerBatting.total_gp || 0) > 0
            ? careerBatting
            : null,
      },
      pitching: {
        stats: pitchingStatsResult.rows,
        career:
          careerPitching && Number(careerPitching.total_app || 0) > 0
            ? careerPitching
            : null,
      },
      teams: teamsResult.rows,
    });
  } catch (err) {
    console.error("getPlayerById failed:", err);
    res.status(500).json({ error: "Failed to load player profile" });
  }
};
