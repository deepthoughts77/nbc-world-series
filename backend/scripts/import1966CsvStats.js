// backend/scripts/import1966CsvStats.js
import { pool } from "../src/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Put your CSV files here:
const BATTING_CSV = path.join(__dirname, "../data/1966_NBC_batting.csv");
const PITCHING_CSV = path.join(__dirname, "../data/1966_NBC_pitching.csv");

// If true, clears 1966 stats before importing (recommended while iterating)
const CLEAN_1966_FIRST = true;

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

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
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
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
  const out = [];

  for (let r = 1; r < rows.length; r++) {
    const cols = rows[r];
    if (!cols || cols.length === 0) continue;

    const obj = {};
    for (let c = 0; c < headers.length; c++) {
      const key = headers[c];
      if (!key) continue;
      obj[key] = (cols[c] ?? "").trim();
    }
    out.push(obj);
  }

  return out;
}

function toInt(v) {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
}

function toFloat(v) {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = Number.parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

function roundTo(n, decimals) {
  if (n === null || n === undefined) return null;
  if (!Number.isFinite(n)) return null;
  const p = 10 ** decimals;
  return Math.round(n * p) / p;
}

// "19.2" innings means 19 + 2/3
function parseInningsPitched(ipVal) {
  const s = String(ipVal ?? "").trim();
  if (!s) return null;

  const parts = s.split(".");
  const whole = Number.parseInt(parts[0], 10);
  if (!Number.isFinite(whole)) return null;

  if (parts.length === 1) return whole;

  const frac = Number.parseInt(parts[1], 10);
  if (frac === 0) return whole;
  if (frac === 1) return whole + 1 / 3;
  if (frac === 2) return whole + 2 / 3;

  // fallback for unexpected decimals
  const fallback = Number.parseFloat(s);
  return Number.isFinite(fallback) ? fallback : null;
}

function safeDiv(a, b) {
  if (a === null || b === null || b === 0) return null;
  return a / b;
}

// TB = H + 2B + 2*3B + 3*HR
function calcTB(h, d2, d3, hr) {
  if ([h, d2, d3, hr].some((x) => x === null)) return null;
  return h + d2 + 2 * d3 + 3 * hr;
}

function calcEra(er, ip) {
  if (er === null || ip === null || ip <= 0) return null;
  return (er * 9) / ip;
}

function makeSeasonKey(year, teamName, playerName) {
  return `${year}_${teamName}_${playerName}`
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

async function import1966() {
  const client = await pool.connect();

  try {
    if (!fs.existsSync(BATTING_CSV)) {
      throw new Error(`Batting CSV not found: ${BATTING_CSV}`);
    }
    if (!fs.existsSync(PITCHING_CSV)) {
      throw new Error(`Pitching CSV not found: ${PITCHING_CSV}`);
    }

    const battingRows = parseCsv(fs.readFileSync(BATTING_CSV, "utf8"));
    const pitchingRows = parseCsv(fs.readFileSync(PITCHING_CSV, "utf8"));

    console.log("🚀 Importing 1966 CSV stats...");
    console.log(`✅ Batting rows loaded:  ${battingRows.length}`);
    console.log(`✅ Pitching rows loaded: ${pitchingRows.length}`);

    await client.query("BEGIN");

    if (CLEAN_1966_FIRST) {
      console.log("🧹 Cleaning existing 1966 stats first...");
      await client.query("DELETE FROM batting_stats WHERE year = 1966");
      await client.query("DELETE FROM pitching_stats WHERE year = 1966");
    }

    let insertedBatting = 0;
    let insertedPitching = 0;

    // ---------------------------
    // Batting CSV columns:
    // Year, SourcePDF, Team, Player, Pos, G, AB, R, H, 2B, 3B, HR, SB, SH, RBI, PO, A, E, Pct
    // ---------------------------
    for (const row of battingRows) {
      const year = toInt(row.Year);
      const teamName = row.Team;
      const playerName = row.Player;

      if (!year || !teamName || !playerName) continue;

      const teamId = await getOrCreateTeamId(client, teamName);
      const playerId = await getOrCreatePlayerId(client, playerName);

      // If you didn't clean first, skip duplicates
      if (!CLEAN_1966_FIRST) {
        const exists = await client.query(
          "SELECT id FROM batting_stats WHERE player_id = $1 AND team_id = $2 AND year = $3",
          [playerId, teamId, year],
        );
        if (exists.rows.length > 0) continue;
      }

      const ab = toInt(row.AB);
      const h = toInt(row.H);
      const d2 = toInt(row["2B"]);
      const d3 = toInt(row["3B"]);
      const hr = toInt(row.HR);

      const tb = calcTB(h, d2, d3, hr);
      const avg = safeDiv(h, ab);
      const slg = safeDiv(tb, ab);

      // Round to match typical baseball precision
      const avg3 = avg == null ? null : roundTo(avg, 3);
      const slg3 = slg == null ? null : roundTo(slg, 3);
      const fld3 = row.Pct === "" ? null : roundTo(toFloat(row.Pct), 3);

      const seasonKey = makeSeasonKey(year, teamName, playerName);

      await client.query(
        `
        INSERT INTO batting_stats (
          player_id, team_id, year, season_key,
          jersey_num, position,
          gp, gs, ab, r, h, "2b", "3b", hr, rbi,
          tb, slg, bb, hbp, so, gdp, obp, sf, sh, sb, att, avg,
          po, a, e, fld
        ) VALUES (
          $1, $2, $3, $4,
          $5, $6,
          $7, $8, $9, $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27,
          $28, $29, $30, $31
        )
        `,
        [
          playerId,
          teamId,
          year,
          seasonKey,

          null, // jersey_num
          row.Pos || null, // position

          toInt(row.G), // gp
          null, // gs
          ab,
          toInt(row.R),
          h,
          d2,
          d3,
          hr,
          toInt(row.RBI),

          tb,
          slg3, // store rounded
          null, // bb
          null, // hbp
          null, // so
          null, // gdp
          null, // obp (not in 1966)
          null, // sf
          toInt(row.SH),
          toInt(row.SB),
          null, // att
          avg3, // store rounded

          toInt(row.PO),
          toInt(row.A),
          toInt(row.E),
          fld3, // fielding pct from CSV Pct
        ],
      );

      insertedBatting++;
    }

    // ---------------------------
    // Pitching CSV columns:
    // Year, SourcePDF, Team, Pitcher, G, W, L, IP, H, R, ER, BB, SO, WP, HB
    // ---------------------------
    for (const row of pitchingRows) {
      const year = toInt(row.Year);
      const teamName = row.Team;
      const playerName = row.Pitcher;

      if (!year || !teamName || !playerName) continue;

      const teamId = await getOrCreateTeamId(client, teamName);
      const playerId = await getOrCreatePlayerId(client, playerName);

      if (!CLEAN_1966_FIRST) {
        const exists = await client.query(
          "SELECT id FROM pitching_stats WHERE player_id = $1 AND team_id = $2 AND year = $3",
          [playerId, teamId, year],
        );
        if (exists.rows.length > 0) continue;
      }

      const ipRaw = parseInningsPitched(row.IP);
      const ip = ipRaw == null ? null : roundTo(ipRaw, 6); // keep accuracy
      const er = toInt(row.ER);
      const era = calcEra(er, ipRaw);
      const era2 = era == null ? null : roundTo(era, 2);

      const seasonKey = makeSeasonKey(year, teamName, playerName);

      await client.query(
        `
        INSERT INTO pitching_stats (
          player_id, team_id, year, season_key,
          jersey_num, era,
          w, l, app, gs, cg, sho, cbo, sv, ip,
          h, r, er, bb, so, "2b", "3b", hr, ab, b_avg,
          wp, hbp, bk, sfa, sha
        ) VALUES (
          $1, $2, $3, $4,
          $5, $6,
          $7, $8, $9, $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20, $21, $22, $23, $24, $25,
          $26, $27, $28, $29, $30
        )
        `,
        [
          playerId,
          teamId,
          year,
          seasonKey,

          null, // jersey_num
          era2, // rounded ERA

          toInt(row.W),
          toInt(row.L),
          toInt(row.G), // app
          null, // gs
          null, // cg
          null, // sho
          null, // cbo
          null, // sv
          ip, // stored as decimal innings

          toInt(row.H),
          toInt(row.R),
          er,
          toInt(row.BB),
          toInt(row.SO),
          null, // 2b
          null, // 3b
          null, // hr
          null, // ab
          null, // b_avg

          toInt(row.WP),
          toInt(row.HB), // hbp
          null, // bk
          null, // sfa
          null, // sha
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

import1966();
