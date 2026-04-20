import { pool } from "../db.js";

const normalizeNameForSql = `
  LOWER(
    TRIM(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(
            REGEXP_REPLACE(
              REGEXP_REPLACE(
                REGEXP_REPLACE(
                  REGEXP_REPLACE(
                    REGEXP_REPLACE(
                      REGEXP_REPLACE(name, '\\mCA\\M', '', 'gi'),
                      '\\mKS\\M', '', 'gi'
                    ),
                    '\\mOK\\M', '', 'gi'
                  ),
                  '\\mTX\\M', '', 'gi'
                ),
                '\\mWA\\M', '', 'gi'
              ),
              '\\mMO\\M', '', 'gi'
            ),
            '\\mIA\\M', '', 'gi'
          ),
          '\\mCO\\M', '', 'gi'
        ),
        '\\s+',
        ' ',
        'g'
      )
    )
  )
`;

function normalizeNameJs(value = "") {
  return value
    .toLowerCase()
    .replace(/\bca\b/g, "")
    .replace(/\bks\b/g, "")
    .replace(/\bok\b/g, "")
    .replace(/\btx\b/g, "")
    .replace(/\bwa\b/g, "")
    .replace(/\bmo\b/g, "")
    .replace(/\bia\b/g, "")
    .replace(/\bco\b/g, "")
    .replace(/\bak\b/g, "")
    .replace(/\baz\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** GET /api/teams */
export const getAllTeams = async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        t.id, t.name, t.city, t.state, t.league,
        COUNT(DISTINCT c.id)                            AS championships_won,
        (COUNT(DISTINCT c.id) + COUNT(DISTINCT ru.id)) AS finals_appearances,
        COUNT(DISTINCT sy.year)::int                    AS tournament_years,
        MIN(sy.year)                                    AS first_year,
        MAX(sy.year)                                    AS last_year
      FROM teams t
      LEFT JOIN championships c  ON t.id = c.champion_team_id
      LEFT JOIN championships ru ON t.id = ru.runner_up_team_id
      LEFT JOIN (
        SELECT team_id, year FROM batting_stats  WHERE team_id IS NOT NULL
        UNION
        SELECT team_id, year FROM pitching_stats WHERE team_id IS NOT NULL
      ) sy ON t.id = sy.team_id
      GROUP BY t.id, t.name, t.city, t.state, t.league
      ORDER BY t.name
    `);

    const rows = result.rows.map((r) => ({
      ...r,
      championships_won: Number(r.championships_won || 0),
      finals_appearances: Number(r.finals_appearances || 0),
      appearances: Number(r.finals_appearances || 0),
      tournament_years: Number(r.tournament_years || 0),
      first_year: r.first_year ? Number(r.first_year) : null,
      last_year: r.last_year ? Number(r.last_year) : null,
    }));

    res.json(rows);
  } catch (err) {
    console.error("/api/teams error:", err);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
};

/** GET /api/teams/by-name/:name */
export const getTeamByName = async (req, res) => {
  try {
    const rawName = decodeURIComponent(req.params.name || "").trim();
    if (!rawName) return res.status(400).json({ error: "missing_name" });

    const normalized = normalizeNameJs(rawName);

    const { rows } = await pool.query(
      `
      SELECT
        t.id,
        t.name,
        t.city,
        t.state,
        t.league,
        COUNT(DISTINCT c.id)                           AS championships_won,
        COUNT(DISTINCT ru.id)                          AS runner_up_finishes,
        COUNT(DISTINCT c.id) + COUNT(DISTINCT ru.id)   AS finals_appearances,
        COUNT(DISTINCT sy.year)::int                   AS tournament_years,
        MIN(sy.year)                                   AS first_year,
        MAX(sy.year)                                   AS last_year
      FROM teams t
      LEFT JOIN championships c  ON t.id = c.champion_team_id
      LEFT JOIN championships ru ON t.id = ru.runner_up_team_id
      LEFT JOIN (
        SELECT team_id, year FROM batting_stats  WHERE team_id IS NOT NULL
        UNION
        SELECT team_id, year FROM pitching_stats WHERE team_id IS NOT NULL
      ) sy ON t.id = sy.team_id
      WHERE
        LOWER(t.name) = LOWER($1)
        OR LOWER(t.name) LIKE LOWER($2)
        OR ${normalizeNameForSql.replaceAll("name", "t.name")} = LOWER($3)
        OR ${normalizeNameForSql.replaceAll("name", "t.name")} LIKE LOWER($4)
      GROUP BY t.id, t.name, t.city, t.state, t.league
      ORDER BY
        CASE
          WHEN LOWER(t.name) = LOWER($1) THEN 0
          WHEN ${normalizeNameForSql.replaceAll("name", "t.name")} = LOWER($3) THEN 1
          ELSE 2
        END,
        t.name
      LIMIT 1
      `,
      [rawName, `%${rawName}%`, normalized, `%${normalized}%`],
    );

    if (!rows.length) {
      return res.status(404).json({ error: "team_not_found" });
    }

    res.json({
      ...rows[0],
      championships_won: Number(rows[0].championships_won || 0),
      runner_up_finishes: Number(rows[0].runner_up_finishes || 0),
      finals_appearances: Number(rows[0].finals_appearances || 0),
      appearances: Number(rows[0].finals_appearances || 0),
      tournament_years: Number(rows[0].tournament_years || 0),
      first_year: rows[0].first_year ? Number(rows[0].first_year) : null,
      last_year: rows[0].last_year ? Number(rows[0].last_year) : null,
    });
  } catch (err) {
    console.error("getTeamByName error:", err);
    res.status(500).json({ error: "server_error" });
  }
};

/** GET /api/teams/:id */
export const getTeamById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "invalid_id" });

    const { rows } = await pool.query(
      `SELECT
         t.id, t.name, t.city, t.state, t.league,
         COUNT(DISTINCT c.id)                            AS championships_won,
         (COUNT(DISTINCT c.id) + COUNT(DISTINCT ru.id)) AS finals_appearances,
         COUNT(DISTINCT sy.year)::int                    AS tournament_years,
         MIN(sy.year)                                    AS first_year,
         MAX(sy.year)                                    AS last_year
       FROM teams t
       LEFT JOIN championships c  ON t.id = c.champion_team_id
       LEFT JOIN championships ru ON t.id = ru.runner_up_team_id
       LEFT JOIN (
         SELECT team_id, year FROM batting_stats  WHERE team_id IS NOT NULL
         UNION
         SELECT team_id, year FROM pitching_stats WHERE team_id IS NOT NULL
       ) sy ON t.id = sy.team_id
       WHERE t.id = $1
       GROUP BY t.id, t.name, t.city, t.state, t.league
       LIMIT 1`,
      [id],
    );

    if (!rows.length) return res.status(404).json({ error: "team_not_found" });

    res.json({
      ...rows[0],
      championships_won: Number(rows[0].championships_won || 0),
      finals_appearances: Number(rows[0].finals_appearances || 0),
      appearances: Number(rows[0].finals_appearances || 0),
      tournament_years: Number(rows[0].tournament_years || 0),
      first_year: rows[0].first_year ? Number(rows[0].first_year) : null,
      last_year: rows[0].last_year ? Number(rows[0].last_year) : null,
    });
  } catch (err) {
    console.error("getTeamById error:", err);
    res.status(500).json({ error: "server_error" });
  }
};

/** GET /api/teams/:id/championships */
export const getTeamChampionships = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT
         c.year, c.championship_score,
         c.champion_team_id, c.runner_up_team_id,
         ct.name AS champion_name,
         rt.name AS runner_up_name
       FROM championships c
       LEFT JOIN teams ct ON ct.id = c.champion_team_id
       LEFT JOIN teams rt ON rt.id = c.runner_up_team_id
       WHERE c.champion_team_id = $1 OR c.runner_up_team_id = $1
       ORDER BY c.year DESC`,
      [id],
    );
    res.json(rows);
  } catch (err) {
    console.error("getTeamChampionships error:", err);
    res.status(500).json({ error: "server_error" });
  }
};

