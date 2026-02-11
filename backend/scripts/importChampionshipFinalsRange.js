/**
 * Import Championship Final CSVs for a year range.
 *
 * Folder layout:
 *   backend/data/imports/finals/<YEAR>/
 *
 * Files per year folder:
 *   championship_final_<YEAR>.csv
 *   championship_final_batting_<YEAR>.csv
 *   championship_final_pitching_<YEAR>.csv
 *
 * Run:
 *   node scripts/importChampionshipFinalsRange.js --from 2000 --to 2024
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse as parseCsvSync } from "csv-parse/sync";
import { pool } from "../src/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FINALS_BASE_DIR = path.join(__dirname, "../data/imports/finals");

function getArg(name, fallback) {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return fallback;
  const v = process.argv[idx + 1];
  if (!v) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

const FROM_YEAR = getArg("--from", 2000);
const TO_YEAR = getArg("--to", 2024);

// -----------------------------
// Helpers
// -----------------------------
function readCsv(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return parseCsvSync(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
}

function fileExists(p) {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function toInt(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(String(v).replace(/[^\d-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function toFloat(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(String(v).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function normalizeTeamName(s) {
  return String(s || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[’']/g, "'");
}

function yearFiles(year) {
  const yearDir = path.join(FINALS_BASE_DIR, String(year));
  return {
    yearDir,
    final: path.join(yearDir, `championship_final_${year}.csv`),
    batting: path.join(yearDir, `championship_final_batting_${year}.csv`),
    pitching: path.join(yearDir, `championship_final_pitching_${year}.csv`),
  };
}

// -----------------------------
// DB utilities
// -----------------------------
async function getOrCreateTeamId(client, teamName) {
  const name = normalizeTeamName(teamName);
  if (!name) return null;

  const exact = await client.query(
    "SELECT id FROM teams WHERE name = $1 LIMIT 1",
    [name],
  );
  if (exact.rows.length) return exact.rows[0].id;

  const loose = await client.query(
    "SELECT id FROM teams WHERE name ILIKE $1 ORDER BY length(name) ASC LIMIT 1",
    [name],
  );
  if (loose.rows.length) return loose.rows[0].id;

  const created = await client.query(
    "INSERT INTO teams (name, city, state) VALUES ($1, $2, $3) RETURNING id",
    [name, null, null],
  );
  return created.rows[0].id;
}

async function ensureFinalTables(client) {
  // Do NOT recreate if it exists; but make sure required columns exist (your DB was missing pos).
  await client.query(`
    CREATE TABLE IF NOT EXISTS championship_final_batting (
      id BIGSERIAL PRIMARY KEY,
      year INT NOT NULL,
      team_id BIGINT NOT NULL REFERENCES teams(id),
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
      UNIQUE(year, team_id, player_name)
    );
  `);

  // Add missing columns safely
  await client.query(
    `ALTER TABLE championship_final_batting ADD COLUMN IF NOT EXISTS pos TEXT;`,
  );

  await client.query(`
    CREATE TABLE IF NOT EXISTS championship_final_pitching (
      id BIGSERIAL PRIMARY KEY,
      year INT NOT NULL,
      team_id BIGINT NOT NULL REFERENCES teams(id),
      player_name TEXT NOT NULL,
      ip NUMERIC NULL,
      h INT NULL,
      r INT NULL,
      er INT NULL,
      bb INT NULL,
      so INT NULL,
      ab INT NULL,
      bf INT NULL,
      fo INT NULL,
      go INT NULL,
      hbp INT NULL,
      wp INT NULL,
      bk INT NULL,
      rbi INT NULL,
      UNIQUE(year, team_id, player_name)
    );
  `);

  await client.query(
    `ALTER TABLE championship_final_pitching ADD COLUMN IF NOT EXISTS decision TEXT;`,
  );
}

async function getChampionshipIdByYear(client, year) {
  const r = await client.query(
    "SELECT id FROM championships WHERE year = $1 LIMIT 1",
    [year],
  );
  return r.rows.length ? r.rows[0].id : null;
}

async function updateChampionshipRow(
  client,
  year,
  championTeamId,
  runnerUpTeamId,
  scoreText,
) {
  await client.query(
    `
    UPDATE championships
    SET
      champion_team_id = COALESCE($2, champion_team_id),
      runner_up_team_id = COALESCE($3, runner_up_team_id),
      championship_score = COALESCE($4, championship_score)
    WHERE year = $1
    `,
    [year, championTeamId, runnerUpTeamId, scoreText || null],
  );
}

async function upsertBatting(client, year, teamId, row) {
  const playerName = String(row.player_name || row.player || "").trim();
  if (!playerName) return false;

  await client.query(
    `
    INSERT INTO championship_final_batting
      (year, team_id, player_name, pos, ab, r, h, rbi, bb, so, po, a, lob)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
    ON CONFLICT (year, team_id, player_name)
    DO UPDATE SET
      pos = EXCLUDED.pos,
      ab = EXCLUDED.ab,
      r = EXCLUDED.r,
      h = EXCLUDED.h,
      rbi = EXCLUDED.rbi,
      bb = EXCLUDED.bb,
      so = EXCLUDED.so,
      po = EXCLUDED.po,
      a = EXCLUDED.a,
      lob = EXCLUDED.lob
    `,
    [
      year,
      teamId,
      playerName,
      row.pos || row.position || null,
      toInt(row.ab),
      toInt(row.r),
      toInt(row.h),
      toInt(row.rbi),
      toInt(row.bb),
      toInt(row.so),
      toInt(row.po),
      toInt(row.a),
      toInt(row.lob),
    ],
  );

  return true;
}

async function upsertPitching(client, year, teamId, row) {
  const playerName = String(
    row.player_name || row.pitcher_name || row.player || "",
  ).trim();
  if (!playerName) return false;

  await client.query(
    `
    INSERT INTO championship_final_pitching
      (year, team_id, player_name, decision, ip, h, r, er, bb, so, ab, bf, fo, go, hbp, wp, bk, rbi)
    VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
    ON CONFLICT (year, team_id, player_name)
    DO UPDATE SET
      decision = EXCLUDED.decision,
      ip = EXCLUDED.ip,
      h = EXCLUDED.h,
      r = EXCLUDED.r,
      er = EXCLUDED.er,
      bb = EXCLUDED.bb,
      so = EXCLUDED.so,
      ab = EXCLUDED.ab,
      bf = EXCLUDED.bf,
      fo = EXCLUDED.fo,
      go = EXCLUDED.go,
      hbp = EXCLUDED.hbp,
      wp = EXCLUDED.wp,
      bk = EXCLUDED.bk,
      rbi = EXCLUDED.rbi
    `,
    [
      year,
      teamId,
      playerName,
      row.decision || null,
      row.ip !== undefined ? toFloat(row.ip) : null,
      toInt(row.h),
      toInt(row.r),
      toInt(row.er),
      toInt(row.bb),
      toInt(row.so),
      toInt(row.ab),
      toInt(row.bf),
      toInt(row.fo),
      toInt(row.go),
      toInt(row.hbp),
      toInt(row.wp),
      toInt(row.bk),
      toInt(row.rbi),
    ],
  );

  return true;
}

// MVP: store a compact JSON snapshot in championship_mvp_stats (keyed by championship_id)
async function upsertMvpSnapshot(client, year, mvpName, championTeamId) {
  if (!mvpName) return;

  const championshipId = await getChampionshipIdByYear(client, year);
  if (!championshipId) return;

  // Try to find MVP line in final batting first, then pitching (same year + champion team).
  const bat = await client.query(
    `
    SELECT player_name, pos, ab, r, h, rbi, bb, so, po, a, lob
    FROM championship_final_batting
    WHERE year = $1 AND team_id = $2 AND lower(player_name) = lower($3)
    LIMIT 1
    `,
    [year, championTeamId, mvpName],
  );

  const pit = await client.query(
    `
    SELECT player_name, decision, ip, h, r, er, bb, so
    FROM championship_final_pitching
    WHERE year = $1 AND team_id = $2 AND lower(player_name) = lower($3)
    LIMIT 1
    `,
    [year, championTeamId, mvpName],
  );

  let snapshot = null;
  let source = "final_csv_no_line";

  if (bat.rows.length) {
    snapshot = { type: "batting_final", ...bat.rows[0] };
    source = "final_csv_batting_line";
  } else if (pit.rows.length) {
    snapshot = { type: "pitching_final", ...pit.rows[0] };
    source = "final_csv_pitching_line";
  } else {
    snapshot = { type: "name_only", player_name: mvpName };
  }

  // Your MVP table columns are: championship_id, stats_snapshot, stats_source
  // (The first column is truncated in pgAdmin list but it is almost certainly championship_id.)
  await client.query(
    `
    INSERT INTO championship_mvp_stats (championship_id, stats_snapshot, stats_source)
    VALUES ($1, $2::jsonb, $3)
    ON CONFLICT (championship_id)
    DO UPDATE SET
      stats_snapshot = EXCLUDED.stats_snapshot,
      stats_source = EXCLUDED.stats_source
    `,
    [championshipId, JSON.stringify(snapshot), source],
  );
}

async function importYear(client, year) {
  const files = yearFiles(year);

  const missing = [];
  if (!fileExists(files.yearDir))
    missing.push(`[missing folder] ${files.yearDir}`);
  if (!fileExists(files.final)) missing.push(path.basename(files.final));
  if (!fileExists(files.batting)) missing.push(path.basename(files.batting));
  if (!fileExists(files.pitching)) missing.push(path.basename(files.pitching));

  if (missing.length) {
    console.log(`⚠️  ${year}: missing -> ${missing.join(", ")}`);
    return { year, skipped: true };
  }

  const finalRows = readCsv(files.final);
  const batRows = readCsv(files.batting);
  const pitRows = readCsv(files.pitching);

  if (!finalRows.length) {
    console.log(`⚠️  ${year}: final CSV has 0 rows, skipping.`);
    return { year, skipped: true };
  }

  const f = finalRows[0];
  const championName =
    f.champion_team_name ||
    f.champion_team ||
    f.champion ||
    f.champion_name ||
    "";
  const runnerUpName =
    f.runner_up_team_name ||
    f.runner_up_team ||
    f.runner_up ||
    f.runner_up_name ||
    "";

  const scoreText =
    f.championship_score ||
    (f.champion_score && f.runner_up_score
      ? `${f.champion_score}-${f.runner_up_score}`
      : null);

  const mvpName = f.mvp_name || f.mvp || null;

  const championTeamId = await getOrCreateTeamId(client, championName);
  const runnerUpTeamId = await getOrCreateTeamId(client, runnerUpName);

  await updateChampionshipRow(
    client,
    year,
    championTeamId,
    runnerUpTeamId,
    scoreText,
  );

  let batUpserts = 0;
  let pitUpserts = 0;

  for (const row of batRows) {
    const teamName = row.team_name || row.team || "";
    const teamId = await getOrCreateTeamId(client, teamName);
    if (!teamId) continue;
    const ok = await upsertBatting(client, year, teamId, row);
    if (ok) batUpserts++;
  }

  for (const row of pitRows) {
    const teamName = row.team_name || row.team || "";
    const teamId = await getOrCreateTeamId(client, teamName);
    if (!teamId) continue;
    const ok = await upsertPitching(client, year, teamId, row);
    if (ok) pitUpserts++;
  }

  await upsertMvpSnapshot(client, year, mvpName, championTeamId);

  console.log(
    `✅ ${year}: batting upserts=${batUpserts}, pitching upserts=${pitUpserts}`,
  );
  return { year, skipped: false, batUpserts, pitUpserts };
}

// -----------------------------
// Main (transaction per year)
// -----------------------------
async function main() {
  console.log(
    `\n🚀 Importing Championship Finals from ${FROM_YEAR} to ${TO_YEAR}`,
  );
  console.log(`📁 Finals base folder: ${FINALS_BASE_DIR}\n`);

  const client = await pool.connect();
  const summary = {
    importedYears: 0,
    skippedYears: 0,
    battingUpserts: 0,
    pitchingUpserts: 0,
  };

  try {
    await ensureFinalTables(client);

    for (let y = FROM_YEAR; y <= TO_YEAR; y++) {
      try {
        await client.query("BEGIN");
        const result = await importYear(client, y);

        if (result.skipped) {
          await client.query("ROLLBACK");
          summary.skippedYears++;
        } else {
          await client.query("COMMIT");
          summary.importedYears++;
          summary.battingUpserts += result.batUpserts || 0;
          summary.pitchingUpserts += result.pitUpserts || 0;
        }
      } catch (e) {
        await client.query("ROLLBACK");
        console.error(`❌ ${y}: failed -> ${e.message}`);
        summary.skippedYears++;
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("🎉 RANGE IMPORT COMPLETE");
    console.log("=".repeat(60));
    console.log(`✅ Imported years: ${summary.importedYears}`);
    console.log(`⚠️  Skipped years: ${summary.skippedYears}`);
    console.log(`⚾ Batting upserts total: ${summary.battingUpserts}`);
    console.log(`🥎 Pitching upserts total: ${summary.pitchingUpserts}`);
    console.log("=".repeat(60) + "\n");
  } finally {
    client.release();
    await pool.end();
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("\n❌ Import failed:", err.message);
    process.exit(1);
  });
