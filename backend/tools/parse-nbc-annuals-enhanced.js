// backend/scripts/parse-nbc-annuals-enhanced.js
// Run: node scripts/parse-nbc-annuals-enhanced.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ---- Loader for pdf-parse handling multiple export shapes (incl. PDFParse) ----
async function loadPdfParse() {
  const { createRequire } = await import("module");
  const require = createRequire(import.meta.url);

  let mod = require("pdf-parse");
  let fn =
    (typeof mod === "function" && mod) ||
    (typeof mod?.default === "function" && mod.default) ||
    (typeof mod?.pdfParse === "function" && mod.pdfParse) ||
    (typeof mod?.PDFParse === "function" && mod.PDFParse) ||
    (typeof mod?.parse === "function" && mod.parse);

  if (!fn) {
    try {
      mod = require("pdf-parse/lib/pdf-parse.js");
      fn =
        (typeof mod === "function" && mod) ||
        (typeof mod?.default === "function" && mod.default) ||
        (typeof mod?.PDFParse === "function" && mod.PDFParse);
    } catch {}
  }

  if (typeof fn !== "function") {
    const keys = mod && typeof mod === "object" ? Object.keys(mod) : [];
    throw new Error(
      `pdf-parse export is not a function. Got keys: [${keys.join(", ")}]`
    );
  }
  return fn;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------- Text Preprocessing --------------------
function preprocess(text) {
  let t = text || "";
  t = t.replace(/\r/g, "");
  // Join hyphenated and split words
  t = t.replace(/([A-Za-z])-\n([A-Za-z])/g, "$1$2");
  t = t.replace(/\b([A-Za-z])\s*\n\s*([A-Za-z])\b/g, "$1 $2");
  // Normalize punctuation
  t = t
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[’]/g, "'");
  // Collapse whitespace
  t = t
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ");
  // Artefacts
  t = t.replace(/\bChampion\s+ship\b/gi, "Championship");
  return t;
}

// ---- “Championship windows” ----
const CHAMP_KEYWORDS = [
  "nbc world series",
  "championship",
  "title game",
  "finals",
  "final game",
  "gold bracket",
  "champion",
];

function championshipWindows(text, span = 1800) {
  const lower = text.toLowerCase();
  const hits = [];
  for (const kw of CHAMP_KEYWORDS) {
    let i = 0,
      k = kw.toLowerCase();
    while ((i = lower.indexOf(k, i)) !== -1) {
      hits.push(i);
      i += k.length;
    }
  }
  if (!hits.length) return [];

  const windows = hits.map((i) =>
    text.slice(Math.max(0, i - span), Math.min(text.length, i + span))
  );
  const seen = new Set();
  const out = [];
  for (const w of windows) {
    const key = (w.slice(0, 120) + "|" + w.slice(-120)).toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(w);
    }
  }
  return out;
}

// -------------------- Team Knowledge + Utilities --------------------
const TEAM_LEXICON = [
  "Seattle Studs",
  "Santa Barbara Foresters",
  "Hutchinson Monarchs",
  "Hays Larks",
  "Anchorage Glacier Pilots",
  "Anchorage Bucs",
  "Liberal Bee Jays",
  "El Dorado Broncos",
  "Boulder Collegians",
  "Fairbanks Goldpanners",
  "Mat-Su Miners",
  "Kenai Peninsula Oilers",
  "Kenai Oilers",
  "Nevada Griffons",
  "Wichita Independents",
  "Riverside Nursery",
  "Glendale Grays",
  "Honolulu Red Sox",
  "Sinton Oilers",
];

const CITY_TO_TEAM = {
  seattle: "Seattle Studs",
  "santa barbara": "Santa Barbara Foresters",
  hutchinson: "Hutchinson Monarchs",
  hays: "Hays Larks",
  anchorage: "Anchorage Glacier Pilots", // Bucs will still be picked via nickname
  liberal: "Liberal Bee Jays",
  "el dorado": "El Dorado Broncos",
  boulder: "Boulder Collegians",
  fairbanks: "Fairbanks Goldpanners",
  "mat-su": "Mat-Su Miners",
  kenai: "Kenai Peninsula Oilers",
  wichita: "Wichita Independents",
  riverside: "Riverside Nursery",
  glendale: "Glendale Grays",
  honolulu: "Honolulu Red Sox",
  sinton: "Sinton Oilers",
};

