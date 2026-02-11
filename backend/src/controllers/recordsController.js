// backend/src/controllers/recordsController.js
import { pool } from "../db.js";

// -------------------------
// Helpers
// -------------------------
function normKey(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/\(.*?\)/g, "") // remove stuff like "(CA)"
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Hard canonical merge for Santa Barbara variants
function canonicalTeamKey(name) {
  const n = normKey(name);

  if (
    n.includes("santa barbara") &&
    (n.includes("foresters") || n === "santa barbara ca")
  ) {
    return "santa barbara foresters";
  }

  if (n.includes("fairbanks") && n.includes("goldpanners")) {
    return "fairbanks goldpanners";
  }

  return n;
}

async function tableExists(tableName) {
  const r = await pool.query("SELECT to_regclass($1) AS reg", [tableName]);
  return !!r.rows?.[0]?.reg;
}

async function columnExists(tableName, columnName) {
  const r = await pool.query(
    `
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = $1
      AND column_name = $2
    LIMIT 1
  `,
    [tableName, columnName],
  );
  return r.rowCount > 0;
}

// -------------------------
// MVP (COPY/PASTE from your working version)
// -------------------------
async function getMostMvpAwards() {
  // (A) MVP inside championships?
  if (await tableExists("championships")) {
    const hasMvpName =
      (await columnExists("championships", "mvp_name")) ||
      (await columnExists("championships", "mvp")) ||
      (await columnExists("championships", "mvp_player_name"));

    if (hasMvpName && (await columnExists("championships", "year"))) {
      // pick whichever column exists
      const col = (await columnExists("championships", "mvp_name"))
        ? "mvp_name"
        : (await columnExists("championships", "mvp_player_name"))
          ? "mvp_player_name"
          : "mvp";

      const r = await pool.query(
        `
        SELECT ${col} AS name, COUNT(*)::int AS mvps
        FROM championships
        WHERE ${col} IS NOT NULL AND TRIM(${col}) <> ''
        GROUP BY ${col}
        ORDER BY COUNT(*) DESC, ${col} ASC
        LIMIT 1
      `,
      );

      if (r.rowCount > 0)
        return { name: r.rows[0].name, mvps: String(r.rows[0].mvps) };
    }

    // MVP as player_id in championships?
    const hasMvpId =
      (await columnExists("championships", "mvp_player_id")) ||
      (await columnExists("championships", "mvp_id"));

    if (hasMvpId && (await tableExists("players"))) {
      const idCol = (await columnExists("championships", "mvp_player_id"))
        ? "mvp_player_id"
        : "mvp_id";

      // players name columns vary; try a few
      const hasFull = await columnExists("players", "full_name");
      const hasFirst = await columnExists("players", "first_name");
      const hasLast = await columnExists("players", "last_name");

      const nameExpr = hasFull
        ? "p.full_name"
        : hasFirst && hasLast
          ? "(p.first_name || ' ' || p.last_name)"
          : "CAST(p.id AS text)";

      const r = await pool.query(
        `
        SELECT ${nameExpr} AS name, COUNT(*)::int AS mvps
        FROM championships c
        JOIN players p ON p.id = c.${idCol}
        WHERE c.${idCol} IS NOT NULL
        GROUP BY ${nameExpr}
        ORDER BY COUNT(*) DESC, ${nameExpr} ASC
        LIMIT 1
      `,
      );

      if (r.rowCount > 0)
        return { name: r.rows[0].name, mvps: String(r.rows[0].mvps) };
    }
  }

  // (B) Awards-style tables: find any table with columns: award + player_name (or player) + year
  const awardCandidates = await pool.query(`
    SELECT table_name
    FROM information_schema.columns
    WHERE table_schema='public'
      AND column_name IN ('award','player_name','year')
    GROUP BY table_name
    HAVING COUNT(DISTINCT column_name)=3
  `);

  for (const row of awardCandidates.rows) {
    const t = row.table_name;
    try {
      const r = await pool.query(
        `
        SELECT player_name AS name, COUNT(*)::int AS mvps
        FROM ${t}
        WHERE award IS NOT NULL AND LOWER(award) LIKE '%mvp%'
          AND player_name IS NOT NULL AND TRIM(player_name) <> ''
        GROUP BY player_name
        ORDER BY COUNT(*) DESC, player_name ASC
        LIMIT 1
      `,
      );

      if (r.rowCount > 0)
        return { name: r.rows[0].name, mvps: String(r.rows[0].mvps) };
    } catch {
      // ignore
    }
  }

  return null;
}