async function getTeamIdentity(poolRef, teamId) {
  const teamRes = await poolRef.query(
    `SELECT id, name, city, state FROM teams WHERE id = $1 LIMIT 1`,
    [teamId],
  );

  if (!teamRes.rows.length) return null;

  const team = teamRes.rows[0];
  const normalizedName = normalizeNameJs(team.name);

  const codeRes = await poolRef.query(
    `
    SELECT code, full_name
    FROM team_codes
    WHERE
      LOWER(full_name) = LOWER($1)
      OR LOWER(full_name) LIKE LOWER($2)
      OR ${normalizeNameForSql.replaceAll("name", "full_name")} = LOWER($3)
      OR ${normalizeNameForSql.replaceAll("name", "full_name")} LIKE LOWER($4)
    `,
    [team.name, `%${team.name}%`, normalizedName, `%${normalizedName}%`],
  );

  return {
    team,
    normalizedName,
    codes: codeRes.rows.map((r) => r.code).filter(Boolean),
  };
}

export const getTeamBattingTotalsByYear = async (req, res) => {
  try {
    const { id } = req.params;
    const identity = await getTeamIdentity(pool, id);
    if (!identity) return res.status(404).json({ error: "team_not_found" });

    const { team, normalizedName, codes } = identity;

    const { rows } = await pool.query(
      `
      SELECT
        bs.year,
        SUM(COALESCE(bs.gp, 0))   AS gp,
        SUM(COALESCE(bs.ab, 0))   AS ab,
        SUM(COALESCE(bs.h, 0))    AS h,
        SUM(COALESCE(bs."2b", 0)) AS doubles,
        SUM(COALESCE(bs."3b", 0)) AS triples,
        SUM(COALESCE(bs.hr, 0))   AS hr,
        SUM(COALESCE(bs.r, 0))    AS r,
        SUM(COALESCE(bs.rbi, 0))  AS rbi,
        SUM(COALESCE(bs.bb, 0))   AS bb,
        SUM(COALESCE(bs.so, 0))   AS so,
        SUM(COALESCE(bs.sb, 0))   AS sb,
        CASE
          WHEN SUM(COALESCE(bs.ab, 0)) > 0
            THEN ROUND(SUM(COALESCE(bs.h, 0))::numeric / SUM(COALESCE(bs.ab, 0)), 3)
          ELSE 0
        END AS avg,
        CASE
          WHEN (SUM(COALESCE(bs.ab, 0)) + SUM(COALESCE(bs.bb, 0))) > 0
            THEN ROUND(
              (SUM(COALESCE(bs.h, 0)) + SUM(COALESCE(bs.bb, 0)))::numeric
              / (SUM(COALESCE(bs.ab, 0)) + SUM(COALESCE(bs.bb, 0))), 3)
          ELSE 0
        END AS obp,
        CASE
          WHEN SUM(COALESCE(bs.ab, 0)) > 0
            THEN ROUND(
              (
                (SUM(COALESCE(bs.h,0)) - SUM(COALESCE(bs."2b",0)) - SUM(COALESCE(bs."3b",0)) - SUM(COALESCE(bs.hr,0)))
                + (2 * SUM(COALESCE(bs."2b",0)))
                + (3 * SUM(COALESCE(bs."3b",0)))
                + (4 * SUM(COALESCE(bs.hr,0)))
              )::numeric / SUM(COALESCE(bs.ab, 0)), 3)
          ELSE 0
        END AS slg
      FROM batting_stats bs
      LEFT JOIN team_codes tc ON tc.code = bs.team_code
      LEFT JOIN teams t2 ON t2.id = bs.team_id
      WHERE
        bs.team_id = $1
        OR bs.team_code = ANY($2::text[])
        OR LOWER(COALESCE(tc.full_name, t2.name, '')) = LOWER($3)
        OR ${normalizeNameForSql.replaceAll("name", "COALESCE(tc.full_name, t2.name, '')")} = LOWER($4)
      GROUP BY bs.year
      ORDER BY bs.year DESC
      `,
      [team.id, codes, team.name, normalizedName],
    );

    res.json(rows);
  } catch (err) {
    console.error("getTeamBattingTotalsByYear error:", err);
    res.status(500).json({ error: "server_error" });
  }
};