const TEAM_NICKNAMES = [
  "Studs",
  "Foresters",
  "Monarchs",
  "Larks",
  "Glacier Pilots",
  "Pilots",
  "Bucs",
  "Bee Jays",
  "Broncos",
  "Collegians",
  "Goldpanners",
  "Miners",
  "Oilers",
  "Griffons",
  "Independents",
  "Grays",
  "Red Sox",
  "Pioneers",
  "Copper Sox",
];

const BAD_LEADS =
  /^(on|at|by|from|in|of|after|before|during|since|as|because|when|while|between)\b/i;
const MONTHS =
  /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/i;
const NEWSROOM =
  /\b(writer|edition|photo|press|staff|editor|byline|advertisement|eagle sports writer)\b/i;

function norm(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}
const LEXICON_NORM = TEAM_LEXICON.map((t) => ({ raw: t, key: norm(t) }));
const NICK_KEYS = TEAM_NICKNAMES.map((n) => norm(n));
const CITY_KEYS = Object.keys(CITY_TO_TEAM);

function bestLexiconHit(span) {
  const k = norm(span);
  let best = null;
  for (const item of LEXICON_NORM) {
    if (k.includes(item.key)) {
      const len = item.key.length;
      if (!best || len > best.len) best = { label: item.raw, len };
    }
  }
  return best?.label || null;
}
function containsNickname(span) {
  const k = norm(span);
  return NICK_KEYS.some((nick) => k.includes(nick));
}
function mapCityToTeam(span) {
  const k = norm(span);
  for (const city in CITY_TO_TEAM) {
    if (k.includes(city)) return CITY_TO_TEAM[city];
  }
  return null;
}
function isLikelyPersonSingleWord(word) {
  return /^[A-Z][a-z]+$/.test(word || "");
}
function capitalizedPhrases(s, limit = 7) {
  const rx = /\b([A-Z][A-Za-z'.&-]*(?:\s+[A-Z][A-Za-z'.&-]*){0,10})\b/g;
  const out = [];
  let m;
  while ((m = rx.exec(s))) {
    const phrase = m[1].replace(/\s+/g, " ").trim();
    const words = phrase.split(/\s+/).length;
    if (words >= 1 && words <= limit) out.push(phrase);
  }
  return out;
}
function cleanTeam(s) {
  if (!s) return null;
  s = s.replace(/\s*\([^)]*\)\s*$/, ""); // trailing parens
  s = s.replace(/\s*[,.;:–-].*$/, ""); // trailing clause
  s = s.replace(/\s+/g, " ").trim();
  if (s.length < 3) return null;
  return s;
}
function looksLikeTeam(name) {
  if (!name) return false;
  if (BAD_LEADS.test(name) || MONTHS.test(name) || NEWSROOM.test(name))
    return false;
  const words = name.split(" ").length;
  if (bestLexiconHit(name)) return true;
  if (containsNickname(name)) return true;
  if (mapCityToTeam(name)) return true;
  if (words >= 2) return true;
  return false;
}

// Normalize / map to canonical team labels
function normalizeTeamName(name) {
  if (!name) return null;
  let n = cleanTeam(name);
  if (!n) return null;

  // City → canonical team (preferred)
  const mappedByCity = mapCityToTeam(n);
  if (mappedByCity) n = mappedByCity;

  // Handle common oddities
  if (/sinton/i.test(n) && /oiler/i.test(n)) n = "Sinton Oilers";
  if (/kenai/i.test(n) && /oiler/i.test(n)) n = "Kenai Peninsula Oilers";
  if (/anchorage/i.test(n) && /pilot/i.test(n)) n = "Anchorage Glacier Pilots";
  if (/anchorage/i.test(n) && /\bbucs?\b/i.test(n)) n = "Anchorage Bucs";
  if (/seattle/i.test(n) && !/studs/i.test(n)) n = "Seattle Studs";
  if (/santa barbara/i.test(n) && !/foresters/i.test(n))
    n = "Santa Barbara Foresters";
  if (/hays/i.test(n) && !/larks/i.test(n)) n = "Hays Larks";

  // Final lexicon snap if we partially match
  const hit = bestLexiconHit(n);
  if (hit) n = hit;

  // Reject newsroom or bad-lead leftovers
  if (!looksLikeTeam(n)) return null;

  return n;
}

