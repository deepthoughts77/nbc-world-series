// backend/scripts/import1940CsvStats.js
import { pool } from "../src/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BATTING_CSV = path.join(__dirname, "../data/nbc_batting_final.csv");
const PITCHING_CSV = path.join(__dirname, "../data/nbc_pitching_final.csv");

const CLEAN_1940_FIRST = true;

function parseCsv(text) {
  const rows = [];
  let row = [],
    field = "",
    inQuotes = false;
  const pushField = () => {
    row.push(field);
    field = "";
  };
  const pushRow = () => {
    if (row.length === 1 && row[0] === "") return;
    rows.push(row);
    row = [];
  };
  const s = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      continue;
    }
    if (c === ",") {
      pushField();
      continue;
    }
    if (c === "\n") {
      pushField();
      pushRow();
      continue;
    }
    field += c;
  }
  pushField();
  pushRow();
  if (rows.length === 0) return [];
  const headers = rows[0].map((h) => (h || "").trim());
  return rows
    .slice(1)
    .filter((cols) => cols && cols.length > 0)
    .map((cols) => {
      const obj = {};
      headers.forEach((k, i) => {
        if (k) obj[k] = (cols[i] ?? "").trim();
      });
      return obj;
    });
}

function toInt(v) {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = parseInt(s, 10);
  return isFinite(n) ? n : null;
}
function toFloat(v) {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = parseFloat(s);
  return isFinite(n) ? n : null;
}
function roundTo(n, d) {
  if (n == null || !isFinite(n)) return null;
  return Math.round(n * 10 ** d) / 10 ** d;
}
function safeDiv(a, b) {
  if (a == null || b == null || b === 0) return null;
  return a / b;
}
function calcTB(h, d2, d3, hr) {
  if ([h, d2, d3, hr].some((x) => x === null)) return null;
  return h + d2 + 2 * d3 + 3 * hr;
}
function makeSeasonKey(year, team, player) {
  return `${year}_${team}_${player}`
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

function splitName(full) {
  const cleaned = (full || "").trim();
  if (!cleaned) return { firstName: "", lastName: "" };
  const parts = cleaned.split(/\s+/);
  if (parts.length === 1) return { firstName: "", lastName: parts[0] };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

async function getOrCreateTeamId(client, teamName) {
  const name = (teamName || "").trim();
  if (!name) throw new Error("Missing Team in CSV row.");
  const found = await client.query("SELECT id FROM teams WHERE name = $1", [
    name,
  ]);
  if (found.rows.length > 0) return found.rows[0].id;
  const created = await client.query(
    "INSERT INTO teams (name, city, state) VALUES ($1, $2, $3) RETURNING id",
    [name, null, null],
  );
  return created.rows[0].id;
}

async function getOrCreatePlayerId(client, playerName) {
  const { firstName, lastName } = splitName(playerName);
  const found = await client.query(
    "SELECT id FROM players WHERE first_name = $1 AND last_name = $2",
    [firstName, lastName],
  );
  if (found.rows.length > 0) return found.rows[0].id;
  const created = await client.query(
    "INSERT INTO players (first_name, last_name) VALUES ($1, $2) RETURNING id",
    [firstName, lastName],
  );
  return created.rows[0].id;
}

async function import1940() {
  const client = await pool.connect();
  try {
    if (!fs.existsSync(BATTING_CSV))
      throw new Error(`Batting CSV not found: ${BATTING_CSV}`);
    if (!fs.existsSync(PITCHING_CSV))
      throw new Error(`Pitching CSV not found: ${PITCHING_CSV}`);

    const allBatting = parseCsv(fs.readFileSync(BATTING_CSV, "utf8"));
    const allPitching = parseCsv(fs.readFileSync(PITCHING_CSV, "utf8"));

    // Filter to 1940 only, drop blank separator rows
    const battingRows = allBatting.filter(
      (r) => r.Year === "1940" && r.Team && r.Player,
    );
    const pitchingRows = allPitching.filter(
      (r) => r.Year === "1940" && r.Team && r.Pitcher,
    );

    console.log("🚀 Importing 1940 CSV stats...");
    console.log(`✅ Batting rows loaded:  ${battingRows.length}`);
    console.log(`✅ Pitching rows loaded: ${pitchingRows.length}`);

    await client.query("BEGIN");

    if (CLEAN_1940_FIRST) {
      console.log("🧹 Cleaning existing 1940 stats first...");
      await client.query("DELETE FROM batting_stats  WHERE year = 1940");
      await client.query("DELETE FROM pitching_stats WHERE year = 1940");
    }

    let insertedBatting = 0;
    let insertedPitching = 0;

    // ── BATTING ────────────────────────────────────────────────────────────
    // CSV: Year, SourcePDF, Team, Player, Pos, G, AB, R, H,
    //      2B, 3B, HR, SB, SH, RBI, PO, A, E, Pct
    //
    // 1940: Pct = batting average. R, 2B, 3B, HR, SB, SH, RBI, PO, A, E all blank.

    for (const row of battingRows) {
      const teamId = await getOrCreateTeamId(client, row.Team);
      const playerId = await getOrCreatePlayerId(client, row.Player);

      if (!CLEAN_1940_FIRST) {
        const exists = await client.query(
          "SELECT id FROM batting_stats WHERE player_id = $1 AND team_id = $2 AND year = 1940",
          [playerId, teamId],
        );
        if (exists.rows.length > 0) continue;
      }

      const ab = toInt(row.AB);
      const h = toInt(row.H);
      const d2 = toInt(row["2B"]); // null for 1940
      const d3 = toInt(row["3B"]); // null for 1940
      const hr = toInt(row.HR); // null for 1940
      const tb = calcTB(h, d2, d3, hr); // null for 1940
      const slg3 = roundTo(safeDiv(tb, ab), 3); // null for 1940
      const avg3 = roundTo(toFloat(row.Pct), 3); // Pct IS batting avg in 1940

      await client.query(
        `INSERT INTO batting_stats (
          player_id, team_id, year, season_key,
          jersey_num, position,
          gp, gs, ab, r, h, "2b", "3b", hr, rbi,
          tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, avg,
          po, a, e, fld
        ) VALUES (
          $1,$2,$3,$4,$5,$6,
          $7,$8,$9,$10,$11,$12,$13,$14,$15,
          $16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,
          $28,$29,$30,$31
        )`,
        [
          playerId,
          teamId,
          1940,
          makeSeasonKey(1940, row.Team, row.Player),
          null,
          row.Pos || null,
          toInt(row.G),
          null,
          ab,
          toInt(row.R),
          h,
          d2,
          d3,
          hr,
          toInt(row.RBI),
          tb,
          slg3,
          null,
          null,
          null,
          null,
          null,
          null,
          toInt(row.SH),
          toInt(row.SB),
          null,
          avg3,
          toInt(row.PO),
          toInt(row.A),
          toInt(row.E),
          null, // fld — not tracked in 1940
        ],
      );
      insertedBatting++;
    }

    // ── PITCHING ────────────────────────────────────────────────────────────
    // CSV: Year, SourcePDF, Team, Pitcher, G, W, L, IP, H, R, ER, BB, SO, WP, HB, Pct
    //
    // 1940: IP, H, R, ER, WP, HB all blank → null, ERA = null
    //       Pct = win percentage (W / (W+L)) — stored in win_pct if column exists,
    //             otherwise stored as a comment (check your schema)

    for (const row of pitchingRows) {
      const teamId = await getOrCreateTeamId(client, row.Team);
      const playerId = await getOrCreatePlayerId(client, row.Pitcher);

      if (!CLEAN_1940_FIRST) {
        const exists = await client.query(
          "SELECT id FROM pitching_stats WHERE player_id = $1 AND team_id = $2 AND year = 1940",
          [playerId, teamId],
        );
        if (exists.rows.length > 0) continue;
      }

      const winPct = roundTo(toFloat(row.Pct), 3); // win % from PDF

      await client.query(
        `INSERT INTO pitching_stats (
          player_id, team_id, year, season_key,
          jersey_num, era,
          w, l, app, gs, cg, sho, cbo, sv, ip,
          h, r, er, bb, so, "2b", "3b", hr, ab, b_avg,
          wp, hbp, bk, sfa, sha
        ) VALUES (
          $1,$2,$3,$4,$5,$6,
          $7,$8,$9,$10,$11,$12,$13,$14,$15,
          $16,$17,$18,$19,$20,$21,$22,$23,$24,$25,
          $26,$27,$28,$29,$30
        )`,
        [
          playerId,
          teamId,
          1940,
          makeSeasonKey(1940, row.Team, row.Pitcher),
          null,
          null, // era — cannot calculate without IP/ER

          toInt(row.W),
          toInt(row.L),
          toInt(row.G), // app
          null,
          null,
          null,
          null,
          null, // gs, cg, sho, cbo, sv
          null, // ip — not in 1940 PDF

          null, // h
          null, // r
          null, // er
          toInt(row.BB),
          toInt(row.SO),
          null,
          null,
          null,
          null,
          winPct, // b_avg repurposed to store win_pct for 1940
          // (or swap to a win_pct column if you add one)

          null,
          null,
          null,
          null,
          null, // wp, hbp, bk, sfa, sha
        ],
      );
      insertedPitching++;
    }

    await client.query("COMMIT");
    console.log("🎉 Done.");
    console.log(`⚾ Batting inserted:  ${insertedBatting}`);
    console.log(`🥎 Pitching inserted: ${insertedPitching}`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Import failed:", err.message);
    console.error(err.stack);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

import1940();
