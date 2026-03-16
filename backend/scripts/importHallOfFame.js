// backend/scripts/importHallOfFame.js
//
// Imports NBC Hall of Fame inductees from CSV into PostgreSQL.
//
// CSV columns:
//   induction_year, name
//
// Table schema (matches hofController.js):
//   hall_of_fame (id, inductee_name, induction_year, player_id, category, bio)
//
// Usage:
//   1. Place CSV at:  backend/data/nbc_hof.csv
//   2. node backend/scripts/importHallOfFame.js

import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pg;

// ── DB connection ─────────────────────────────────────────────────────────
const pool = new Pool({
  user: "nbc_admin",
  host: "127.0.0.1",
  database: "nbc_world_series",
  password: "Ghostweep147@",
  port: 5432,
});

// ── File paths ────────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOF_CSVS = [path.join(__dirname, "../data/nbc_hof.csv")];

// ── Options ───────────────────────────────────────────────────────────────
// Set to true to wipe all existing HOF rows before importing.
const CLEAN_FIRST = true;

// ── CSV reader ────────────────────────────────────────────────────────────

function readCsv(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌  Missing file: ${filePath}`);
    return [];
  }

  const content = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const headers = lines[0].split(",").map((h) => h.trim());

  return lines.slice(1).map((line) => {
    // Split on first comma only — names may contain commas (Jr., III, etc.)
    const commaIdx = line.indexOf(",");
    const row = {};
    row[headers[0]] = line.slice(0, commaIdx).trim();
    row[headers[1]] = line.slice(commaIdx + 1).trim();
    return row;
  });
}

// ── Name splitter ─────────────────────────────────────────────────────────

/**
 * Splits a full name into first/last for the players table lookup.
 * Handles:
 *   "Satchel Paige"           → first="Satchel",  last="Paige"
 *   'Arnold "Jug" Thesenga'   → first="Arnold",   last='"Jug" Thesenga'
 *   "Roy Smalley III"         → first="Roy",       last="Smalley III"
 *   'H.A. "Red" Boucher'      → first="H.A.",      last='"Red" Boucher'
 *   "Buck O'Neil"             → first="Buck",      last="O'Neil"
 */
function splitName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: "", lastName: parts[0] };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

// ── Main ──────────────────────────────────────────────────────────────────

async function run() {
  const client = await pool.connect();

  try {
    const allRows = HOF_CSVS.flatMap(readCsv);
    console.log(`📂  Total HOF rows loaded: ${allRows.length}`);

    await client.query("BEGIN");

    // ── Optional clean ────────────────────────────────────────────────
    if (CLEAN_FIRST) {
      console.log("🧹  Clearing existing Hall of Fame rows…");
      await client.query("DELETE FROM hall_of_fame");
    }

    let inserted = 0;
    let skipped = 0;

    for (let i = 0; i < allRows.length; i++) {
      const r = allRows[i];

      if (!r.name || !r.induction_year) {
        skipped++;
        continue;
      }

      const year = parseInt(r.induction_year, 10);
      if (isNaN(year)) {
        console.warn(
          `   ⚠️  Skipping invalid year: "${r.induction_year}" for ${r.name}`,
        );
        skipped++;
        continue;
      }

      // ── Look up or create player ──────────────────────────────────
      const { firstName, lastName } = splitName(r.name);

      let pRes = await client.query(
        "SELECT id FROM players WHERE first_name = $1 AND last_name = $2",
        [firstName, lastName],
      );
      let playerId = pRes.rows[0]?.id ?? null;

      if (!playerId) {
        const insertRes = await client.query(
          "INSERT INTO players (first_name, last_name) VALUES ($1, $2) RETURNING id",
          [firstName, lastName],
        );
        playerId = insertRes.rows[0].id;
      }

      // ── Sanity log for first row ──────────────────────────────────
      if (i === 0) {
        console.log(
          `   ✔ First HOF row: "${r.name}" → player_id=${playerId}, year=${year}`,
        );
      }

      // ── Insert into hall_of_fame ──────────────────────────────────
      // category defaults to 'Contributor' to satisfy the NOT NULL constraint.
      // Update individual rows to 'Player' or 'Coach' once you have that data.
      // bio is nullable so NULL is safe here.
      await client.query(
        `INSERT INTO hall_of_fame
           (inductee_name, induction_year, player_id, category, bio)
         VALUES ($1, $2, $3, 'Contributor', NULL)`,
        [r.name, year, playerId],
      );

      inserted++;
    }

    await client.query("COMMIT");

    console.log(`\n🎉  Hall of Fame import complete!`);
    console.log(`    Inserted: ${inserted}`);
    console.log(`    Skipped:  ${skipped}`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("\n❌  Import failed — transaction rolled back.");
    console.error(err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
