// backend/scripts/import1946CsvStats.js
//
// Imports 1946 NBC World Series batting + pitching stats from CSV into PostgreSQL.
//
// CSV columns:
//   Batting:  Team, Record, Player, AB, R, H, 2B, 3B, HR, SB, SH, RBI, PO, A, E, Pct
//   Pitching: Team, Record, Pitcher, W, L, IP, R, H, BB, SO, WP, HB
//
// Usage:
//   1. Place CSVs at:  backend/data/1946_nbc_batting.csv
//                      backend/data/1946_nbc_pitching.csv
//   2. node backend/scripts/import1946CsvStats.js

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

const BATTING_CSV = path.join(__dirname, "../data/1946_nbc_batting.csv");
const PITCHING_CSV = path.join(__dirname, "../data/1946_nbc_pitching.csv");

// ── Options ───────────────────────────────────────────────────────────────
// Set to true to wipe all existing 1946 rows before importing.
const CLEAN_1946_FIRST = true;

// ── Parsers ───────────────────────────────────────────────────────────────

/** Integer: strips ".0", commas, whitespace. Returns 0 for missing/invalid. */
const toI = (v) => {
  if (v === undefined || v === null || v === "") return 0;
  const cleaned = String(v)
    .split(".")[0]
    .replace(/[^0-9-]/g, "");
  const n = parseInt(cleaned, 10);
  return isNaN(n) ? 0 : n;
};

/** Float: returns 0 for missing/invalid. */
const toF = (v) => {
  if (v === undefined || v === null || v === "") return 0;
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};

/**
 * Innings-pitched parser.
 * Handles:  "26 1-3"  →  26.333
 *           "9 2-3"   →  9.667
 *           "5 1-2"   →  5.5
 *           "13"      →  13
 *           "0"       →  0
 */
function parseIP(val) {
  const s = String(val ?? "").trim();
  if (!s || s === "-" || s === "0") return 0;

  if (s.includes(" ")) {
    const [whole, frac] = s.split(/\s+/);
    const w = parseFloat(whole) || 0;
    if (frac === "1-3" || frac === "1/3")
      return Math.round((w + 1 / 3) * 1000) / 1000;
    if (frac === "2-3" || frac === "2/3")
      return Math.round((w + 2 / 3) * 1000) / 1000;
    if (frac === "1-2" || frac === "1/2") return w + 0.5;
    return w;
  }

  return parseFloat(s) || 0;
}

// ── CSV reader ────────────────────────────────────────────────────────────