// Prefer city/nickname mapping before raw text
function finalizeTeam(span) {
  if (!span) return null;
  const mapped = mapCityToTeam(span);
  if (mapped) return normalizeTeamName(mapped);

  const hit = bestLexiconHit(span);
  if (hit) return normalizeTeamName(hit);

  // Score capitalized phrases
  const candidates = capitalizedPhrases(span, 7).filter(
    (p) =>
      !/^(Game|Final|Championship|Title|Saturday|Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Ship|Team|College|League|Series|Playoffs?|The)$/i.test(
        p
      )
  );

  // Prefer candidates that include nicknames or city names we know
  const scored = candidates.map((c) => {
    const words = c.split(/\s+/).length;
    const hasNick = containsNickname(c);
    const cityMap = !!mapCityToTeam(c);
    const penaltySingle = isLikelyPersonSingleWord(c) ? 2 : 0;
    const score =
      (hasNick ? 3 : 0) +
      (cityMap ? 3 : 0) +
      (words >= 2 ? 2 : 0) +
      Math.min(2, Math.floor(c.length / 10)) -
      penaltySingle;
    return { c, score };
  });

  scored.sort((a, b) => b.score - a.score || b.c.length - a.c.length);
  const best = scored[0]?.c;
  return normalizeTeamName(best || null);
}

// -------------------- Finals Extractors --------------------
const VERBS = [
  "defeated",
  "beat",
  "edged",
  "topped",
  "downed",
  "overcame",
  "outlasted",
  "knocked off",
  "surpassed",
  "nipped",
  "shut out",
  "blanked",
  "ousted",
  "upended",
  "clipped",
];
const FINAL_KEYWORDS = [
  "final",
  "finals",
  "championship",
  "title",
  "tournament",
  "gold",
  "decider",
  "title game",
  "championship game",
  "world series",
];

// Reject scores that look like season records or junk
function plausibleScore(a, b, sentence) {
  const A = Number(a),
    B = Number(b);
  if (!Number.isFinite(A) || !Number.isFinite(B)) return false;
  if (A < 0 || B < 0 || A > 25 || B > 25) return false;
  if (A >= 20 && B >= 20) return false;
  const near = (sentence || "").toLowerCase();
  if (
    /\b(record|season|mark|since|won[-\s]?lost|overall|finish|streak)\b/.test(
      near
    )
  )
    return false;
  return true;
}

