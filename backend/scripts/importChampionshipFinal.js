// backend/scripts/importChampionshipFinal.js
import "dotenv/config";
import { pool } from "../src/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function mustIntYear(arg) {
  const y = Number(arg);
  if (!Number.isInteger(y) || y < 1900 || y > 2100) {
    throw new Error(`Year must be a valid 4-digit number. Got: ${arg}`);
  }
  return y;
}

// Simple CSV parser (works for your current finals CSVs: no embedded commas/quotes)
function parseCsvFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8").trim();
  const lines = raw.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.trim());
    const obj = {};
    headers.forEach((h, idx) => (obj[h] = cols[idx] ?? ""));
    rows.push(obj);
  }
  return rows;
}

async function ensureTables(client) {
  // Keep schema aligned with your working 2025 import expectations.
  // If tables already exist, these IF NOT EXISTS statements are safe.
  await client.query(`
    CREATE TABLE IF NOT EXISTS championship_final_batting (
      id SERIAL PRIMARY KEY,
      year INT NOT NULL,
      team_id INT NULL REFERENCES teams(id) ON DELETE SET NULL,
      team_name TEXT NOT NULL,
      player_name TEXT NOT NULL,
      ab INT NULL,
      r INT NULL,
      h INT NULL,
      rbi INT NULL,
      bb INT NULL,
      so INT NULL,
      po INT NULL,
      a INT NULL,
      lob INT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(year, team_name, player_name)
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS championship_final_pitching (
      id SERIAL PRIMARY KEY,
      year INT NOT NULL,
      team_id INT NULL REFERENCES teams(id) ON DELETE SET NULL,
      team_name TEXT NOT NULL,
      player_name TEXT NOT NULL,
      decision TEXT NULL,
      ip TEXT NULL,
      h INT NULL,
      r INT NULL,
      er INT NULL,
      bb INT NULL,
      so INT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(year, team_name, player_name)
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS championship_mvp_stats (
      year INT PRIMARY KEY,
      player_name TEXT NULL,
      team_id INT NULL REFERENCES teams(id) ON DELETE SET NULL,
      source TEXT NULL,
      batting_json JSONB NULL,
      pitching_json JSONB NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function findTeamId(client, teamName) {
  const t = await client.query(
    `SELECT id, name FROM teams WHERE name = $1 LIMIT 1`,
    [teamName],
  );
  if (t.rows.length) return t.rows[0].id;
  return null;
}

async function main() {
  const YEAR = mustIntYear(process.argv[2]);

  const finalPath = path.join(
    __dirname,
    `../data/imports/championship_final_${YEAR}.csv`,
  );
  const batPath = path.join(
    __dirname,
    `../data/imports/championship_final_batting_${YEAR}.csv`,
  );
  const pitPath = path.join(
    __dirname,
    `../data/imports/championship_final_pitching_${YEAR}.csv`,
  );

  console.log(`🏁 Starting Championship Final import for ${YEAR}...\n`);
  console.log("Using CSV files:");
  console.log("  ", finalPath);
  console.log("  ", batPath);
  console.log("  ", pitPath);

  if (!fs.existsSync(finalPath)) throw new Error(`Missing: ${finalPath}`);
  if (!fs.existsSync(batPath)) throw new Error(`Missing: ${batPath}`);
  if (!fs.existsSync(pitPath)) throw new Error(`Missing: ${pitPath}`);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await ensureTables(client);

    const finalRows = parseCsvFile(finalPath);
    const battingRows = parseCsvFile(batPath);
    const pitchingRows = parseCsvFile(pitPath);

    if (!finalRows.length) throw new Error("Final CSV has no rows.");

    const final = finalRows[0];

    // Update championships.championship_score if present
    if (final.championship_score) {
      await client.query(
        `UPDATE championships SET championship_score = $1 WHERE year = $2`,
        [final.championship_score, YEAR],
      );
    }

    // Team IDs (optional; still keep team_name stored either way)
    const champTeamId = final.champion_team
      ? await findTeamId(client, final.champion_team)
      : null;
    const runnerTeamId = final.runner_up_team
      ? await findTeamId(client, final.runner_up_team)
      : null;

    let batUpserts = 0;
    for (const r of battingRows) {
      const teamId =
        r.team_name === final.champion_team
          ? champTeamId
          : r.team_name === final.runner_up_team
            ? runnerTeamId
            : await findTeamId(client, r.team_name);

      await client.query(
        `
        INSERT INTO championship_final_batting
          (year, team_id, team_name, player_name, ab, r, h, rbi, bb, so, po, a, lob)
        VALUES
          ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        ON CONFLICT (year, team_name, player_name)
        DO UPDATE SET
          team_id = EXCLUDED.team_id,
          ab = EXCLUDED.ab,
          r = EXCLUDED.r,
          h = EXCLUDED.h,
          rbi = EXCLUDED.rbi,
          bb = EXCLUDED.bb,
          so = EXCLUDED.so,
          po = EXCLUDED.po,
          a = EXCLUDED.a,
          lob = EXCLUDED.lob,
          updated_at = NOW()
        `,
        [
          YEAR,
          teamId,
          r.team_name,
          r.player_name,
          r.ab ? Number(r.ab) : null,
          r.r ? Number(r.r) : null,
          r.h ? Number(r.h) : null,
          r.rbi ? Number(r.rbi) : null,
          r.bb ? Number(r.bb) : null,
          r.so ? Number(r.so) : null,
          r.po ? Number(r.po) : null,
          r.a ? Number(r.a) : null,
          r.lob ? Number(r.lob) : null,
        ],
      );
      batUpserts++;
    }

    let pitUpserts = 0;
    for (const r of pitchingRows) {
      const teamId =
        r.team_name === final.champion_team
          ? champTeamId
          : r.team_name === final.runner_up_team
            ? runnerTeamId
            : await findTeamId(client, r.team_name);

      await client.query(
        `
        INSERT INTO championship_final_pitching
          (year, team_id, team_name, player_name, decision, ip, h, r, er, bb, so)
        VALUES
          ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        ON CONFLICT (year, team_name, player_name)
        DO UPDATE SET
          team_id = EXCLUDED.team_id,
          decision = EXCLUDED.decision,
          ip = EXCLUDED.ip,
          h = EXCLUDED.h,
          r = EXCLUDED.r,
          er = EXCLUDED.er,
          bb = EXCLUDED.bb,
          so = EXCLUDED.so,
          updated_at = NOW()
        `,
        [
          YEAR,
          teamId,
          r.team_name,
          r.player_name,
          r.decision || null,
          r.ip || null,
          r.h ? Number(r.h) : null,
          r.r ? Number(r.r) : null,
          r.er ? Number(r.er) : null,
          r.bb ? Number(r.bb) : null,
          r.so ? Number(r.so) : null,
        ],
      );
      pitUpserts++;
    }

    // Ensure MVP row exists (even if blank for now)
    await client.query(
      `
      INSERT INTO championship_mvp_stats (year, player_name, source)
      VALUES ($1, $2, $3)
      ON CONFLICT (year) DO NOTHING
      `,
      [
        YEAR,
        final.mvp_player || null,
        final.mvp_source || "final_game_best_effort",
      ],
    );

    await client.query("COMMIT");

    console.log("\n✅ Import complete");
    console.log(`   Year: ${YEAR}`);
    console.log(`   Batting upserts: ${batUpserts}`);
    console.log(`   Pitching upserts: ${pitUpserts}`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Import failed:", err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

main()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