export const getTeamPitchingTotalsByYear = async (req, res) => {
  try {
    const { id } = req.params;
    const identity = await getTeamIdentity(pool, id);
    if (!identity) return res.status(404).json({ error: "team_not_found" });

    const { team, normalizedName, codes } = identity;

    const { rows } = await pool.query(
      `
      SELECT
        ps.year,
        SUM(COALESCE(ps.app, 0))  AS app,
        SUM(COALESCE(ps.w, 0))    AS w,
        SUM(COALESCE(ps.l, 0))    AS l,
        SUM(COALESCE(ps.sv, 0))   AS sv,
        SUM(COALESCE(ps.ip, 0))   AS ip,
        SUM(COALESCE(ps.h, 0))    AS h,
        SUM(COALESCE(ps.r, 0))    AS r,
        SUM(COALESCE(ps.er, 0))   AS er,
        SUM(COALESCE(ps.bb, 0))   AS bb,
        SUM(COALESCE(ps.so, 0))   AS so,
        SUM(COALESCE(ps.cg, 0))   AS cg,
        SUM(COALESCE(ps.sho, 0))  AS sho,
        CASE
          WHEN SUM(COALESCE(ps.ip, 0)) > 0
            THEN ROUND((SUM(COALESCE(ps.er, 0)) * 9.0 / SUM(COALESCE(ps.ip, 0)))::numeric, 2)
          ELSE 0
        END AS era,
        CASE
          WHEN SUM(COALESCE(ps.ip, 0)) > 0
            THEN ROUND(
              (SUM(COALESCE(ps.bb, 0)) + SUM(COALESCE(ps.h, 0)))::numeric
              / SUM(COALESCE(ps.ip, 0)), 2)
          ELSE 0
        END AS whip
      FROM pitching_stats ps
      LEFT JOIN team_codes tc ON tc.code = ps.team_code
      LEFT JOIN teams t2 ON t2.id = ps.team_id
      WHERE
        ps.team_id = $1
        OR ps.team_code = ANY($2::text[])
        OR LOWER(COALESCE(tc.full_name, t2.name, '')) = LOWER($3)
        OR ${normalizeNameForSql.replaceAll("name", "COALESCE(tc.full_name, t2.name, '')")} = LOWER($4)
      GROUP BY ps.year
      ORDER BY ps.year DESC
      `,
      [team.id, codes, team.name, normalizedName],
    );

    res.json(rows);
  } catch (err) {
    console.error("getTeamPitchingTotalsByYear error:", err);
    res.status(500).json({ error: "server_error" });
  }
};