function splitSentences(text) {
  return text
    .split(/(?<=[\.\?!])\s+(?=[A-Z(])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Trim clauses like ", which had ..." or " that ...", " from / of ..."
function trimAfterRelativeClauses(s) {
  const idx = s.search(
    /\s*(,|\bwhich\b|\bthat\b|\bwho\b|\bwith\b|\bfrom\b|\bof\b|\()\b/i
  );
  if (idx > 0) return s.slice(0, idx).trim();
  return s.trim();
}

// A) Sentence-style finals: “X defeated Y 6-2 …”
function extractFromFinalsSentence(text) {
  const sentences = splitSentences(text);
  const scoreRe = /\b(\d{1,2})\s*[-–]\s*(\d{1,2})\b/g;
  const verbRe = new RegExp(`\\b(${VERBS.join("|")})\\b`, "i");
  const finalsHint = new RegExp(`\\b(${FINAL_KEYWORDS.join("|")})\\b`, "i");

  let best = null;

  for (const s of sentences) {
    if (/room rates|mileage|sponsored|coupon|discount|hotel/i.test(s)) continue;
    if (NEWSROOM.test(s)) continue;

    const verb = s.match(verbRe);
    if (!verb) continue;

    let m;
    const scores = [];
    while ((m = scoreRe.exec(s))) {
      if (plausibleScore(m[1], m[2], s))
        scores.push({ all: m[0], a: m[1], b: m[2], index: m.index });
    }
    if (!scores.length) continue;

    let rank = 1;
    if (finalsHint.test(s)) rank += 3;
    if (scores.length === 1) rank += 1;
    rank += Math.max(0, 3 - Math.min(3, Math.floor(s.length / 160)));

    if (!best || rank > best.rank)
      best = { s, verb: verb[0], score: scores[0], rank };
  }

  if (!best) return null;

  const s = best.s;
  const verbIdx = s.toLowerCase().indexOf(best.verb.toLowerCase());
  const scoreIdx = best.score.index;
  if (verbIdx === -1 || scoreIdx === -1 || scoreIdx < verbIdx) return null;

  const subj = trimAfterRelativeClauses(s.slice(0, verbIdx).trim());
  const obj = trimAfterRelativeClauses(
    s.slice(verbIdx + best.verb.length, scoreIdx).trim()
  );

  let champion = finalizeTeam(subj);
  let runnerUp = finalizeTeam(obj);
  const score = `${best.score.a}-${best.score.b}`;

  if (!champion && runnerUp) return { champion: null, runnerUp, score };
  if (champion && runnerUp && norm(champion) === norm(runnerUp))
    runnerUp = null;

  return champion || runnerUp ? { champion, runnerUp, score } : null;
}

// B) Box/scoreline-style finals: “Team A 6, Team B 2”
function extractFromScoreline(text) {
  const rx =
    /([A-Z][A-Za-z&.'\-\s]{2,40})\s+(\d{1,2})\s*[,]\s*([A-Z][A-Za-z&.'\-\s]{2,40})\s+(\d{1,2})/g;
  let m,
    best = null;
  while ((m = rx.exec(text))) {
    const aTeamRaw = cleanTeam(m[1]);
    const bTeamRaw = cleanTeam(m[3]);
    const a = Number(m[2]),
      b = Number(m[4]);
    if (!plausibleScore(a, b, text)) continue;

    const aTeam = finalizeTeam(aTeamRaw);
    const bTeam = finalizeTeam(bTeamRaw);
    if (!aTeam || !bTeam) continue;

    const champion = a > b ? aTeam : bTeam;
    const runnerUp = a > b ? bTeam : aTeam;
    const score = `${Math.max(a, b)}-${Math.min(a, b)}`;

    const local = text
      .slice(Math.max(0, m.index - 80), m.index + m[0].length + 80)
      .toLowerCase();
    let rank = 1 + (CHAMP_KEYWORDS.some((k) => local.includes(k)) ? 2 : 0);
    if (!best || rank > best.rank) best = { champion, runnerUp, score, rank };
  }
  return best;
}

// ============================================================

async function parseNBCAnnuals() {
  const pdfParse = await loadPdfParse();

  console.log("\n PARSING NBC WORLD SERIES ANNUALS (Enhanced)\n");
  console.log("═".repeat(70));

  try {
    const pdfFolder = path.join(__dirname, "../data/pdfs");

    if (!fs.existsSync(pdfFolder)) {
      fs.mkdirSync(pdfFolder, { recursive: true });
      console.log(" Created pdfs folder at backend/data/pdfs/");
      console.log(
        "\n  Please place your NBC annual PDFs in backend/data/pdfs/\n"
      );
      return;
    }

    const pdfFiles = fs
      .readdirSync(pdfFolder)
      .filter((f) => f.toLowerCase().endsWith(".pdf"))
      .sort((a, b) => {
        const yearA = parseInt(a.match(/\d{4}/)?.[0] || "0", 10);
        const yearB = parseInt(b.match(/\d{4}/)?.[0] || "0", 10);
        return yearB - yearA;
      });

    if (pdfFiles.length === 0) {
      console.log("  No PDF files found in backend/data/pdfs/\n");
      return;
    }

    const filesToProcess = pdfFiles.filter((f) => !/2024/.test(f));

    console.log(` Found ${filesToProcess.length} PDF files to process:\n`);
    filesToProcess.forEach((f) => console.log(`   • ${f}`));
    console.log();

    const allData = [];

    for (const pdfFile of filesToProcess) {
      const yearMatch = pdfFile.match(/\d{4}/);
      if (!yearMatch) {
        console.log(`⏭  Skipping ${pdfFile} (no year found)`);
        continue;
      }

      const year = parseInt(yearMatch[0], 10);
      console.log(`\n Processing ${year} Annual...`);
      console.log("─".repeat(70));

      const pdfPath = path.join(pdfFolder, pdfFile);

      try {
        const buf = fs.readFileSync(pdfPath);
        const { text: rawText = "" } = await pdfParse(buf);
        const text = preprocess(rawText);

        // “Championship windows”
        const windows = championshipWindows(text);
        const scopes = windows.length ? windows : [text];

        // Try sentence finals first
        let finals = null;
        for (const w of scopes) {
          finals = extractFromFinalsSentence(w);
          if (finals?.champion || finals?.runnerUp) break;
        }
        // Try scoreline finals
        if (!finals) {
          for (const w of scopes) {
            const sline = extractFromScoreline(w);
            if (sline) {
              finals = sline;
              break;
            }
          }
        }

        const extractedData = {
          year,
          filename: pdfFile,
          champion: finals?.champion || extractChampion(text),
          runnerUp: finals?.runnerUp || extractRunnerUp(text),
          championshipScore: finals?.score || extractChampionshipScore(text),
          mvp: extractMVP(text),
          battingLeaders: extractBattingLeaders(text, year),
          pitchingLeaders: extractPitchingLeaders(text, year),
          finalStandings: extractFinalStandings(text, year),
          textLength: text.length,
        };

        // Final sanity
        if (extractedData.champion && extractedData.runnerUp) {
          if (norm(extractedData.champion) === norm(extractedData.runnerUp)) {
            extractedData.runnerUp = null;
          }
        }
        if (extractedData.championshipScore) {
          const [sa, sb] = extractedData.championshipScore
            .split("-")
            .map(Number);
          if (!plausibleScore(sa, sb, ""))
            extractedData.championshipScore = null;
        }
        // Drop person-like or newsroom-y teams
        for (const field of ["champion", "runnerUp"]) {
          const val = extractedData[field];
          if (
            val &&
            ((val.split(" ").length === 1 && isLikelyPersonSingleWord(val)) ||
              BAD_LEADS.test(val) ||
              MONTHS.test(val) ||
              NEWSROOM.test(val))
          ) {
            extractedData[field] = null;
          }
        }

        allData.push(extractedData);

        console.log(` Champion: ${extractedData.champion || "Not found"}`);
        console.log(` Runner-up: ${extractedData.runnerUp || "Not found"}`);
        console.log(
          ` Score: ${extractedData.championshipScore || "Not found"}`
        );
        console.log(` MVP: ${extractedData.mvp || "Not found"}`);
        console.log(` Batting leaders: ${extractedData.battingLeaders.length}`);
        console.log(
          ` Pitching leaders: ${extractedData.pitchingLeaders.length}`
        );
        console.log(` Text extracted: ${text.length} characters`);
      } catch (err) {
        console.error(` Error parsing ${pdfFile}:`, err?.message || err);
      }
    }

    const outputPath = path.join(__dirname, "../data/extracted-annuals.json");
    fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));
    console.log(`\n Saved to: ${outputPath}`);

    console.log("\n" + "═".repeat(70));
    console.log(" EXTRACTION SUMMARY:");
    console.log(`   PDFs processed: ${allData.length}`);
    if (allData.length > 0) {
      const years = allData.map((d) => d.year);
      console.log(
        `   Years covered: ${Math.min(...years)}-${Math.max(...years)}`
      );
    }
    console.log("\n Extraction completed!\n");
    console.log(" Next: Review extracted-annuals.json, then run:");
    console.log("   node scripts/import-extracted-annuals.js\n");
  } catch (error) {
    console.error(" Fatal error:", error);
    process.exit(1);
  }
}

// =================== Fallback Extraction helpers ===================

function extractChampion(text) {
  const patterns = [
    /(?:^|\n)\s*\bCHAMPION(?!SHIP)S?\b[:\s]*([A-Z][^\n]+?)(?:\n|$)/i,
    /(?:^|\n)\s*\bCHAMPIONS?\b\s*\n\s*([A-Z][^\n]+?)(?:\n|$)/i,
    /(Santa Barbara.*Foresters|El Dorado.*Broncos|Liberal.*Bee Jays|Seattle.*Studs|Hays.*Larks|Anchorage.*(?:Glacier Pilots|Bucs)|Hutchinson.*Monarchs|Kenai.*(?:Oilers|Peninsula)|Mat-Su.*Miners|Nevada.*Griffons|Fairbanks.*Goldpanners|Boulder.*Collegians|Riverside.*Nursery|Glendale.*Grays|Honolulu.*Red Sox|Sinton.*Oilers)/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) {
      const raw = (m[1] || m[0]).replace(/\s+/g, " ").trim();
      const v = finalizeTeam(raw);
      if (v) return v;
    }
  }
  return null;
}

function extractRunnerUp(text) {
  const patterns = [
    /(?:^|\n)\s*\bRUNNER[-\s]?UP\b[:\s]*([A-Z][^\n]+?)(?:\n|$)/i,
    /(?:^|\n)\s*\b2ND\s+PLACE\b[:\s]*([A-Z][^\n]+?)(?:\n|$)/i,
    /(?:defeated|beat|edged|topped|downed|ousted|upended|clipped)\s+([A-Z][A-Za-z'().\s-]+?)\s+\d{1,2}\s*[-–]\s*\d{1,2}(?:\s|,|\.|\n)/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (!m) continue;
    const trimmed = trimAfterRelativeClauses(m[1]).replace(/\s+/g, " ").trim();
    const v = finalizeTeam(trimmed);
    if (v) return v;
  }
  return null;
}

function extractChampionshipScore(text) {
  const patterns = [
    /(?:^|\n).{0,120}?\b(?:nbc world series|championship|final(?:s)?|title|world series)\b.{0,80}?(\d{1,2})\s*[-–]\s*(\d{1,2})(?:\b|[^0-9])/i,
    /(?:defeated|beat|edged|topped|downed|shut out|blanked|ousted|upended|clipped).{0,60}?(\d{1,2})\s*[-–]\s*(\d{1,2})(?:\b|[^0-9])/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m && plausibleScore(m[1], m[2], text)) return `${m[1]}-${m[2]}`;
  }
  const sline = extractFromScoreline(text);
  if (sline) return sline.score;
  return null;
}

function trimNameTail(name) {
  if (!name) return null;
  let tokens = name.split(/\s+/);
  const stops = new Set(
    TEAM_NICKNAMES.map((n) => n.toLowerCase())
      .concat(CITY_KEYS)
      .concat(["of", "from"])
  );
  // Drop trailing "(" or comma fragments
  tokens = tokens.filter((t) => t !== "," && t !== "(");

  while (
    tokens.length > 2 &&
    stops.has(tokens[tokens.length - 1].toLowerCase())
  ) {
    tokens.pop();
  }
  return tokens.join(" ");
}

function extractMVP(text) {
  const patterns = [
    /(?:^|\n)\s*(?:TOURNAMENT\s+)?\bMVP\b[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})(?:[^\S\n].*?)?(?:\n|$)/i,
    /(?:^|\n)\s*Most\s+Valuable\s+Player[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})(?:[^\S\n].*?)?(?:\n|$)/i,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) {
      let name = m[1].replace(/\s+/g, " ").trim();
      name = trimNameTail(name);
      if (/^(in|the|runnerup|no|each|national)$/i.test(name)) continue;
      if (name.split(" ").length >= 2) return name;
    }
  }
  const near = text.match(/(?:^|\n)\s*\bMVP\b[:\s]+(.{1,140})/i);
  if (near) {
    const mm = near[1].match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\b/);
    if (mm) {
      let name = trimNameTail(mm[1]);
      if (name && !/^(in|the|runnerup|no|each|national)$/i.test(name))
        return name;
    }
  }
  return null;
}

