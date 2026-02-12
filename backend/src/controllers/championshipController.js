// backend/src/controllers/championshipController.js
import { pool } from "../db.js";

/**
 * @description Get all championships
 * @route GET /api/championships
 */
export const getAllChampionships = async (req, res) => {
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

    const result = await pool.query(query, [year]);

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
 * Helpers
 */
async function tableExists(tableName) {
  const r = await pool.query(
    `
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema='public' AND table_name=$1
    ) AS exists
    `,
    [tableName],
  );
  return Boolean(r.rows?.[0]?.exists);
}

async function getExistingColumns(tableName, candidates) {
  // candidates = array of column names (whitelist)
  const r = await pool.query(
    `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema='public'
      AND table_name=$1
      AND column_name = ANY($2::text[])
    `,
    [tableName, candidates],
  );

  const set = new Set(r.rows.map((x) => x.column_name));
  return candidates.filter((c) => set.has(c));
}

/**
 * @description Get championship final stats (batting + pitching)
 * @route GET /api/championships/:year/final
 * Query:
 *   ?team=runner_up  -> runner-up only
 *   default -> champion + runner-up
 */
export const getChampionshipFinalStats = async (req, res) => {
  try {
    const { year } = req.params;
    const teamMode = String(req.query.team || "both").toLowerCase();

    if (!/^\d{4}$/.test(year)) {
      return res
        .status(400)
        .json({ success: false, error: "Year must be a 4-digit number" });
    }

    // Get the championship row
    const champRes = await pool.query(
      `
      SELECT
        c.id AS championship_id,
        c.year,
        c.champion_team_id,
        c.runner_up_team_id,
        ct.name AS champion_name,
        rt.name AS runner_up_name,
        CONCAT(p.first_name, ' ', p.last_name) as mvp_name
      FROM championships c
      LEFT JOIN teams ct ON c.champion_team_id = ct.id
      LEFT JOIN teams rt ON c.runner_up_team_id = rt.id
      LEFT JOIN players p ON c.mvp_player_id = p.id
      WHERE c.year = $1
      LIMIT 1
      `,
      [year],
    );

    if (champRes.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Championship not found" });
    }

    const champ = champRes.rows[0];

    // IMPORTANT:
    // Your finals tables use final_id (not year). In your API response you had championship_id=109 for 2025,
    // which matches the common pattern that final_id == championships.id.
    const finalId = champ.championship_id;

    const teamIds =
      teamMode === "runner_up"
        ? [champ.runner_up_team_id]
        : [champ.champion_team_id, champ.runner_up_team_id];

    const battingTable = "championship_final_batting";
    const pitchingTable = "championship_final_pitching";

    const battingOk = await tableExists(battingTable);
    const pitchingOk = await tableExists(pitchingTable);

    // Build batting query with only columns that exist
    let battingRes = { rows: [] };
    let pitchingRes = { rows: [] };

    if (battingOk) {
      const battingCols = await getExistingColumns(battingTable, [
        "player_name",
        "player_id",
        "batting_order",
        "position",
        "pos",
        "ab",
        "r",
        "h",
        "rbi",
        "bb",
        "so",
        "po",
        "a",
        "lob",
      ]);

      // Always needed
      const battingSelect = [
        "b.team_id",
        "t.name AS team_name",
        ...battingCols.map((c) => `b.${c}`),
      ].join(", ");

      battingRes = await pool.query(
        `
        SELECT ${battingSelect}
        FROM ${battingTable} b
        JOIN teams t ON t.id = b.team_id
        WHERE b.final_id = $1
          AND b.team_id = ANY($2::int[])
        ORDER BY t.name, b.player_name
        `,
        [finalId, teamIds],
      );
    }

    if (pitchingOk) {
      const pitchingCols = await getExistingColumns(pitchingTable, [
        "player_name",
        "player_id",
        "ip",
        "h",
        "r",
        "er",
        "bb",
        "so",
        "bf",
        "hbp", // may NOT exist on Neon -> we only include it if it exists
        "wp",
        "bk",
        "rbi",
        "decision",
        "ab",
      ]);

      const pitchingSelect = [
        "p.team_id",
        "t.name AS team_name",
        ...pitchingCols.map((c) => `p.${c}`),
      ].join(", ");

      pitchingRes = await pool.query(
        `
        SELECT ${pitchingSelect}
        FROM ${pitchingTable} p
        JOIN teams t ON t.id = p.team_id
        WHERE p.final_id = $1
          AND p.team_id = ANY($2::int[])
        ORDER BY t.name, p.player_name
        `,
        [finalId, teamIds],
      );
    }

    // Merge into per-team structure
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
        final_id: finalId,
        champion: {
          team_id: champ.champion_team_id,
          name: champ.champion_name,
        },
        runner_up: {
          team_id: champ.runner_up_team_id,
          name: champ.runner_up_name,
        },
        mvp: champ.mvp_name || null,
        mode: teamMode,
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
 * Behavior:
 * 1) If championship_mvp_stats.stats_snapshot exists -> return it
 * 2) Else try to locate MVP in final batting/pitching tables (using final_id)
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
      [year],
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

    // optional snapshot table
    const snapTable = "championship_mvp_stats";
    const snapOk = await tableExists(snapTable);

    if (snapOk) {
      const snapRes = await pool.query(
        `
        SELECT stats_snapshot, stats_source
        FROM ${snapTable}
        WHERE championship_id = $1
        LIMIT 1
        `,
        [champ.championship_id],
      );

      if (snapRes.rows.length > 0 && snapRes.rows[0].stats_snapshot) {
        return res.json({
          success: true,
          data: {
            mvp_name: champ.mvp_name,
            source: snapRes.rows[0].stats_source || "snapshot",
            snapshot: snapRes.rows[0].stats_snapshot,
          },
        });
      }
    }

    // fallback: search finals tables using final_id
    const finalId = champ.championship_id;
    const name = champ.mvp_name;

    const battingTable = "championship_final_batting";
    const pitchingTable = "championship_final_pitching";

    let batRes = { rows: [] };
    let pitRes = { rows: [] };

    if (await tableExists(battingTable)) {
      batRes = await pool.query(
        `
        SELECT b.*, t.name AS team_name
        FROM ${battingTable} b
        JOIN teams t ON t.id = b.team_id
        WHERE b.final_id = $1 AND b.player_name ILIKE $2
        ORDER BY t.name, b.player_name
        LIMIT 10
        `,
        [finalId, `%${name}%`],
      );
    }

    if (await tableExists(pitchingTable)) {
      pitRes = await pool.query(
        `
        SELECT p.*, t.name AS team_name
        FROM ${pitchingTable} p
        JOIN teams t ON t.id = p.team_id
        WHERE p.final_id = $1 AND p.player_name ILIKE $2
        ORDER BY t.name, p.player_name
        LIMIT 10
        `,
        [finalId, `%${name}%`],
      );
    }

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