/** GET /api/teams/:id/years */
export const getTeamYears = async (req, res) => {
  try {
    const { id } = req.params;
    const identity = await getTeamIdentity(pool, id);
    if (!identity) return res.status(404).json({ error: "team_not_found" });

    const { team, normalizedName, codes } = identity;

    const { rows } = await pool.query(
      `
      SELECT DISTINCT p.year,
        CASE WHEN c1.year IS NOT NULL THEN true ELSE false END AS is_champion,
        CASE WHEN c2.year IS NOT NULL THEN true ELSE false END AS is_runner_up
      FROM (
        SELECT bs.year
        FROM batting_stats bs
        LEFT JOIN team_codes tc ON tc.code = bs.team_code
        LEFT JOIN teams t2 ON t2.id = bs.team_id
        WHERE bs.year IS NOT NULL
          AND (
            bs.team_id = $1
            OR bs.team_code = ANY($2::text[])
            OR LOWER(COALESCE(tc.full_name, t2.name, '')) = LOWER($3)
            OR ${normalizeNameForSql.replaceAll("name", "COALESCE(tc.full_name, t2.name, '')")} = LOWER($4)
          )

        UNION

        SELECT ps.year
        FROM pitching_stats ps
        LEFT JOIN team_codes tc ON tc.code = ps.team_code
        LEFT JOIN teams t2 ON t2.id = ps.team_id
        WHERE ps.year IS NOT NULL
          AND (
            ps.team_id = $1
            OR ps.team_code = ANY($2::text[])
            OR LOWER(COALESCE(tc.full_name, t2.name, '')) = LOWER($3)
            OR ${normalizeNameForSql.replaceAll("name", "COALESCE(tc.full_name, t2.name, '')")} = LOWER($4)
          )
      ) p
      LEFT JOIN championships c1 ON c1.year = p.year AND c1.champion_team_id  = $1
      LEFT JOIN championships c2 ON c2.year = p.year AND c2.runner_up_team_id = $1
      ORDER BY p.year DESC
      `,
      [team.id, codes, team.name, normalizedName],
    );

    res.json(
      rows.map((r) => ({
        year: Number(r.year),
        is_champion: r.is_champion === true,
        is_runner_up: r.is_runner_up === true,
      })),
    );
  } catch (err) {
    console.error("getTeamYears error:", err);
    res.status(500).json({ error: "server_error" });
  }
};

