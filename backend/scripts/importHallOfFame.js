import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pg;

// ── DB Connection (Render & Local Compatible) ───────────────────────────
const pool = new Pool({
  // process.env.DATABASE_URL is provided by Render automatically
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://nbc_admin:Ghostweep147@127.0.0.1:5432/nbc_world_series",
  // SSL is required for Render/External connections
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

// ── File paths ────────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOF_CSVS = [path.join(__dirname, "../data/nbc_hof.csv")];

// ── Options ───────────────────────────────────────────────────────────────
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
    const commaIdx = line.indexOf(",");
    const row = {};
    // Safely handle cases where comma might be missing
    if (commaIdx === -1) {
      row[headers[0]] = line.trim();
      row[headers[1]] = "";
    } else {
      row[headers[0]] = line.slice(0, commaIdx).trim();
      row[headers[1]] = line.slice(commaIdx + 1).trim();
    }
    return row;
  });
}

// ── Name splitter ─────────────────────────────────────────────────────────
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
  let client;
  try {
    client = await pool.connect();
    const allRows = HOF_CSVS.flatMap(readCsv);
    console.log(`📂  Total HOF rows loaded: ${allRows.length}`);

    await client.query("BEGIN");

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
          ` ⚠️  Skipping invalid year: "${r.induction_year}" for ${r.name}`,
        );
        skipped++;
        continue;
      }

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

      if (i === 0) {
        console.log(
          ` 🚀 First HOF row test: "${r.name}" → player_id=${playerId}, year=${year}`,
        );
      }

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
    console.log(` ✅ Inserted: ${inserted}`);
    console.log(` ⏩ Skipped:  ${skipped}`);
  } catch (err) {
    if (client) await client.query("ROLLBACK");
    console.error("\n❌  Import failed — transaction rolled back.");
    console.error(err);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

run();
