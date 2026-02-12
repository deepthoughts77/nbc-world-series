// backend/src/controllers/championshipController.js
import { pool } from "../db.js";

/**
 * Helpers
 */
async function tableExists(tableName) {
  const result = await pool.query(
    `
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = $1
    ) AS exists
    `,
    [tableName],
  );
  return !!result.rows?.[0]?.exists;
}

async function getTableColumns(tableName) {
  const result = await pool.query(
    `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = $1
    `,
    [tableName],
  );
  return new Set(result.rows.map((r) => r.column_name));
}

function pick(obj, keys) {
  const out = {};
  for (const k of keys) out[k] = obj[k] ?? null;
  return out;
}

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
 * @description Get championship final stats (batting + pitching)
 * @route GET /api/championships/:year/final
 * Query:
 *   ?team=runner_up  -> runner-up only
 *   ?team=champion   -> champion only
 *   default -> both
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

    // 1) Get championship + team ids
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

    let teamIds;
    if (teamMode === "runner_up") teamIds = [champ.runner_up_team_id];
    else if (teamMode === "champion") teamIds = [champ.champion_team_id];
    else teamIds = [champ.champion_team_id, champ.runner_up_team_id];

    // 2) Check tables + columns (production Neon schema uses final_id, not year)
    const battingTable = "championship_final_batting";
    const pitchingTable = "championship_final_pitching";

    const battingExists = await tableExists(battingTable);
    const pitchingExists = await tableExists(pitchingTable);

    let battingCols = new Set();
    let pitchingCols = new Set();

    if (battingExists) battingCols = await getTableColumns(battingTable);
    if (pitchingExists) pitchingCols = await getTableColumns(pitchingTable);

    const hasBatFinalId = battingCols.has("final_id");
    const hasPitFinalId = pitchingCols.has("final_id");

    // 3) Figure out which final_id belongs to THIS championship year.
    // Since Neon doesn't have year on these tables, we infer by the two teams involved.
    let finalId = null;

    // Try to find candidate final_id values for the involved team(s)
    const candidates = new Set();

    if (battingExists && hasBatFinalId) {
      const r = await pool.query(
        `
        SELECT DISTINCT final_id
        FROM ${battingTable}
        WHERE team_id = ANY($1::int[])
        `,
        [teamIds],
      );
      r.rows.forEach((x) => candidates.add(Number(x.final_id)));
    }

    if (pitchingExists && hasPitFinalId) {
      const r = await pool.query(
        `
        SELECT DISTINCT final_id
        FROM ${pitchingTable}
        WHERE team_id = ANY($1::int[])
        `,
        [teamIds],
      );
      r.rows.forEach((x) => candidates.add(Number(x.final_id)));
    }

    const candArr = Array.from(candidates).filter((n) => Number.isFinite(n));
    if (candArr.length === 1) finalId = candArr[0];
    else if (candArr.length > 1) finalId = Math.max(...candArr);

    // If we still can't determine finalId, return empty but SUCCESS (so frontend shows "no stats")
    if (!finalId) {
      return res.json({
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
          mode: teamMode,
          final_id: null,
          note: "Could not infer final_id for this championship from final tables.",
        },
        data: [],
      });
    }

    // 4) Build SELECT lists safely (only columns that exist)
    const battingWanted = [
      "team_id",
      "player_id",
      "player_name",
      "batting_order",
      "position",
      "ab",
      "r",
      "h",
      "rbi",
      "bb",
      "so",
      "po",
      "a",
      "lob",
    ];

    const pitchingWanted = [
      "team_id",
      "player_id",
      "player_name",
      "ip",
      "h",
      "r",
      "er",
      "bb",
      "so",
      "bf",
      "hbp", // might not exist
      "wp",
      "bk",
      "rbi",
      "decision",
      "ab",
    ];

    const battingSelectCols = battingWanted.filter((c) => battingCols.has(c));
    const pitchingSelectCols = pitchingWanted.filter((c) =>
      pitchingCols.has(c),
    );

    let battingRows = [];
    let pitchingRows = [];

    if (battingExists && hasBatFinalId && battingSelectCols.length > 0) {
      const battingRes = await pool.query(
        `
        SELECT
          b.team_id,
          t.name AS team_name,
          ${battingSelectCols.map((c) => `b.${c}`).join(", ")}
        FROM ${battingTable} b
        JOIN teams t ON t.id = b.team_id
        WHERE b.final_id = $1
          AND b.team_id = ANY($2::int[])
        ORDER BY t.name, b.player_name
        `,
        [finalId, teamIds],
      );
      battingRows = battingRes.rows;
    }

    if (pitchingExists && hasPitFinalId && pitchingSelectCols.length > 0) {
      const pitchingRes = await pool.query(
        `
        SELECT
          p.team_id,
          t.name AS team_name,
          ${pitchingSelectCols.map((c) => `p.${c}`).join(", ")}
        FROM ${pitchingTable} p
        JOIN teams t ON t.id = p.team_id
        WHERE p.final_id = $1
          AND p.team_id = ANY($2::int[])
        ORDER BY t.name, p.player_name
        `,
        [finalId, teamIds],
      );
      pitchingRows = pitchingRes.rows;
    }

    // 5) Group by team
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

    // Normalize keys so frontend always receives expected fields (null when missing)
    for (const row of battingRows) {
      const t = ensureTeam(row.team_id, row.team_name);
      t.batting.push({
        team_id: row.team_id,
        team_name: row.team_name,
        ...pick(row, battingWanted),
      });
    }

    for (const row of pitchingRows) {
      const t = ensureTeam(row.team_id, row.team_name);
      t.pitching.push({
        team_id: row.team_id,
        team_name: row.team_name,
        ...pick(row, pitchingWanted),
      });
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
 * 1) If championship_mvp_stats exists and has snapshot -> return it
 * 2) Else try to locate MVP in final batting/pitching tables (best effort)
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
        c.mvp_player_id,
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

    // Snapshot table optional
    const snapTable = "championship_mvp_stats";
    const snapExists = await tableExists(snapTable);

    if (snapExists) {
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

    // Best-effort: search MVP name inside final tables (works even if schema differs)
    const battingTable = "championship_final_batting";
    const pitchingTable = "championship_final_pitching";

    const battingExists = await tableExists(battingTable);
    const pitchingExists = await tableExists(pitchingTable);

    let batRes = { rows: [] };
    let pitRes = { rows: [] };

    if (battingExists) {
      const cols = await getTableColumns(battingTable);
      if (cols.has("player_name")) {
        batRes = await pool.query(
          `
          SELECT b.*, t.name AS team_name
          FROM ${battingTable} b
          JOIN teams t ON t.id = b.team_id
          WHERE b.player_name ILIKE $1
          LIMIT 10
          `,
          [`%${champ.mvp_name}%`],
        );
      }
    }

    if (pitchingExists) {
      const cols = await getTableColumns(pitchingTable);
      if (cols.has("player_name")) {
        pitRes = await pool.query(
          `
          SELECT p.*, t.name AS team_name
          FROM ${pitchingTable} p
          JOIN teams t ON t.id = p.team_id
          WHERE p.player_name ILIKE $1
          LIMIT 10
          `,
          [`%${champ.mvp_name}%`],
        );
      }
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
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch MVP stats" });
  }
};