/** GET /api/teams/:id/batting?year=YYYY */
export const getTeamBatting = async (req, res) => {
  try {
    const { id } = req.params;
    const { year } = req.query;
    if (!year) return res.json([]);

    const identity = await getTeamIdentity(pool, id);
    if (!identity) return res.status(404).json({ error: "team_not_found" });

    const { team, normalizedName, codes } = identity;

    const { rows } = await pool.query(
      `
      SELECT
        bs.*,
        p.id AS player_id,
        p.first_name,
        p.last_name,
        CONCAT(p.first_name, ' ', p.last_name) AS player_name
      FROM batting_stats bs
      JOIN players p ON bs.player_id = p.id
      LEFT JOIN team_codes tc ON tc.code = bs.team_code
      LEFT JOIN teams t2 ON t2.id = bs.team_id
      WHERE bs.year = $5
        AND (
          bs.team_id = $1
          OR bs.team_code = ANY($2::text[])
          OR LOWER(COALESCE(tc.full_name, t2.name, '')) = LOWER($3)
          OR ${normalizeNameForSql.replaceAll("name", "COALESCE(tc.full_name, t2.name, '')")} = LOWER($4)
        )
      ORDER BY p.last_name
      `,
      [team.id, codes, team.name, normalizedName, year],
    );

    res.json(rows);
  } catch (err) {
    console.error("getTeamBatting error:", err);
    res.status(500).json({ error: "server_error" });
  }
};

/** GET /api/teams/:id/pitching?year=YYYY */
export const getTeamPitching = async (req, res) => {
  try {
    const { id } = req.params;
    const { year } = req.query;
    if (!year) return res.json([]);

    const identity = await getTeamIdentity(pool, id);
    if (!identity) return res.status(404).json({ error: "team_not_found" });

    const { team, normalizedName, codes } = identity;

    const { rows } = await pool.query(
      `
      SELECT
        ps.*,
        p.id AS player_id,
        p.first_name,
        p.last_name,
        CONCAT(p.first_name, ' ', p.last_name) AS player_name,
        CASE
          WHEN ps.ip > 0
          THEN ROUND((COALESCE(ps.bb,0) + COALESCE(ps.h,0))::numeric / ps.ip, 2)
          ELSE NULL
        END AS whip
      FROM pitching_stats ps
      JOIN players p ON ps.player_id = p.id
      LEFT JOIN team_codes tc ON tc.code = ps.team_code
      LEFT JOIN teams t2 ON t2.id = ps.team_id
      WHERE ps.year = $5
        AND (
          ps.team_id = $1
          OR ps.team_code = ANY($2::text[])
          OR LOWER(COALESCE(tc.full_name, t2.name, '')) = LOWER($3)
          OR ${normalizeNameForSql.replaceAll("name", "COALESCE(tc.full_name, t2.name, '')")} = LOWER($4)
        )
      ORDER BY ps.era ASC NULLS LAST
      `,
      [team.id, codes, team.name, normalizedName, year],
    );

    res.json(rows);
  } catch (err) {
    console.error("getTeamPitching error:", err);
    res.status(500).json({ error: "server_error" });
  }
};

