// backend/scripts/backfill_2025_po_a_e.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../src/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Recursively walk a value and collect any objects that look like
 * player stat rows with jersey_num + PO/A/E/Fld.
 */
function collectPlayerStatObjects(node, teamName, results) {
  if (!node) return;

  if (Array.isArray(node)) {
    for (const item of node) {
      collectPlayerStatObjects(item, teamName, results);
    }
    return;
  }

  if (typeof node === "object") {
    const keys = Object.keys(node);

    const hasPO = keys.some((k) => k.toLowerCase() === "po");
    const hasA = keys.some((k) => k.toLowerCase() === "a");
    const hasE = keys.some((k) => k.toLowerCase() === "e");
    const hasFld = keys.some(
      (k) => k.toLowerCase() === "fld" || k.toLowerCase() === "fld_pct"
    );
    const hasJersey = keys.some((k) =>
      ["jersey_num", "jersey", "number", "no"].includes(k.toLowerCase())
    );

    if (hasJersey && (hasPO || hasA || hasE || hasFld)) {
      results.push({ teamName, row: node });
    }

    // keep walking deeper
    for (const value of Object.values(node)) {
      collectPlayerStatObjects(value, teamName, results);
    }
  }
}

async function main() {
  const dataPath = path.join(__dirname, "..", "data", "nbc_2025_stats.json");
  console.log("Reading JSON from:", dataPath);

  const raw = fs.readFileSync(dataPath, "utf8");
  const data = JSON.parse(raw);

  const year = data.year ? parseInt(data.year, 10) : 2025;
  const teams = Array.isArray(data.teams) ? data.teams : [];

  if (teams.length === 0) {
    console.error("❌ No teams[] array found in JSON.");
    process.exit(1);
  }

  const collected = [];

  for (const team of teams) {
    const teamName =
      team.team_name?.trim() || team.name?.trim() || team.Team?.trim() || null;

    if (!teamName) {
      console.warn("⏭️  Skipping team without a name:", team);
      continue;
    }

    collectPlayerStatObjects(team, teamName, collected);
  }

  console.log(`Found ${collected.length} player stat objects with PO/A/E/FLD.`);

  let updated = 0;
  let skipped = 0;

  for (const { teamName, row } of collected) {
    // normalize jersey number
    const jerseyNumRaw =
      row.jersey_num ??
      row.jersey ??
      row.number ??
      row.no ??
      row.JERSEY ??
      null;

    const jerseyNum =
      jerseyNumRaw !== null && jerseyNumRaw !== undefined
        ? String(jerseyNumRaw).trim()
        : null;

    if (!jerseyNum) {
      skipped++;
      console.warn(
        "⏭️  Skipping row without jersey number:",
        teamName,
        row.player_name || row.Player || ""
      );
      continue;
    }

    const position =
      row.position?.trim() || row.pos?.trim() || row.POS?.trim() || null;

    const po = row.po ?? row.PO ?? null;
    const a = row.a ?? row.A ?? null;
    const e = row.e ?? row.E ?? null;
    const fld = row.fld ?? row.FLD ?? row.fld_pct ?? row.FLD_PCT ?? null;

    // 1) Find team_id
    const teamRes = await pool.query(
      `SELECT id FROM public.teams WHERE LOWER(name) = LOWER($1) LIMIT 1`,
      [teamName]
    );

    if (teamRes.rowCount === 0) {
      skipped++;
      console.warn(`⏭️  No team found in DB for "${teamName}", skipping`);
      continue;
    }

    const teamId = teamRes.rows[0].id;

    // 2) Update batting_stats
    const updateRes = await pool.query(
      `
      UPDATE public.batting_stats
      SET
        po        = $1,
        a         = $2,
        e         = $3,
        fld       = COALESCE($4, fld),
        position  = COALESCE($5, position)
      WHERE year       = $6
        AND team_id    = $7
        AND jersey_num = $8
      RETURNING id
      `,
      [po, a, e, fld, position, year, teamId, jerseyNum]
    );

    if (updateRes.rowCount === 0) {
      skipped++;
      console.warn(
        `⏭️  No batting_stats row for year=${year}, team="${teamName}", jersey=${jerseyNum}`
      );
    } else {
      updated += updateRes.rowCount;
    }
  }

  console.log(`✅ Done. Updated ${updated} rows, skipped ${skipped} rows.`);
}

main()
  .then(() => pool.end())
  .catch((err) => {
    console.error("❌ Backfill failed:", err);
    pool.end();
    process.exit(1);
  });
