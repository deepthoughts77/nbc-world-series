import { pool } from "../db.js";

/**
 * @description Search for players by name
 * @route GET /api/players/search?q=...
 */
export const searchPlayers = async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.json([]);

  try {
    const { rows } = await pool.query(
      `SELECT DISTINCT p.id, p.first_name, p.last_name,
              CONCAT(p.first_name, ' ', p.last_name) AS full_name
       FROM players p
       LEFT JOIN batting_stats b ON p.id = b.player_id
       LEFT JOIN pitching_stats pi ON p.id = pi.player_id
       WHERE LOWER(CONCAT(p.first_name, ' ', p.last_name)) LIKE LOWER($1)
       ORDER BY p.last_name, p.first_name
       LIMIT 25`,
      [`%${q}%`]
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Search failed" });
  }
};

/**
 * @description Get complete player profile with all stats across all years
 * @route GET /api/players/:id
 */
export const getPlayerById = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    // 1. Get player's main details
    const playerResult = await pool.query(
      `SELECT * FROM players WHERE id = $1`,
      [id]
    );

    if (!playerResult.rows.length) {
      return res.status(404).json({ error: "Player not found" });
    }

    const player = playerResult.rows[0];

    // 2. Get batting stats by year - using ACTUAL column names from your database
    const battingStatsResult = await pool.query(
      `SELECT 
        b.year,
        t.name as team_name,
        t.city,
        t.state,
        b.jersey_num,
        b.gp,
        b.gs, 
        b.ab, 
        b.r, 
        b.h,
        b."2b" as doubles,
        b."3b" as triples,
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
        b.att,
        b.position,
        b.po,
        b.a,
        b.e,
        b.fld,
        b.avg,
        b.sb_att
       FROM batting_stats b
       JOIN teams t ON b.team_id = t.id
       WHERE b.player_id = $1
       ORDER BY b.year DESC`,
      [id]
    );

    // 3. Get pitching stats by year - using ACTUAL column names
    const pitchingStatsResult = await pool.query(
      `SELECT 
        p.year,
        t.name as team_name,
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
        p."2b" as doubles,
        p."3b" as triples,
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
      [id]
    );

    // 4. Get career batting totals
    const careerBattingResult = await pool.query(
      `SELECT 
        COUNT(DISTINCT year) as seasons,
        COUNT(DISTINCT team_id) as teams_count,
        SUM(gp) as total_gp,
        SUM(ab) as total_ab,
        SUM(h) as total_h,
        SUM(r) as total_r,
        SUM(rbi) as total_rbi,
        SUM(hr) as total_hr,
        SUM(bb) as total_bb,
        SUM(so) as total_so,
        SUM(sb) as total_sb,
        SUM("2b") as total_2b,
        SUM("3b") as total_3b,
        SUM(COALESCE(tb, 0)) as total_tb,
        CASE 
          WHEN SUM(ab) > 0 
          THEN ROUND(CAST(SUM(h) AS DECIMAL) / SUM(ab), 3)::TEXT
          ELSE '.000'
        END as career_avg,
        CASE 
          WHEN SUM(ab) + SUM(bb) > 0 
          THEN ROUND(CAST(SUM(h) + SUM(bb) AS DECIMAL) / (SUM(ab) + SUM(bb)), 3)::TEXT
          ELSE '.000'
        END as career_obp,
        CASE 
          WHEN SUM(ab) > 0 AND SUM(COALESCE(tb, 0)) > 0
          THEN ROUND(CAST(SUM(COALESCE(tb, 0)) AS DECIMAL) / SUM(ab), 3)::TEXT
          ELSE '.000'
        END as career_slg
       FROM batting_stats
       WHERE player_id = $1`,
      [id]
    );

    // 5. Get career pitching totals
    const careerPitchingResult = await pool.query(
      `SELECT 
        COUNT(DISTINCT year) as seasons,
        COUNT(DISTINCT team_id) as teams_count,
        SUM(w) as total_w,
        SUM(l) as total_l,
        SUM(app) as total_app,
        SUM(gs) as total_gs,
        SUM(sv) as total_sv,
        SUM(ip) as total_ip,
        SUM(so) as total_so,
        SUM(h) as total_h,
        SUM(er) as total_er,
        SUM(bb) as total_bb,
        SUM(cg) as total_cg,
        SUM(sho) as total_sho,
        CASE 
          WHEN SUM(ip) > 0 
          THEN ROUND(CAST(SUM(er) * 9 AS DECIMAL) / SUM(ip), 2)::TEXT
          ELSE '0.00'
        END as career_era
       FROM pitching_stats
       WHERE player_id = $1`,
      [id]
    );

    // 6. Get all teams player has played for - FIXED query without ORDER BY in subquery
    const teamsResult = await pool.query(
      `WITH team_years AS (
        SELECT 
          t.id,
          t.name,
          t.city,
          t.state,
          b.year as b_year,
          p.year as p_year,
          COALESCE(b.year, p.year) as any_year
        FROM teams t
        LEFT JOIN batting_stats b ON t.id = b.team_id AND b.player_id = $1
        LEFT JOIN pitching_stats p ON t.id = p.team_id AND p.player_id = $1
        WHERE b.player_id = $1 OR p.player_id = $1
      )
      SELECT DISTINCT
        name,
        city,
        state,
        ARRAY_AGG(DISTINCT b_year ORDER BY b_year) FILTER (WHERE b_year IS NOT NULL) as batting_years,
        ARRAY_AGG(DISTINCT p_year ORDER BY p_year) FILTER (WHERE p_year IS NOT NULL) as pitching_years,
        MIN(any_year) as first_year
      FROM team_years
      GROUP BY name, city, state
      ORDER BY first_year`,
      [id]
    );

    // Get career stats (will be null if no stats exist)
    const careerBatting = careerBattingResult.rows[0];
    const careerPitching = careerPitchingResult.rows[0];

    // Only include career stats if player actually has games played
    const battingCareer =
      careerBatting && careerBatting.total_gp > 0 ? careerBatting : null;
    const pitchingCareer =
      careerPitching && careerPitching.total_app > 0 ? careerPitching : null;

    // 7. Combine and send response
    res.json({
      player: {
        id: player.id,
        firstName: player.first_name,
        lastName: player.last_name,
        fullName: `${player.first_name} ${player.last_name}`,
        isHallOfFame: player.is_hall_of_fame || false,
        mlbTeam: player.mlb_team,
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