/** GET /api/teams/totals/batting?year=YYYY */
export const getAllTeamBattingTotalsByYear = async (req, res) => {
  try {
    const year = parseInt(req.query.year, 10);
    if (!year) return res.status(400).json({ error: "missing_year" });

    const { rows } = await pool.query(
      `SELECT
         bs.team_id,
         t.name AS team_name,
         t.city,
         t.state,
         bs.year,
         SUM(COALESCE(bs.gp, 0)) AS gp,
         SUM(COALESCE(bs.ab, 0)) AS ab,
         SUM(COALESCE(bs.h, 0)) AS h,
         SUM(COALESCE(bs."2b", 0)) AS doubles,
         SUM(COALESCE(bs."3b", 0)) AS triples,
         SUM(COALESCE(bs.hr, 0)) AS hr,
         SUM(COALESCE(bs.r, 0)) AS r,
         SUM(COALESCE(bs.rbi, 0)) AS rbi,
         SUM(COALESCE(bs.bb, 0)) AS bb,
         SUM(COALESCE(bs.so, 0)) AS so,
         SUM(COALESCE(bs.sb, 0)) AS sb,
         CASE
           WHEN SUM(COALESCE(bs.ab, 0)) > 0
             THEN ROUND((SUM(COALESCE(bs.h, 0))::numeric / SUM(COALESCE(bs.ab, 0))), 3)
           ELSE 0
         END AS avg,
         CASE
           WHEN (SUM(COALESCE(bs.ab, 0)) + SUM(COALESCE(bs.bb, 0))) > 0
             THEN ROUND(
               (
                 (SUM(COALESCE(bs.h, 0)) + SUM(COALESCE(bs.bb, 0)))::numeric
                 / (SUM(COALESCE(bs.ab, 0)) + SUM(COALESCE(bs.bb, 0)))
               ),
               3
             )
           ELSE 0
         END AS obp,
         CASE
           WHEN SUM(COALESCE(bs.ab, 0)) > 0
             THEN ROUND(
               (
                 (
                   (SUM(COALESCE(bs.h, 0))
                    - SUM(COALESCE(bs."2b", 0))
                    - SUM(COALESCE(bs."3b", 0))
                    - SUM(COALESCE(bs.hr, 0)))
                   + (2 * SUM(COALESCE(bs."2b", 0)))
                   + (3 * SUM(COALESCE(bs."3b", 0)))
                   + (4 * SUM(COALESCE(bs.hr, 0)))
                 )::numeric
                 / SUM(COALESCE(bs.ab, 0))
               ),
               3
             )
           ELSE 0
         END AS slg
       FROM batting_stats bs
       JOIN teams t ON t.id = bs.team_id
       WHERE bs.year = $1
       GROUP BY bs.team_id, t.name, t.city, t.state, bs.year
       ORDER BY t.name ASC`,
      [year],
    );

    res.json(rows);
  } catch (err) {
    console.error("getAllTeamBattingTotalsByYear error:", err);
    res.status(500).json({ error: "server_error" });
  }
};

/** GET /api/teams/totals/pitching?year=YYYY */
export const getAllTeamPitchingTotalsByYear = async (req, res) => {
  try {
    const year = parseInt(req.query.year, 10);
    if (!year) return res.status(400).json({ error: "missing_year" });

    const { rows } = await pool.query(
      `SELECT
         ps.team_id,
         t.name AS team_name,
         t.city,
         t.state,
         ps.year,
         SUM(COALESCE(ps.app, 0)) AS app,
         SUM(COALESCE(ps.w, 0)) AS w,
         SUM(COALESCE(ps.l, 0)) AS l,
         SUM(COALESCE(ps.sv, 0)) AS sv,
         SUM(COALESCE(ps.ip, 0)) AS ip,
         SUM(COALESCE(ps.h, 0)) AS h,
         SUM(COALESCE(ps.r, 0)) AS r,
         SUM(COALESCE(ps.er, 0)) AS er,
         SUM(COALESCE(ps.bb, 0)) AS bb,
         SUM(COALESCE(ps.so, 0)) AS so,
         SUM(COALESCE(ps.cg, 0)) AS cg,
         SUM(COALESCE(ps.sho, 0)) AS sho,
         CASE
           WHEN SUM(COALESCE(ps.ip, 0)) > 0
             THEN ROUND(((SUM(COALESCE(ps.er, 0)) * 9.0) / SUM(COALESCE(ps.ip, 0)))::numeric, 2)
           ELSE 0
         END AS era,
         CASE
           WHEN SUM(COALESCE(ps.ip, 0)) > 0
             THEN ROUND(((SUM(COALESCE(ps.bb, 0)) + SUM(COALESCE(ps.h, 0))) / SUM(COALESCE(ps.ip, 0)))::numeric, 2)
           ELSE 0
         END AS whip
       FROM pitching_stats ps
       JOIN teams t ON t.id = ps.team_id
       WHERE ps.year = $1
       GROUP BY ps.team_id, t.name, t.city, t.state, ps.year
       ORDER BY t.name ASC`,
      [year],
    );

    res.json(rows);
  } catch (err) {
    console.error("getAllTeamPitchingTotalsByYear error:", err);
    res.status(500).json({ error: "server_error" });
  }
};

export const getAllStatYears = async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT DISTINCT year
      FROM (
        SELECT year FROM batting_stats WHERE year IS NOT NULL
        UNION
        SELECT year FROM pitching_stats WHERE year IS NOT NULL
      ) y
      ORDER BY year DESC
    `);

    res.json(rows.map((r) => Number(r.year)).filter(Boolean));
  } catch (err) {
    console.error("getAllStatYears error:", err);
    res.status(500).json({ error: "server_error" });
  }
};
