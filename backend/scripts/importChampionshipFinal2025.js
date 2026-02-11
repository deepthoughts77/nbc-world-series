// backend/scripts/importChampionshipFinal2025.js
//
// Imports the 2025 Championship Final CSVs into Postgres using the SAME pattern
// as your working import2025Stats.js script (pool.connect + BEGIN/COMMIT/ROLLBACK).
//
// Files expected:
//   backend/data/imports/championship_final_2025.csv
//   backend/data/imports/championship_final_batting_2025.csv
//   backend/data/imports/championship_final_pitching_2025.csv
//
// Run:
//   npm i csv-parser
//   node scripts/importChampionshipFinal2025.js
//
// Notes:
// - Fixes your team-name mismatch:
//     CSV uses "Hutchinson" and "Hutch Monarchs"
//     DB uses  "Hutchinson Monarchs"
// - Skips MVP table insert if you don't have permission OR if table missing.
//   (So the main batting/pitching import completes.)

import { pool } from "../src/db.js";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const YEAR = 2025;

const FINAL_CSV = path.join(
  __dirname,
  `../data/imports/championship_final_${YEAR}.csv`,
);
const BATTING_CSV = path.join(
  __dirname,
  `../data/imports/championship_final_batting_${YEAR}.csv`,
);
const PITCHING_CSV = path.join(
  __dirname,
  `../data/imports/championship_final_pitching_${YEAR}.csv`,
);

