// backend/src/controllers/playerController.js
import { pool } from "../db.js";

/**
 * Resolve a "raw" id (from the frontend) into a canonical player_id.
 *
 * The ID coming from the frontend might be:
 *  - a players.id
 *  - a batting_stats.id
 *  - a pitching_stats.id
 *  - or already a batting_stats.player_id / pitching_stats.player_id
 */
const resolvePlayerId = async (rawId) => {
  const id = Number(rawId);

  // 1) If this ID is already used as player_id in any stats table, use it directly
  try {
    const r1 = await pool.query(
      `SELECT 1 FROM batting_stats WHERE player_id = $1 LIMIT 1`,
      [id]
    );
    const r2 = await pool.query(
      `SELECT 1 FROM pitching_stats WHERE player_id = $1 LIMIT 1`,
      [id]
    );
    if (r1.rowCount > 0 || r2.rowCount > 0) {
      return id;
    }
  } catch (e) {
    console.warn("resolvePlayerId: check player_id failed:", e.message);
  }

  // 2) Maybe the ID is a batting_stats row id
  try {
    const r = await pool.query(
      `SELECT player_id FROM batting_stats WHERE id = $1 LIMIT 1`,
      [id]
    );
    if (r.rows[0]?.player_id) {
      return r.rows[0].player_id;
    }
  } catch (e) {
    console.warn("resolvePlayerId: batting_stats.id lookup failed:", e.message);
  }

  // 3) Maybe the ID is a pitching_stats row id
  try {
    const r = await pool.query(
      `SELECT player_id FROM pitching_stats WHERE id = $1 LIMIT 1`,
      [id]
    );
    if (r.rows[0]?.player_id) {
      return r.rows[0].player_id;
    }
  } catch (e) {
    console.warn(
      "resolvePlayerId: pitching_stats.id lookup failed:",
      e.message
    );
  }

  // 4) As a last resort, maybe it's players.id and stats use player_id = players.id
  try {
    const r = await pool.query(`SELECT 1 FROM players WHERE id = $1 LIMIT 1`, [
      id,
    ]);
    if (r.rowCount > 0) {
      // we assume player_id in stats = players.id
      return id;
    }
  } catch (e) {
    console.warn("resolvePlayerId: players.id lookup failed:", e.message);
  }

  // If nothing matched, just return original id (will likely lead to 404 later)
  return id;
};

/**
 * Safely resolve a player's name by player_id.
 * Uses players.first_name + players.last_name.
 */
const getPlayerNameSafe = async (playerId) => {
  try {
    const r = await pool.query(
      `SELECT first_name, last_name
       FROM players
       WHERE id = $1
       LIMIT 1`,
      [playerId]
    );

    if (r.rows[0]) {
      const first = r.rows[0].first_name || "";
      const last = r.rows[0].last_name || "";
      const full = `${first} ${last}`.trim();
      if (full) return full;
    }
  } catch (e) {
    console.warn(
      "getPlayerNameSafe: players first/last lookup failed:",
      e.message
    );
  }

  // Fallback if somehow nothing is there
  return "Unknown Player";
};

/**
 * @description Search for players by name (only players with stats)
 * @route GET /api/players/search?q=...
 */