function extractBattingLeaders(text, year) {
  const leaders = [];
  const section = text.match(
    /(?:BATTING\s+LEADERS|HITS\s+TEAM\s+TOTAL)[\s\S]{0,1400}/i
  );
  if (!section) return leaders;

  const lines = section[0]
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 40);
  for (const line of lines) {
    const m = line.match(
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\s+([A-Z][A-Za-z&.\s'-]{2,}?)\s+(\d{1,3})$/
    );
    if (m) {
      leaders.push({
        category: "hits",
        player: m[1].trim(),
        team: m[2].replace(/\s+/g, " ").trim(),
        value: parseInt(m[3], 10),
        year,
      });
    }
  }
  return leaders;
}

function extractPitchingLeaders(text, year) {
  const leaders = [];
  const section = text.match(
    /(?:PITCHING\s+LEADERS|STRIKEOUTS|SO\/IP)[\s\S]{0,1400}/i
  );
  if (!section) return leaders;

  const lines = section[0]
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 40);
  for (const line of lines) {
    const m = line.match(
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\s+([A-Z][A-Za-z&.\s'-]{2,}?)\s+(\d{1,3})\s*\/\s*(\d+(?:\.\d+)?)/
    );
    if (m) {
      leaders.push({
        category: "strikeouts",
        player: m[1].trim(),
        team: m[2].replace(/\s+/g, " ").trim(),
        value: parseInt(m[3], 10),
        innings: parseFloat(m[4]),
        year,
      });
    }
  }
  return leaders;
}

function extractFinalStandings(text, year) {
  const standings = [];
  const section = text.match(/FINAL STANDINGS[\s\S]{0,2000}/i);
  if (section) {
    for (const line of section[0].split("\n")) {
      const m = line.match(
        /^([A-Z][\w\s'.-]+?)\s+(\d{1,3})\s+(\d{1,3})\s+(0\.\d+)/
      );
      if (m) {
        standings.push({
          team: m[1].trim(),
          wins: parseInt(m[2], 10),
          losses: parseInt(m[3], 10),
          winPct: parseFloat(m[4]),
          year,
        });
      }
    }
  }
  return standings;
}

parseNBCAnnuals()
  .then(() => {
    console.log(" Done!\n");
    process.exit(0);
  })
  .catch((err) => {
    console.error(" Failed:", err);
    process.exit(1);
  });