function readCsv(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

function toInt(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function normalizeTeamName(name) {
  const s = String(name || "").trim();

  // ✅ This map matches what your console output showed:
  // DB champion: Hutchinson Monarchs
  // CSV teams:  Hutchinson  / Hutch Monarchs
  const TEAM_MAP = {
    Hutchinson: "Hutchinson Monarchs",
    "Hutch Monarchs": "Hutchinson Monarchs",
    "Hutchinson Monarchs": "Hutchinson Monarchs",

    "Lonestar Kraken TX": "Lonestar Kraken TX",
  };

  return (TEAM_MAP[s] || s).trim();
}

// Cleans "Jake Gutierrez rf/lf" -> "Jake Gutierrez"
// Also cleans trailing record suffix like "Pryce Bender W,1-1" -> "Pryce Bender"
function cleanPlayerName(raw) {
  let s = String(raw || "").trim();
  if (!s) return s;

  // Remove trailing position tokens
  const parts = s.split(/\s+/);
  if (parts.length >= 2) {
    const last = parts[parts.length - 1].toLowerCase();
    const looksLikePos =
      last.includes("/") ||
      [
        "p",
        "c",
        "1b",
        "2b",
        "3b",
        "ss",
        "lf",
        "cf",
        "rf",
        "dh",
        "of",
        "if",
      ].includes(last);

    if (looksLikePos) {
      s = parts.slice(0, -1).join(" ");
    }
  }

  // Remove trailing "W,1-1" or "L,0-1" style
  s = s.replace(/\s+[WL],\d+-\d+$/i, "").trim();

  return s;
}

async function ensureTables(client) {
  // Create tables if missing
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.championship_final_batting (
      id BIGSERIAL PRIMARY KEY,
      year INT NOT NULL,
      team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      player_name TEXT NOT NULL,
      ab INT DEFAULT 0,
      r  INT DEFAULT 0,
      h  INT DEFAULT 0,
      rbi INT DEFAULT 0,
      bb INT DEFAULT 0,
      so INT DEFAULT 0,
      po INT DEFAULT 0,
      a  INT DEFAULT 0,
      lob INT DEFAULT 0,
      UNIQUE (year, team_id, player_name)
    );

    CREATE INDEX IF NOT EXISTS idx_cfb_year_team
    ON public.championship_final_batting(year, team_id);

    CREATE TABLE IF NOT EXISTS public.championship_final_pitching (
      id BIGSERIAL PRIMARY KEY,
      year INT NOT NULL,
      team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      player_name TEXT NOT NULL,
      ip TEXT,
      h INT DEFAULT 0,
      r INT DEFAULT 0,
      er INT DEFAULT 0,
      bb INT DEFAULT 0,
      so INT DEFAULT 0,
      bf INT DEFAULT 0,
      hbp INT DEFAULT 0,
      wp INT DEFAULT 0,
      bk INT DEFAULT 0,
      rbi INT DEFAULT 0,
      UNIQUE (year, team_id, player_name, ip)
    );

    CREATE INDEX IF NOT EXISTS idx_cfp_year_team
    ON public.championship_final_pitching(year, team_id);

    CREATE TABLE IF NOT EXISTS public.championship_mvp_stats (
      championship_id INT PRIMARY KEY REFERENCES championships(id) ON DELETE CASCADE,
      stats_snapshot JSONB,
      stats_source TEXT
    );
  `);
}

async function importChampionshipFinal2025() {
  const client = await pool.connect();

  try {
    console.log(`🚀 Starting Championship Final import for ${YEAR}...\n`);

    // 0) Validate files exist
    for (const fp of [FINAL_CSV, BATTING_CSV, PITCHING_CSV]) {
      console.log(`📂 Checking file: ${fp}`);
      if (!fs.existsSync(fp)) {
        throw new Error(`CSV not found at: ${fp}`);
      }
    }
    console.log("\n✅ All CSV files found.\n");

    // 1) Read CSVs first (fast fail if parsing errors)
    console.log("📥 Reading CSVs...");
    const finalRows = await readCsv(FINAL_CSV);
    const battingRows = await readCsv(BATTING_CSV);
    const pitchingRows = await readCsv(PITCHING_CSV);
    console.log(`✅ Loaded final: ${finalRows.length} rows`);
    console.log(`✅ Loaded batting: ${battingRows.length} rows`);
    console.log(`✅ Loaded pitching: ${pitchingRows.length} rows\n`);

    await client.query("BEGIN");

    // 2) Ensure tables exist
    console.log("🧱 Ensuring tables exist...");
    await ensureTables(client);
    console.log("✅ Tables ready.\n");

    // 3) Load championship record (source of truth for team IDs)
    console.log(`🔎 Loading championship record for ${YEAR}...`);
    const champRes = await client.query(
      `
      SELECT
        c.id AS championship_id,
        c.year,
        c.champion_team_id,
        c.runner_up_team_id,
        c.mvp_player_id,
        ct.name AS champion_name,
        rt.name AS runner_up_name
      FROM championships c
      LEFT JOIN teams ct ON c.champion_team_id = ct.id
      LEFT JOIN teams rt ON c.runner_up_team_id = rt.id
      WHERE c.year = $1
      LIMIT 1
      `,
      [YEAR],
    );

    if (champRes.rows.length === 0) {
      throw new Error(
        `No championships row found for ${YEAR}. Add it first, then re-run import.`,
      );
    }

    const champ = champRes.rows[0];
    const championNameNorm = normalizeTeamName(champ.champion_name);
    const runnerUpNameNorm = normalizeTeamName(champ.runner_up_name);

    console.log("✅ Championship found:");
    console.log(
      `   Champion (DB): ${champ.champion_name} -> ${championNameNorm} [team_id=${champ.champion_team_id}]`,
    );
    console.log(
      `   Runner-up(DB): ${champ.runner_up_name} -> ${runnerUpNameNorm} [team_id=${champ.runner_up_team_id}]\n`,
    );

    // 4) Update championships.championship_score from final CSV (optional)
    if (finalRows.length > 0) {
      const f = finalRows[0];
      const champScore = f.champion_score
        ? String(f.champion_score).trim()
        : null;
      const runnerScore = f.runner_up_score
        ? String(f.runner_up_score).trim()
        : null;

      if (champScore && runnerScore) {
        const scoreText = `${champScore}-${runnerScore}`;
        await client.query(
          `UPDATE championships SET championship_score = $1 WHERE year = $2`,
          [scoreText, YEAR],
        );
        console.log(
          `🏆 Updated championships.championship_score = "${scoreText}"\n`,
        );
      } else {
        console.log(
          "ℹ️  Final CSV score not found, skipping championship_score update.\n",
        );
      }
    }

    // helper: map CSV team_name -> team_id (champion or runner-up)
    function getTeamIdFromCsvTeamName(csvTeamName) {
      const norm = normalizeTeamName(csvTeamName);
      if (norm === championNameNorm) return champ.champion_team_id;
      if (norm === runnerUpNameNorm) return champ.runner_up_team_id;
      return null;
    }

    // 5) Import batting (upsert-style)
    console.log("⚾ Importing final batting lines...");
    let battingUpserts = 0;
    let battingSkipped = 0;

    for (const r of battingRows) {
      const teamId = getTeamIdFromCsvTeamName(r.team_name);
      if (!teamId) {
        battingSkipped++;
        console.log(
          `  ⚠️  Skipping batting row (unknown team): ${r.team_name} | ${r.player_name}`,
        );
        continue;
      }

      const playerName = cleanPlayerName(r.player_name);

      await client.query(
        `
        INSERT INTO public.championship_final_batting
          (year, team_id, player_name, ab, r, h, rbi, bb, so, po, a, lob)
        VALUES
          ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        ON CONFLICT (year, team_id, player_name)
        DO UPDATE SET
          ab = EXCLUDED.ab,
          r  = EXCLUDED.r,
          h  = EXCLUDED.h,
          rbi= EXCLUDED.rbi,
          bb = EXCLUDED.bb,
          so = EXCLUDED.so,
          po = EXCLUDED.po,
          a  = EXCLUDED.a,
          lob= EXCLUDED.lob
        `,
        [
          YEAR,
          teamId,
          playerName,
          toInt(r.ab),
          toInt(r.r),
          toInt(r.h),
          toInt(r.rbi),
          toInt(r.bb),
          toInt(r.so),
          toInt(r.po),
          toInt(r.a),
          toInt(r.lob),
        ],
      );

      battingUpserts++;
    }

    console.log(
      `✅ Batting import done. Upserts: ${battingUpserts} | Skipped: ${battingSkipped}\n`,
    );

    // 6) Import pitching (upsert-style)
    console.log("🥎 Importing final pitching lines...");
    let pitchingUpserts = 0;
    let pitchingSkipped = 0;

    for (const r of pitchingRows) {
      const teamId = getTeamIdFromCsvTeamName(r.team_name);
      if (!teamId) {
        pitchingSkipped++;
        console.log(
          `  ⚠️  Skipping pitching row (unknown team): ${r.team_name} | ${r.player_name}`,
        );
        continue;
      }

      const playerName = cleanPlayerName(r.player_name);
      const ip = r.ip ? String(r.ip).trim() : null;

      await client.query(
        `
        INSERT INTO public.championship_final_pitching
          (year, team_id, player_name, ip, h, r, er, bb, so, bf, hbp, wp, bk, rbi)
        VALUES
          ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
        ON CONFLICT (year, team_id, player_name, ip)
        DO UPDATE SET
          h = EXCLUDED.h,
          r = EXCLUDED.r,
          er = EXCLUDED.er,
          bb = EXCLUDED.bb,
          so = EXCLUDED.so,
          bf = EXCLUDED.bf,
          hbp= EXCLUDED.hbp,
          wp = EXCLUDED.wp,
          bk = EXCLUDED.bk,
          rbi= EXCLUDED.rbi
        `,
        [
          YEAR,
          teamId,
          playerName,
          ip,
          toInt(r.h),
          toInt(r.r),
          toInt(r.er),
          toInt(r.bb),
          toInt(r.so),
          toInt(r.bf),
          toInt(r.hbp),
          toInt(r.wp),
          toInt(r.bk),
          toInt(r.rbi),
        ],
      );

      pitchingUpserts++;
    }

    console.log(
      `✅ Pitching import done. Upserts: ${pitchingUpserts} | Skipped: ${pitchingSkipped}\n`,
    );

    // 7) OPTIONAL: MVP placeholder (doesn't block the main import)
    // If you have permissions, it will insert; otherwise it logs and continues.
    if (champ.mvp_player_id) {
      try {
        await client.query(
          `
          INSERT INTO public.championship_mvp_stats (championship_id, stats_snapshot, stats_source)
          VALUES ($1, NULL, 'not set')
          ON CONFLICT (championship_id) DO NOTHING
          `,
          [champ.championship_id],
        );
        console.log("⭐ MVP placeholder row ensured (championship_mvp_stats).");
      } catch (e) {
        console.log(
          "⚠️  Skipping MVP placeholder (no permission or table access):",
          e.message,
        );
        console.log(
          "   Fix by running in pgAdmin as postgres:\n" +
            "   GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.championship_mvp_stats TO nbc_admin;",
        );
      }
    }

    await client.query("COMMIT");

    console.log("\n" + "=".repeat(70));
    console.log("🎉 FINAL IMPORT COMPLETE!");
    console.log("=".repeat(70));
    console.log(`📅 Year: ${YEAR}`);
    console.log(`⚾ Batting upserts: ${battingUpserts}`);
    console.log(`🥎 Pitching upserts: ${pitchingUpserts}`);
    console.log(`⚠️  Batting skipped: ${battingSkipped}`);
    console.log(`⚠️  Pitching skipped: ${pitchingSkipped}`);
    console.log("=".repeat(70) + "\n");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("\n❌ ERROR during import:", error.message);
    console.error(error.stack);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run import
importChampionshipFinal2025()
  .then(() => {
    console.log("✅ Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