// -------------------------
// Total tournaments (distinct years when possible)
// -------------------------
async function getTotalTournamentsFromChampionships() {
  if (!(await tableExists("championships"))) return null;

  if (await columnExists("championships", "year")) {
    const r = await pool.query(
      "SELECT COUNT(DISTINCT year)::int AS n FROM championships WHERE year IS NOT NULL",
    );
    return r.rows?.[0]?.n ?? null;
  }

  const r = await pool.query("SELECT COUNT(*)::int AS n FROM championships");
  return r.rows?.[0]?.n ?? null;
}

// -------------------------
// Controller
// -------------------------
export async function getRecordsOverview(req, res) {
  try {
    if (!(await tableExists("championships"))) {
      return res.status(500).json({ error: "Missing table: championships" });
    }
    if (!(await tableExists("teams"))) {
      return res.status(500).json({ error: "Missing table: teams" });
    }

    // Pull all teams once
    const teamsR = await pool.query(`
      SELECT id, name, city, state
      FROM teams
    `);

    const teamById = new Map();
    for (const t of teamsR.rows) teamById.set(Number(t.id), t);

    function pickBestIdentity(rows) {
      if (!rows.length) return { name: null, city: null, state: null };

      const sorted = [...rows].sort((a, b) => {
        const aMiss = a.city ? 0 : 1;
        const bMiss = b.city ? 0 : 1;
        if (aMiss !== bMiss) return aMiss - bMiss;
        return String(a.name || "").length - String(b.name || "").length;
      });

      return {
        name: sorted[0].name ?? null,
        city: sorted[0].city ?? null,
        state: sorted[0].state ?? null,
      };
    }

    const champsR = await pool.query(`
      SELECT year, champion_team_id, runner_up_team_id
      FROM championships
      WHERE year IS NOT NULL
      ORDER BY year ASC
    `);

    // -------------------------
    // 1) Most Championships
    // -------------------------
    const champCountByKey = new Map();
    const teamRowsByKey = new Map();

    for (const row of champsR.rows) {
      const champId = row.champion_team_id
        ? Number(row.champion_team_id)
        : null;
      if (!champId) continue;

      const team = teamById.get(champId);
      if (!team) continue;

      const key = canonicalTeamKey(team.name);
      champCountByKey.set(key, (champCountByKey.get(key) || 0) + 1);

      if (!teamRowsByKey.has(key)) teamRowsByKey.set(key, []);
      teamRowsByKey.get(key).push(team);
    }

    let most_championships = null;
    if (champCountByKey.size) {
      const bestKey = [...champCountByKey.entries()].sort(
        (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
      )[0][0];

      const bestIdentity = pickBestIdentity(teamRowsByKey.get(bestKey) || []);
      most_championships = {
        name: bestIdentity.name,
        city: bestIdentity.city,
        state: bestIdentity.state,
        championships: String(champCountByKey.get(bestKey)),
      };
    }

    // -------------------------
    // 2) Most Finals Appearances
    // -------------------------
    const finalsCountByKey = new Map();
    const finalsTeamRowsByKey = new Map();

    for (const row of champsR.rows) {
      const ids = [];
      if (row.champion_team_id) ids.push(Number(row.champion_team_id));
      if (row.runner_up_team_id) ids.push(Number(row.runner_up_team_id));

      for (const id of ids) {
        const team = teamById.get(id);
        if (!team) continue;

        const key = canonicalTeamKey(team.name);
        finalsCountByKey.set(key, (finalsCountByKey.get(key) || 0) + 1);

        if (!finalsTeamRowsByKey.has(key)) finalsTeamRowsByKey.set(key, []);
        finalsTeamRowsByKey.get(key).push(team);
      }
    }

    let most_appearances = null;
    if (finalsCountByKey.size) {
      const bestKey = [...finalsCountByKey.entries()].sort(
        (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
      )[0][0];

      const bestIdentity = pickBestIdentity(
        finalsTeamRowsByKey.get(bestKey) || [],
      );
      most_appearances = {
        name: bestIdentity.name,
        city: bestIdentity.city,
        state: bestIdentity.state,
        appearances: String(finalsCountByKey.get(bestKey)),
      };
    }

    // -------------------------
    // 3) MVP (WORKING VERSION)
    // -------------------------
    const most_mvp_awards = await getMostMvpAwards();

    // -------------------------
    // 4) Total tournaments (distinct years)
    // -------------------------
    const total = await getTotalTournamentsFromChampionships();

    // -------------------------
    // 5) Recent champions (last 5)
    // -------------------------
    const recentR = await pool.query(`
      SELECT c.year, t.name, t.city, t.state
      FROM championships c
      JOIN teams t ON t.id = c.champion_team_id
      WHERE c.year IS NOT NULL
      ORDER BY c.year DESC
      LIMIT 5
    `);

    const recent_champions = recentR.rows.map((r) => ({
      year: String(r.year),
      name: r.name,
      city: r.city,
      state: r.state,
    }));

    // -------------------------
    // 6) Streaks (by canonical key)
    // -------------------------
    const yearsByKey = new Map();
    for (const row of champsR.rows) {
      const id = row.champion_team_id ? Number(row.champion_team_id) : null;
      if (!id) continue;

      const team = teamById.get(id);
      if (!team) continue;

      const key = canonicalTeamKey(team.name);
      if (!yearsByKey.has(key)) yearsByKey.set(key, []);
      yearsByKey.get(key).push(Number(row.year));

      if (!teamRowsByKey.has(key)) teamRowsByKey.set(key, []);
      teamRowsByKey.get(key).push(team);
    }

    const streaksAll = [];
    for (const [key, years] of yearsByKey.entries()) {
      const sortedYears = [...new Set(years)].sort((a, b) => a - b);
      if (!sortedYears.length) continue;

      let start = sortedYears[0];
      let prev = sortedYears[0];

      for (let i = 1; i < sortedYears.length; i++) {
        const y = sortedYears[i];
        if (y === prev + 1) {
          prev = y;
          continue;
        }
        streaksAll.push({
          key,
          start_year: start,
          end_year: prev,
          length: prev - start + 1,
        });
        start = y;
        prev = y;
      }
      streaksAll.push({
        key,
        start_year: start,
        end_year: prev,
        length: prev - start + 1,
      });
    }

    streaksAll.sort((a, b) => b.length - a.length || b.end_year - a.end_year);

    const championship_streaks = streaksAll.slice(0, 5).map((s) => {
      const bestIdentity = pickBestIdentity(teamRowsByKey.get(s.key) || []);
      return {
        name: bestIdentity.name || "Unknown",
        start_year: String(s.start_year),
        end_year: String(s.end_year),
        length: String(s.length),
      };
    });

    return res.json({
      most_championships,
      most_appearances,
      most_mvp_awards, // { name, mvps }
      total_tournaments: total === null ? null : String(total),
      championship_streaks,
      recent_champions,
    });
  } catch (err) {
    console.error("[recordsController] overview error:", err?.message || err);
    if (err?.stack) console.error(err.stack);
    return res.status(500).json({
      error: "Failed to load records overview",
      details: err?.message || String(err),
    });
  }
}

export const getAllTimeRecords = getRecordsOverview;