function readCsv(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌  Missing file: ${filePath}`);
    return [];
  }

  const content = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""); // strip BOM if present

  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);

  const headers = lines[0].split(",").map((h) => h.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const row = {};
    headers.forEach((h, i) => {
      row[h] = values[i] !== undefined ? values[i].trim() : "";
    });
    return row;
  });
}

// ── DB helpers ────────────────────────────────────────────────────────────

/**
 * Returns { tId, pId } for a team name + player name.
 * Creates team/player rows if they don't already exist.
 *
 * Player name splitting:
 *   "Decker"        →  first="",   last="Decker"
 *   "R. Bartkowski" →  first="R.", last="Bartkowski"
 */
async function getOrCreateIds(client, teamName, playerName) {
  // ── Team ──────────────────────────────────────────────────────────────
  let tRes = await client.query("SELECT id FROM teams WHERE name = $1", [
    teamName,
  ]);
  let tId = tRes.rows[0]?.id;
  if (!tId) {
    tRes = await client.query(
      "INSERT INTO teams (name) VALUES ($1) RETURNING id",
      [teamName],
    );
    tId = tRes.rows[0].id;
  }

  // ── Player ────────────────────────────────────────────────────────────
  const parts = playerName.trim().split(/\s+/);
  const firstName = parts.length > 1 ? parts[0] : "";
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : parts[0];

  let pRes = await client.query(
    "SELECT id FROM players WHERE first_name = $1 AND last_name = $2",
    [firstName, lastName],
  );
  let pId = pRes.rows[0]?.id;
  if (!pId) {
    pRes = await client.query(
      "INSERT INTO players (first_name, last_name) VALUES ($1, $2) RETURNING id",
      [firstName, lastName],
    );
    pId = pRes.rows[0].id;
  }

  return { tId, pId };
}

// ── Main ──────────────────────────────────────────────────────────────────

async function run() {
  const client = await pool.connect();

  try {
    const battingRows = readCsv(BATTING_CSV);
    const pitchingRows = readCsv(PITCHING_CSV);

    console.log(`📂  Batting rows loaded:  ${battingRows.length}`);
    console.log(`📂  Pitching rows loaded: ${pitchingRows.length}`);

    await client.query("BEGIN");

    // ── Optional clean ────────────────────────────────────────────────
    if (CLEAN_1946_FIRST) {
      console.log("🧹  Clearing existing 1946 rows…");
      await client.query("DELETE FROM batting_stats  WHERE year = 1946");
      await client.query("DELETE FROM pitching_stats WHERE year = 1946");
    }

    // ── Batting ───────────────────────────────────────────────────────
    console.log(`⚾   Importing ${battingRows.length} batting rows…`);

    let battingInserted = 0;
    let battingSkipped = 0;

    for (let i = 0; i < battingRows.length; i++) {
      const r = battingRows[i];

      if (!r.Player || !r.Team) {
        battingSkipped++;
        continue;
      }

      const { tId, pId } = await getOrCreateIds(client, r.Team, r.Player);

      // ── Counting stats ──────────────────────────────────────────────
      const ab = toI(r.AB);
      const run = toI(r.R);
      const h = toI(r.H);
      const d2 = toI(r["2B"]);
      const d3 = toI(r["3B"]);
      const hr = toI(r.HR);
      const sb = toI(r.SB);
      const sh = toI(r.SH);
      const rbi = toI(r.RBI);
      const po = toI(r.PO);
      const a = toI(r.A);
      const e = toI(r.E);

      // ── Derived ─────────────────────────────────────────────────────
      // TB  = H + 2B + (2 × 3B) + (3 × HR)
      const tb = h + d2 + 2 * d3 + 3 * hr;
      // avg already computed and stored in CSV as "Pct"
      const avg = toF(r.Pct);
      // slg recalculated from TB/AB for consistency
      const slg = ab > 0 ? Math.round((tb / ab) * 1000) / 1000 : 0;

      // Unique season key per player-team-year
      const seasonKey = `1946_${r.Team}_${r.Player}`
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "");

      // Sanity log for first row
      if (i === 0) {
        console.log(
          `   ✔ First batting row: ${r.Player} (${r.Team}) ` +
            `AB=${ab} H=${h} SB=${sb} SH=${sh} PO=${po} A=${a} E=${e} AVG=${avg}`,
        );
      }

      await client.query(
        `INSERT INTO batting_stats (
          player_id, team_id, year, season_key,
          ab, r,   h,   "2b", "3b", hr,
          sb, sh,  rbi, po,   a,    e,
          tb, avg, slg
        ) VALUES (
          $1,  $2,  1946, $3,
          $4,  $5,  $6,  $7,  $8,  $9,
          $10, $11, $12, $13, $14, $15,
          $16, $17, $18
        )`,
        [
          pId,
          tId,
          seasonKey,
          ab,
          run,
          h,
          d2,
          d3,
          hr,
          sb,
          sh,
          rbi,
          po,
          a,
          e,
          tb,
          avg,
          slg,
        ],
      );

      battingInserted++;
    }

    console.log(
      `   ✅  Batting — inserted: ${battingInserted}, skipped: ${battingSkipped}`,
    );

    // ── Pitching ──────────────────────────────────────────────────────
    console.log(`🥎   Importing ${pitchingRows.length} pitching rows…`);

    let pitchingInserted = 0;
    let pitchingSkipped = 0;

    for (let i = 0; i < pitchingRows.length; i++) {
      const r = pitchingRows[i];

      if (!r.Pitcher || !r.Team) {
        pitchingSkipped++;
        continue;
      }

      const { tId, pId } = await getOrCreateIds(client, r.Team, r.Pitcher);

      // ── Stats ────────────────────────────────────────────────────────
      const w = toI(r.W);
      const l = toI(r.L);
      const ip = parseIP(r.IP);
      const run = toI(r.R);
      const h = toI(r.H);
      const bb = toI(r.BB);
      const so = toI(r.SO);
      const wp = toI(r.WP);
      const hb = toI(r.HB);

      // b_avg = win percentage when decisions exist, otherwise null
      // Note: ERA cannot be computed for 1946 — no ER column in source data
      const bAvg = w + l > 0 ? Math.round((w / (w + l)) * 1000) / 1000 : null;

      const seasonKey = `1946_${r.Team}_${r.Pitcher}`
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "");

      if (i === 0) {
        console.log(
          `   ✔ First pitching row: ${r.Pitcher} (${r.Team}) ` +
            `W=${w} L=${l} IP=${ip} H=${h} R=${run} BB=${bb} SO=${so} WP=${wp} HB=${hb}`,
        );
      }

      await client.query(
        `INSERT INTO pitching_stats (
          player_id, team_id, year, season_key,
          w,  l,  ip,
          h,  r,  bb, so,
          wp, hbp,
          b_avg
        ) VALUES (
          $1,  $2,  1946, $3,
          $4,  $5,  $6,
          $7,  $8,  $9,  $10,
          $11, $12,
          $13
        )`,
        [pId, tId, seasonKey, w, l, ip, h, run, bb, so, wp, hb, bAvg],
      );

      pitchingInserted++;
    }

    console.log(
      `   ✅  Pitching — inserted: ${pitchingInserted}, skipped: ${pitchingSkipped}`,
    );

    // ── Commit ────────────────────────────────────────────────────────
    await client.query("COMMIT");
    console.log("\n🎉  1946 import complete!");
    console.log(`    Batting:  ${battingInserted} rows`);
    console.log(`    Pitching: ${pitchingInserted} rows`);
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