export const searchPlayers = async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.json([]);

  const term = `%${q.toLowerCase()}%`;

  try {
    // Only return players who have either batting or pitching stats
    const { rows } = await pool.query(
      `SELECT DISTINCT
         p.id,
         p.first_name,
         p.last_name,
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
      [term]
    );

    return res.json(
      rows.map((r) => ({
        id: r.id,
        full_name: r.full_name,
      }))
    );
  } catch (e) {
    console.warn("searchPlayers failed:", e.message);
    return res.status(500).json({ error: "Search failed" });
  }
};

/**
 * @description Get complete player profile with all stats across all years
 * @route GET /api/players/:id
 */
export const getPlayerById = async (req, res) => {
  const rawId = req.params.id;
  const numericId = Number(rawId);
  if (!Number.isInteger(numericId)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    // 1) Resolve the REAL player_id from whatever ID the frontend sent
    const playerId = await resolvePlayerId(numericId);

    // 2) Grab the player name using that player_id
    const playerName = await getPlayerNameSafe(playerId);
    const nameParts = playerName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // 3) Batting stats across all years/teams
    const battingStatsResult = await pool.query(
      `SELECT 
        b.year,
        t.name AS team_name,
        t.city,
        t.state,
        b.jersey_num,
        b.gp,
        b.gs, 
        b.ab, 
        b.r, 
        b.h,
        b."2b" AS doubles,
        b."3b" AS triples,
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
        b.cs,
        b.att AS sb_att,
        b.position,
        b.po,
        b.a,
        b.e,
        b.fld,
        b.avg
       FROM batting_stats b
       JOIN teams t ON b.team_id = t.id
       WHERE b.player_id = $1
       ORDER BY b.year DESC`,
      [playerId]
    );

    // 4) Pitching stats across all years/teams
    const pitchingStatsResult = await pool.query(
      `SELECT 
        p.year,
        t.name AS team_name,
        t.city,
        t.state,
        p.jersey_num,
        p.era, 
        p.w, 
        p.l, 
        p.app, 
        p.gs, 
        p.cg,
        p.sho,
        p.cbo,
        p.sv, 
        p.ip, 
        p.h, 
        p.r, 
        p.er,
        p.bb, 
        p.so,
        p."2b" AS doubles,
        p."3b" AS triples,
        p.hr, 
        p.ab, 
        p.b_avg, 
        p.wp, 
        p.hbp, 
        p.bk, 
        p.sfa, 
        p.sha
       FROM pitching_stats p
       JOIN teams t ON p.team_id = t.id
       WHERE p.player_id = $1
       ORDER BY p.year DESC`,
      [playerId]
    );

    // 5) If no stats at all, treat as not found
    if (!battingStatsResult.rows.length && !pitchingStatsResult.rows.length) {
      return res.status(404).json({ error: "Player not found" });
    }

    // 6) Career batting totals
    const careerBattingResult = await pool.query(
      `SELECT 
        COUNT(DISTINCT year) AS seasons,
        COUNT(DISTINCT team_id) AS teams_count,
        SUM(gp) AS total_gp,
        SUM(ab) AS total_ab,
        SUM(h) AS total_h,
        SUM(r) AS total_r,
        SUM(rbi) AS total_rbi,
        SUM(hr) AS total_hr,
        SUM(bb) AS total_bb,
        SUM(so) AS total_so,
        SUM(sb) AS total_sb,
        SUM("2b") AS total_2b,
        SUM("3b") AS total_3b,
        SUM(COALESCE(tb, 0)) AS total_tb,
        CASE 
          WHEN SUM(ab) > 0 
          THEN ROUND(CAST(SUM(h) AS DECIMAL) / SUM(ab), 3)::TEXT
          ELSE '.000'
        END AS career_avg,
        CASE 
          WHEN SUM(ab) + SUM(bb) > 0 
          THEN ROUND(CAST(SUM(h) + SUM(bb) AS DECIMAL) / (SUM(ab) + SUM(bb)), 3)::TEXT
          ELSE '.000'
        END AS career_obp,
        CASE 
          WHEN SUM(ab) > 0 AND SUM(COALESCE(tb, 0)) > 0
          THEN ROUND(CAST(SUM(COALESCE(tb, 0)) AS DECIMAL) / SUM(ab), 3)::TEXT
          ELSE '.000'
        END AS career_slg
       FROM batting_stats
       WHERE player_id = $1`,
      [playerId]
    );

    // 7) Career pitching totals
    const careerPitchingResult = await pool.query(
      `SELECT 
        COUNT(DISTINCT year) AS seasons,
        COUNT(DISTINCT team_id) AS teams_count,
        SUM(w) AS total_w,
        SUM(l) AS total_l,
        SUM(app) AS total_app,
        SUM(gs) AS total_gs,
        SUM(sv) AS total_sv,
        SUM(ip) AS total_ip,
        SUM(so) AS total_so,
        SUM(h) AS total_h,
        SUM(er) AS total_er,
        SUM(bb) AS total_bb,
        SUM(cg) AS total_cg,
        SUM(sho) AS total_sho,
        CASE 
          WHEN SUM(ip) > 0 
          THEN ROUND(CAST(SUM(er) * 9 AS DECIMAL) / SUM(ip), 2)::TEXT
          ELSE '0.00'
        END AS career_era
       FROM pitching_stats
       WHERE player_id = $1`,
      [playerId]
    );

    // 8) All teams this player has appeared for
    const teamsResult = await pool.query(
      `WITH team_years AS (
        SELECT 
          t.id,
          t.name,
          t.city,
          t.state,
          b.year AS b_year,
          p.year AS p_year,
          COALESCE(b.year, p.year) AS any_year
        FROM teams t
        LEFT JOIN batting_stats b ON t.id = b.team_id AND b.player_id = $1
        LEFT JOIN pitching_stats p ON t.id = p.team_id AND p.player_id = $1
        WHERE b.player_id = $1 OR p.player_id = $1
      )
      SELECT DISTINCT
        name,
        city,
        state,
        ARRAY_AGG(DISTINCT b_year ORDER BY b_year) 
          FILTER (WHERE b_year IS NOT NULL) AS batting_years,
        ARRAY_AGG(DISTINCT p_year ORDER BY p_year) 
          FILTER (WHERE p_year IS NOT NULL) AS pitching_years,
        MIN(any_year) AS first_year
      FROM team_years
      GROUP BY name, city, state
      ORDER BY first_year`,
      [playerId]
    );

    const careerBatting = careerBattingResult.rows[0];
    const careerPitching = careerPitchingResult.rows[0];

    const battingCareer =
      careerBatting && Number(careerBatting.total_gp || 0) > 0
        ? careerBatting
        : null;
    const pitchingCareer =
      careerPitching && Number(careerPitching.total_app || 0) > 0
        ? careerPitching
        : null;

    // 9) Final JSON response
    res.json({
      player: {
        id: playerId,
        firstName,
        lastName,
        fullName: playerName,
        isHallOfFame: false,
        mlbTeam: null,
      },
      batting: {
        stats: battingStatsResult.rows,
        career: battingCareer,
      },
      pitching: {
        stats: pitchingStatsResult.rows,
        career: pitchingCareer,
      },
      teams: teamsResult.rows.map((t) => ({
        name: t.name,
        city: t.city,
        state: t.state,
        batting_years: t.batting_years,
        pitching_years: t.pitching_years,
      })),
    });
  } catch (e) {
    console.error("Error in getPlayerById:", e);
    res.status(500).json({ error: "Failed to fetch player" });
  }
};
