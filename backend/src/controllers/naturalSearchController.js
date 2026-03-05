import { pool } from "../db.js";

/**
 * COMPREHENSIVE Natural Language Search Controller
 */

// ── Resolve actual table names at startup (one-time probe) ────────────────
const TABLE_CANDIDATES = {
  batting: [
    "batting_stats",
    "player_stats",
    "player_batting_stats",
    "player_batting",
  ],
  pitching: ["pitching_stats", "player_pitching_stats", "player_pitching"],
};

async function resolveTable(candidates) {
  for (const name of candidates) {
    try {
      await pool.query(`SELECT 1 FROM ${name} LIMIT 1`);
      return name;
    } catch {
      // table doesn't exist, try next
    }
  }
  return null;
}

let _battingTable = null;
let _pitchingTable = null;

async function getBattingTable() {
  if (!_battingTable)
    _battingTable = await resolveTable(TABLE_CANDIDATES.batting);
  return _battingTable;
}

async function getPitchingTable() {
  if (!_pitchingTable)
    _pitchingTable = await resolveTable(TABLE_CANDIDATES.pitching);
  return _pitchingTable;
}

const QUERY_PATTERNS = {
  playerName: /\b([A-Z][a-z]+\s+[A-Z][a-z]+)\b/,
  twoPlayerNames:
    /\b([A-Z][a-z]+\s+[A-Z][a-z]+)\b.*\b([A-Z][a-z]+\s+[A-Z][a-z]+)\b/,

  champion: /who won|champion|winner|title/i,
  mvp: /\bmvp\b|most valuable player/i,
  runnerUp: /runner.?up|second place|finalist/i,
  score: /score|final score|championship score/i,

  highest: /highest|best|top|most|leading|greatest/i,
  lowest: /lowest|worst|fewest|minimum/i,

  battingAvg: /batting average|\bbatting\b|avg|ba\b|average/i,
  homeRuns: /home runs?|\bhr\b|homers|dingers/i,
  rbi: /\brbi\b|runs batted in/i,
  hits: /\bhits\b|\btotal hits\b/i,
  runs: /runs scored|\bruns\b/i,
  doubles: /doubles?|\b2b\b/i,
  triples: /triples?|\b3b\b/i,
  walks: /\bwalks?\b|\bbb\b|bases on balls/i,
  strikeouts_batting: /strikeouts?|\bso\b|k's|struck out/i,
  stolenBases: /stolen bases?|\bsb\b|steals/i,
  obp: /\bobp\b|on.?base percentage/i,
  slg: /\bslg\b|slugging/i,
  totalBases: /total bases|\btb\b/i,
  hbp: /hit by pitch|\bhbp\b/i,
  sacHit: /sacrifice hit|\bsh\b/i,
  gdp: /grounded into|\bgdp\b/i,
  errors: /\berrors?\b/i,
  fielding: /fielding pct|fielding percentage|\bfld\b/i,
  gamesPlayed: /games played|\bgp\b/i,
  atBats: /at.?bats?|\bab\b/i,

  era: /\bera\b|earned run average/i,
  wins: /\bwins?\b|victories/i,
  losses: /\blosses?\b/i,
  saves: /\bsaves?\b|\bsv\b/i,
  strikeouts_pitching: /strikeouts?|\bso\b|k's|whiffs/i,
  innings: /innings?|\bip\b|innings pitched/i,
  whip: /\bwhip\b/i,
  shutouts: /shutouts?|\bsho\b/i,
  completeGames: /complete games?|\bcg\b/i,
  appearances: /appearances?|\bapp\b/i,

  team: /(?:from|for|on|with|played for)\s+(?:the\s+)?([A-Z][a-z\s]+(?:Monarchs|Larks|Foresters|Studs|Stars|Cannons|Oilers|Pilots|Bee Jays|Broncos|Heat|Twins|A's|Kraken|Dawgs|Goldpanners))/i,
  teamOnly:
    /\b(Hutchinson Monarchs|Hays Larks|Santa Barbara Foresters|Liberal Bee Jays|Boulder Collegians|San Diego Stars|Wichita\s+\w+|Wellington|Derby|Fairbanks Goldpanners)\b/i,

  year: /(?:in|for|during|of)\s+(?:the\s+)?(\d{4})|(\d{4})\s+(?:season|championship|mvp|winner|year)|year\s+(\d{4})/i,
  yearRange: /from\s+(\d{4})\s+to\s+(\d{4})|between\s+(\d{4})\s+and\s+(\d{4})/i,
  allTime: /all.?time|history|ever|career|all years/i,

  over: /over|above|more than|greater than|at least\s+(\d+)/i,
  under: /under|below|less than|fewer than|no more than\s+(\d+)/i,

  comparison: /compare|versus|vs\.?|against|better than/i,
  roster:
    /roster|players|lineup|team members|list.*stats|stats.*for.*team|batting.*for.*team|pitching.*for.*team/i,
  multiple: /top\s+(\d+)|best\s+(\d+)|first\s+(\d+)/i,

  position:
    /pitcher|catcher|infielder|outfielder|first base|second base|third base|shortstop|left field|center field|right field/i,
};

function parseQuery(query) {
  const intent = {
    type: null,
    playerName: null,
    playerName2: null,
    stat: null,
    order: null,
    team: null,
    year: null,
    yearStart: null,
    yearEnd: null,
    threshold: null,
    limit: 10,
    position: null,
    allTime: false,
  };

  const lowerQuery = query.toLowerCase();

  if (QUERY_PATTERNS.allTime.test(lowerQuery)) {
    intent.allTime = true;
    intent.year = null;
  } else {
    const yearMatch = query.match(QUERY_PATTERNS.year);
    if (yearMatch) {
      intent.year = parseInt(yearMatch[1] || yearMatch[2] || yearMatch[3]);
    }
  }

  const yearRangeMatch = query.match(QUERY_PATTERNS.yearRange);
  if (yearRangeMatch) {
    intent.yearStart = parseInt(yearRangeMatch[1] || yearRangeMatch[3]);
    intent.yearEnd = parseInt(yearRangeMatch[2] || yearRangeMatch[4]);
  }

  const multipleMatch = query.match(QUERY_PATTERNS.multiple);
  if (multipleMatch) {
    intent.limit = parseInt(
      multipleMatch[1] || multipleMatch[2] || multipleMatch[3],
    );
  }

  // MVP must be checked BEFORE champion — "who won the MVP" matches both
  if (QUERY_PATTERNS.mvp.test(lowerQuery) && intent.year) {
    intent.type = "championship_mvp";
    return intent;
  }
  if (QUERY_PATTERNS.runnerUp.test(lowerQuery) && intent.year) {
    intent.type = "championship_runnerup";
    return intent;
  }
  if (QUERY_PATTERNS.champion.test(lowerQuery) && intent.year) {
    intent.type = "championship_winner";
    return intent;
  }

  if (
    QUERY_PATTERNS.roster.test(lowerQuery) ||
    /for team|stats.*for|for the\b/i.test(lowerQuery)
  ) {
    const teamMatch =
      query.match(QUERY_PATTERNS.team) ||
      query.match(QUERY_PATTERNS.teamOnly) ||
      query.match(/['"]([^'"]+)['"]/) ||
      query.match(
        /(?:for|team)\s+['"]?([A-Z][A-Za-z\s]{2,30?)(?:['"]|\s+in\s+\d{4}|$)/,
      );
    if (teamMatch && intent.year) {
      intent.team = teamMatch[1].trim();
      intent.statGroup = /pitch/i.test(lowerQuery) ? "pitching" : "batting";
      intent.type = "team_roster";
      return intent;
    }
  }

  if (
    (lowerQuery.includes("championships") || lowerQuery.includes("won")) &&
    lowerQuery.includes("many")
  ) {
    const teamMatch =
      query.match(QUERY_PATTERNS.team) || query.match(QUERY_PATTERNS.teamOnly);
    if (teamMatch) {
      intent.team = teamMatch[1].trim();
      intent.type = "team_championships";
      return intent;
    }
  }

  const twoNamesMatch = query.match(QUERY_PATTERNS.twoPlayerNames);
  if (twoNamesMatch && QUERY_PATTERNS.comparison.test(lowerQuery)) {
    intent.playerName = twoNamesMatch[1];
    intent.playerName2 = twoNamesMatch[2];
    intent.type = "player_comparison";
    return intent;
  }

  const nameMatch = query.match(QUERY_PATTERNS.playerName);
  if (nameMatch) {
    intent.playerName = nameMatch[1];
    intent.type = "player_lookup";
  }

  const teamMatch =
    query.match(QUERY_PATTERNS.team) || query.match(QUERY_PATTERNS.teamOnly);
  if (teamMatch) {
    intent.team = teamMatch[1].trim();
  }

  if (!intent.type) {
    if (QUERY_PATTERNS.obp.test(lowerQuery)) {
      intent.stat = "obp";
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.slg.test(lowerQuery)) {
      intent.stat = "slg";
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.battingAvg.test(lowerQuery)) {
      intent.stat = "avg";
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.homeRuns.test(lowerQuery)) {
      intent.stat = "hr";
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.rbi.test(lowerQuery)) {
      intent.stat = "rbi";
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.totalBases.test(lowerQuery)) {
      intent.stat = "tb";
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.doubles.test(lowerQuery)) {
      intent.stat = "2b";
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.triples.test(lowerQuery)) {
      intent.stat = "3b";
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.walks.test(lowerQuery)) {
      intent.stat = "bb";
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.stolenBases.test(lowerQuery)) {
      intent.stat = "sb";
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.hbp.test(lowerQuery)) {
      intent.stat = "hbp";
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.sacHit.test(lowerQuery)) {
      intent.stat = "sh";
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.gdp.test(lowerQuery)) {
      intent.stat = "gdp";
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.errors.test(lowerQuery)) {
      intent.stat = "e";
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.fielding.test(lowerQuery)) {
      intent.stat = "fld";
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.gamesPlayed.test(lowerQuery)) {
      intent.stat = "gp";
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.atBats.test(lowerQuery)) {
      intent.stat = "ab";
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.hits.test(lowerQuery)) {
      intent.stat = "h";
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.runs.test(lowerQuery)) {
      intent.stat = "r";
      intent.type = "batting_stat";
    } else if (
      QUERY_PATTERNS.strikeouts_batting.test(lowerQuery) &&
      !lowerQuery.includes("pitcher") &&
      !lowerQuery.includes("pitching")
    ) {
      intent.stat = "so";
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.whip.test(lowerQuery)) {
      intent.stat = "whip";
      intent.type = "pitching_stat";
    } else if (QUERY_PATTERNS.era.test(lowerQuery)) {
      intent.stat = "era";
      intent.type = "pitching_stat";
    } else if (QUERY_PATTERNS.wins.test(lowerQuery)) {
      intent.stat = "w";
      intent.type = "pitching_stat";
    } else if (QUERY_PATTERNS.losses.test(lowerQuery)) {
      intent.stat = "l";
      intent.type = "pitching_stat";
    } else if (QUERY_PATTERNS.saves.test(lowerQuery)) {
      intent.stat = "sv";
      intent.type = "pitching_stat";
    } else if (QUERY_PATTERNS.shutouts.test(lowerQuery)) {
      intent.stat = "sho";
      intent.type = "pitching_stat";
    } else if (QUERY_PATTERNS.completeGames.test(lowerQuery)) {
      intent.stat = "cg";
      intent.type = "pitching_stat";
    } else if (QUERY_PATTERNS.innings.test(lowerQuery)) {
      intent.stat = "ip";
      intent.type = "pitching_stat";
    } else if (QUERY_PATTERNS.appearances.test(lowerQuery)) {
      intent.stat = "app";
      intent.type = "pitching_stat";
    } else if (
      QUERY_PATTERNS.strikeouts_pitching.test(lowerQuery) &&
      (lowerQuery.includes("pitcher") || lowerQuery.includes("pitching"))
    ) {
      intent.stat = "so";
      intent.type = "pitching_stat";
    }

    if (QUERY_PATTERNS.highest.test(lowerQuery)) {
      intent.order = "DESC";
      if (!intent.type) intent.type = "leaderboard";
    } else if (QUERY_PATTERNS.lowest.test(lowerQuery)) {
      intent.order = "ASC";
      if (!intent.type) intent.type = "leaderboard";
    }
  }

  const overMatch = query.match(QUERY_PATTERNS.over);
  const underMatch = query.match(QUERY_PATTERNS.under);
  if (overMatch)
    intent.threshold = { operator: ">=", value: parseInt(overMatch[1]) };
  else if (underMatch)
    intent.threshold = { operator: "<=", value: parseInt(underMatch[1]) };

  return intent;
}

const safeCol = (col) => (/^\d/.test(col) ? `"${col}"` : col);

async function buildQuery(intent, searchQuery = "") {
  let query = "";
  let params = [];
  const lowerQuery = searchQuery.toLowerCase();

  // 1. Most MVPs leaderboard
  if (
    intent.type === "leaderboard" &&
    (lowerQuery.includes("mvp") || lowerQuery.includes("most valuable"))
  ) {
    query = `
      SELECT p.first_name || ' ' || p.last_name AS player_name,
             COUNT(c.year) AS count,
             array_agg(c.year ORDER BY c.year DESC) AS years
      FROM championships c
      JOIN players p ON c.mvp_player_id = p.id
      WHERE c.mvp_player_id IS NOT NULL
      GROUP BY p.id, p.first_name, p.last_name
      ORDER BY count DESC LIMIT $1
    `;
    params = [intent.limit || 10];
    return { query, params };
  }

  // 2. Championship by year — supports co-MVPs via mvp_player_id2
  if (
    [
      "championship_winner",
      "championship_mvp",
      "championship_runnerup",
    ].includes(intent.type)
  ) {
    // Probe columns to avoid crashing on missing schema
    const colCheck = await pool.query(
      "SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='championships'",
    );
    const cols = colCheck.rows.map((r) => r.column_name);
    const hasRunnerUp = cols.includes("runner_up_team_id");
    const hasMvp = cols.includes("mvp_player_id");
    const hasMvp2 = cols.includes("mvp_player_id2");
    const hasScore = cols.includes("championship_score");
    const hasChampTeam = cols.includes("champion_team_id");

    const champCols = hasChampTeam
      ? "t1.name AS champion_name, t1.city AS champion_city, t1.state AS champion_state,"
      : "NULL::text AS champion_name, NULL::text AS champion_city, NULL::text AS champion_state,";
    const ruCols = hasRunnerUp
      ? "t2.name AS runner_up_name,"
      : "NULL::text AS runner_up_name,";
    const scoreCols = hasScore
      ? "c.championship_score,"
      : "NULL::text AS championship_score,";

    let mvpCols;
    if (hasMvp && hasMvp2) {
      mvpCols =
        "array_remove(ARRAY[CASE WHEN p1.id IS NOT NULL THEN p1.first_name||' '||p1.last_name END, CASE WHEN p2.id IS NOT NULL THEN p2.first_name||' '||p2.last_name END], NULL) AS mvp_names,";
    } else if (hasMvp) {
      mvpCols =
        "CASE WHEN p1.id IS NOT NULL THEN ARRAY[p1.first_name||' '||p1.last_name] ELSE ARRAY[]::text[] END AS mvp_names,";
    } else {
      mvpCols = "ARRAY[]::text[] AS mvp_names,";
    }

    const champJoin = hasChampTeam
      ? "LEFT JOIN teams t1 ON c.champion_team_id = t1.id"
      : "";
    const ruJoin = hasRunnerUp
      ? "LEFT JOIN teams t2 ON c.runner_up_team_id = t2.id"
      : "";
    const mvpJoin = hasMvp
      ? "LEFT JOIN players p1 ON c.mvp_player_id = p1.id"
      : "";
    const mvp2Join = hasMvp2
      ? "LEFT JOIN players p2 ON c.mvp_player_id2 = p2.id"
      : "";

    query = `
      SELECT c.year,
             ${champCols}
             ${ruCols}
             ${mvpCols}
             ${scoreCols}
             c.id
      FROM championships c
      ${champJoin} ${ruJoin} ${mvpJoin} ${mvp2Join}
      WHERE c.year = $1
      LIMIT 1
    `;
    params = [intent.year];
    return { query, params };
  }

  if (intent.type === "player_lookup") {
    const battingTable = await getBattingTable();
    const pitchingTable = await getPitchingTable();
    const bt = battingTable || "batting_stats";
    const pt = pitchingTable || "pitching_stats";
    const yearClause = intent.year
      ? `AND COALESCE(bs.year, ps.year) = ${parseInt(intent.year)}`
      : "";
    query = `
      SELECT
        p.first_name || ' ' || p.last_name AS player_name,
        COALESCE(bt.name, pt.name) AS team_name,
        COALESCE(bs.year, ps.year) AS year,
        bs.avg, bs.obp, bs.slg, bs.hr, bs.rbi, bs.h, bs.r, bs.bb, bs.so,
        bs.sb, bs.ab, bs.gp, bs."2b", bs."3b", bs.tb, bs.hbp, bs.sh, bs.gdp, bs.e, bs.fld,
        ps.era, ps.ip, ps.w, ps.l, ps.sv, ps.so AS p_so, ps.bb AS p_bb,
        ps.cg, ps.sho, ps.app, ps.whip
      FROM players p
      LEFT JOIN ${bt} bs ON p.id = bs.player_id
      LEFT JOIN ${pt} ps ON p.id = ps.player_id
      LEFT JOIN teams bt ON bs.team_id = bt.id
      LEFT JOIN teams pt ON ps.team_id = pt.id
      WHERE p.first_name || ' ' || p.last_name ILIKE $1
        ${yearClause}
      ORDER BY COALESCE(bs.year, ps.year) DESC
      LIMIT 10
    `;
    params = [`%${intent.playerName}%`];
    return { query, params };
  }

  // 3. Team Roster
  if (intent.type === "team_roster") {
    const battingTable = await getBattingTable();
    const pitchingTable = await getPitchingTable();
    const bt = battingTable || "batting_stats";
    const pt = pitchingTable || "pitching_stats";
    const yearClause = intent.year
      ? `AND COALESCE(bs.year, ps.year) = ${parseInt(intent.year)}`
      : "";
    const teamClause = `LOWER(COALESCE(t.name, '')) ILIKE $1`;

    if (intent.statGroup === "pitching") {
      query = `
        SELECT DISTINCT
          p.first_name || ' ' || p.last_name AS player_name,
          t.name AS team_name, ps.year,
          ps.era, ps.ip, ps.w, ps.l, ps.sv, ps.so, ps.bb, ps.cg, ps.sho, ps.app
        FROM ${pt} ps
        JOIN players p ON ps.player_id = p.id
        LEFT JOIN teams t ON ps.team_id = t.id
        WHERE ${teamClause} ${yearClause}
        ORDER BY ps.era ASC NULLS LAST LIMIT 50
      `;
    } else {
      query = `
        SELECT DISTINCT
          p.first_name || ' ' || p.last_name AS player_name,
          t.name AS team_name, bs.year,
          bs.avg, bs.obp, bs.slg, bs.hr, bs.rbi, bs.h, bs.r,
          bs.ab, bs.bb, bs.so, bs.sb, bs."2b", bs."3b", bs.tb, bs.gp
        FROM ${bt} bs
        JOIN players p ON bs.player_id = p.id
        LEFT JOIN teams t ON bs.team_id = t.id
        WHERE ${teamClause} ${yearClause}
        ORDER BY bs.avg DESC NULLS LAST LIMIT 50
      `;
    }
    params = [`%${intent.team}%`];
    return { query, params };
  }

  // 4. Batting stat leaderboard
  if (intent.type === "batting_stat") {
    const battingTable = await getBattingTable();
    if (!battingTable) return { query: null, params: [] };
    const stat = intent.stat || "avg";
    const col = safeCol(stat);
    const defaultOrder = ["so", "gdp", "e", "hbp"].includes(stat)
      ? "ASC"
      : "DESC";
    query = `
      SELECT CONCAT(p.first_name, ' ', p.last_name) AS player_name,
             t.name AS team_name, bs.year, bs.*
      FROM ${battingTable} bs
      JOIN players p ON bs.player_id = p.id
      LEFT JOIN teams t ON bs.team_id = t.id
      WHERE ($1::int IS NULL OR bs.year = $1)
        AND bs.${col} IS NOT NULL
      ORDER BY bs.${col} ${intent.order || defaultOrder} NULLS LAST
      LIMIT $2
    `;
    params = [intent.year, intent.limit];
    return { query, params };
  }

  // 5. Pitching stat leaderboard
  if (intent.type === "pitching_stat") {
    const pitchingTable = await getPitchingTable();
    if (!pitchingTable) return { query: null, params: [] };
    const stat = intent.stat || "era";

    if (stat === "whip") {
      const orderBy = `((COALESCE(ps.bb,0) + COALESCE(ps.h,0)) / NULLIF(ps.ip,0))`;
      query = `
        SELECT CONCAT(p.first_name, ' ', p.last_name) AS player_name,
               t.name AS team_name, ps.year,
               ROUND(((COALESCE(ps.bb,0) + COALESCE(ps.h,0)) / NULLIF(ps.ip,0))::numeric, 3) AS whip,
               ps.*
        FROM ${pitchingTable} ps
        JOIN players p ON ps.player_id = p.id
        LEFT JOIN teams t ON ps.team_id = t.id
        WHERE ($1::int IS NULL OR ps.year = $1) AND ps.ip > 0
        ORDER BY ${orderBy} ${intent.order || "ASC"} NULLS LAST
        LIMIT $2
      `;
      params = [intent.year, intent.limit];
      return { query, params };
    }

    const col = safeCol(stat);
    const defaultOrder = ["l", "bb", "hbp", "bk"].includes(stat)
      ? "ASC"
      : stat === "era"
        ? "ASC"
        : "DESC";
    query = `
      SELECT CONCAT(p.first_name, ' ', p.last_name) AS player_name,
             t.name AS team_name, ps.year, ps.*
      FROM ${pitchingTable} ps
      JOIN players p ON ps.player_id = p.id
      LEFT JOIN teams t ON ps.team_id = t.id
      WHERE ($1::int IS NULL OR ps.year = $1)
        AND ps.${col} IS NOT NULL
        AND ps.ip > 0
      ORDER BY ps.${col} ${intent.order || defaultOrder} NULLS LAST
      LIMIT $2
    `;
    params = [intent.year, intent.limit];
    return { query, params };
  }
  return { query: null, params: [] };
}

function formatResponse(intent, results) {
  if (!results || results.length === 0) {
    return {
      success: true,
      answer: "No results found for your query.",
      data: null,
      results: [],
      intent,
    };
  }

  let message = "";
  let answer = "";

  if (intent.type === "championship_winner") {
    const c = results[0];
    answer = `The ${intent.year} NBC World Series champion was the **${c.champion_name}** from ${c.champion_city}, ${c.champion_state}.`;
    if (c.championship_score)
      answer += ` Final score: ${c.championship_score}.`;
    return {
      success: true,
      answer,
      data: c,
      message: `${intent.year} Championship`,
      results,
      intent,
      count: 1,
    };
  }

  if (intent.type === "championship_mvp") {
    const c = results[0];
    const names = c.mvp_names || [];
    let mvpStr;
    if (names.length === 0) mvpStr = null;
    else if (names.length === 1) mvpStr = names[0];
    else
      mvpStr =
        names.slice(0, -1).join(", ") + " and " + names[names.length - 1];

    answer = mvpStr
      ? `The ${intent.year} NBC World Series MVP${names.length > 1 ? "s were" : " was"} **${mvpStr}**.`
      : `No MVP was awarded in ${intent.year}.`;
    return {
      success: true,
      answer,
      data: c,
      message: `${intent.year} MVP`,
      results,
      intent,
      count: 1,
    };
  }

  if (intent.type === "championship_runnerup") {
    const c = results[0];
    answer = c.runner_up_name
      ? `The ${intent.year} runner-up was the **${c.runner_up_name}**.`
      : `Runner-up information not available for ${intent.year}.`;
    return {
      success: true,
      answer,
      data: c,
      message: `${intent.year} Runner-up`,
      results,
      intent,
      count: 1,
    };
  }

  if (intent.type === "leaderboard" && results[0]?.count) {
    const topCount = results[0].count;
    const tied = results.filter((r) => String(r.count) === String(topCount));
    let leaderAnswer;
    if (tied.length === 1) {
      leaderAnswer = `The player with the most MVPs is **${tied[0].player_name}** with **${topCount}** award${topCount !== 1 ? "s" : ""}.`;
    } else {
      const names = tied.map((r) => `**${r.player_name}**`).join(", ");
      leaderAnswer = `There is a **${tied.length}-way tie** for most MVPs with **${topCount}** award${topCount !== 1 ? "s" : ""} each: ${names}.`;
    }
    return {
      success: true,
      answer: leaderAnswer,
      data: results,
      message: "All-Time MVP Leaders",
      results,
      intent,
      count: results.length,
    };
  }

  if (intent.type === "team_roster") {
    const yearLabel = intent.year ? ` – ${intent.year}` : "";
    const groupLabel = intent.statGroup === "pitching" ? "Pitching" : "Batting";
    const teamName = results[0]?.team_name || intent.team;
    return {
      success: true,
      answer: `Found **${results.length}** players with ${groupLabel} stats for **${teamName}**${yearLabel}.`,
      data: results,
      message: `${groupLabel} Stats – ${teamName}${yearLabel}`,
      results,
      queryType:
        intent.statGroup === "pitching" ? "pitching_stat" : "batting_stat",
      intent: {
        ...intent,
        stat: intent.statGroup === "pitching" ? "era" : "avg",
      },
      count: results.length,
    };
  }

  if (intent.type === "team_championships") {
    const t = results[0];
    answer = `The ${t.team_name} have won ${t.championships} championship${t.championships !== 1 ? "s" : ""}.`;
    if (t.years?.length)
      answer += ` Years: ${t.years.slice(0, 10).join(", ")}${t.years.length > 10 ? "..." : ""}.`;
    return {
      success: true,
      answer,
      data: t,
      message: `${t.team_name} Championships`,
      results,
      intent,
      count: 1,
    };
  }

  if (intent.type === "player_comparison") {
    answer =
      results.length === 2
        ? `Comparing **${results[0].player_name}** and **${results[1].player_name}**${intent.year ? ` – ${intent.year} Season` : ""}`
        : `Found ${results.length} player(s) for comparison.`;
    return {
      success: true,
      answer,
      data: results,
      message: answer,
      results,
      intent,
      count: results.length,
    };
  }

  if (intent.type === "player_lookup") {
    const p = results[0];
    message = `Stats for **${p.player_name}** (${p.team_name || "Unknown Team"})${intent.year ? ` – ${intent.year}` : ""}`;
    return {
      success: true,
      answer: message,
      data: p,
      message,
      results,
      intent,
      count: results.length,
    };
  }

  if (intent.type === "batting_stat") {
    const STAT_LABELS = {
      avg: "Batting Average",
      hr: "Home Runs",
      rbi: "RBI",
      h: "Hits",
      r: "Runs",
      "2b": "Doubles",
      "3b": "Triples",
      bb: "Walks",
      sb: "Stolen Bases",
      obp: "On-Base %",
      slg: "Slugging %",
      tb: "Total Bases",
      gp: "Games Played",
      ab: "At Bats",
      hbp: "Hit By Pitch",
      sh: "Sacrifice Hits",
      gdp: "GDP",
      e: "Errors",
      fld: "Fielding %",
    };
    const label =
      STAT_LABELS[intent.stat] || intent.stat?.toUpperCase() || "Stat";
    const yearLabel = intent.year ? ` – ${intent.year} Season` : " – All Time";
    const top = results[0];
    const topVal = top[intent.stat];
    const tied = results.filter((r) => r[intent.stat] == topVal);
    const formatted =
      topVal != null
        ? ["avg", "obp", "slg", "fld"].includes(intent.stat)
          ? parseFloat(topVal).toFixed(3)
          : topVal
        : null;
    if (tied.length > 1) {
      const names = tied.map((r) => `**${r.player_name}**`).join(", ");
      answer = `${tied.length} players are tied in ${label} with **${formatted}**${yearLabel}: ${names}.`;
    } else {
      answer = `**${top.player_name}** leads in ${label}${formatted != null ? ` with **${formatted}**` : ""}${yearLabel}.`;
    }
    message = `Top ${results.length} by ${label}${yearLabel}`;
  }

  if (intent.type === "pitching_stat") {
    const STAT_LABELS = {
      era: "ERA",
      w: "Wins",
      l: "Losses",
      so: "Strikeouts",
      sv: "Saves",
      ip: "Innings Pitched",
      cg: "Complete Games",
      sho: "Shutouts",
      app: "Appearances",
      whip: "WHIP",
    };
    const label =
      STAT_LABELS[intent.stat] || intent.stat?.toUpperCase() || "Stat";
    const yearLabel = intent.year ? ` – ${intent.year} Season` : " – All Time";
    const top = results[0];
    const topVal = top[intent.stat] ?? top.whip;
    const tied = results.filter((r) => (r[intent.stat] ?? r.whip) == topVal);
    const formatted =
      topVal != null
        ? ["era", "whip", "ip"].includes(intent.stat)
          ? parseFloat(topVal).toFixed(2)
          : topVal
        : null;
    if (tied.length > 1) {
      const names = tied.map((r) => `**${r.player_name}**`).join(", ");
      answer = `${tied.length} players are tied in ${label} with **${formatted}**${yearLabel}: ${names}.`;
    } else {
      answer = `**${top.player_name}** leads in ${label}${formatted != null ? ` with **${formatted}**` : ""}${yearLabel}.`;
    }
    message = `Top ${results.length} by ${label}${yearLabel}`;
  }

  return {
    success: true,
    answer,
    data: results,
    message,
    results,
    intent,
    count: results.length,
  };
}

// ─── Main handler ─────────────────────────────────────────────────────────
export const naturalLanguageSearch = async (req, res) => {
  try {
    const { query, question } = req.body;
    const searchQuery = query || question;

    if (!searchQuery || typeof searchQuery !== "string") {
      return res
        .status(400)
        .json({ success: false, error: "Query string is required" });
    }

    console.log("\n=== Natural Language Search ===");
    console.log("Query:", searchQuery);

    // ── INTERCEPT 1: Most Championships ──────────────────────────────────
    if (
      /\b(most\s+champ\w*|who\s+(has|have)\s+won\s+the\s+most|team\s+with\s+most|most\s+titles?)\b/i.test(
        searchQuery,
      )
    ) {
      const result = await pool.query(`
        SELECT t.name AS team_name, t.city, t.state,
               COUNT(*) AS count,
               array_agg(c.year ORDER BY c.year DESC) AS years
        FROM championships c
        JOIN teams t ON c.champion_team_id = t.id
        WHERE c.champion_team_id IS NOT NULL
        GROUP BY t.id, t.name, t.city, t.state
        ORDER BY count DESC LIMIT 10
      `);
      if (result.rows.length > 0) {
        const top = result.rows[0];
        return res.json({
          success: true,
          answer: `The team with the most championships is the **${top.team_name}** with **${top.count}** titles.`,
          results: result.rows,
          queryType: "leaderboard",
          intent: { type: "leaderboard" },
          count: result.rows.length,
        });
      }
    }

    // ── INTERCEPT 2: Most MVPs ────────────────────────────────────────────
    if (
      /\b(most\s+mvp|who\s+has\s+the\s+most\s+mvp|player\s+with\s+most\s+mvp|mvp\s+leader)\b/i.test(
        searchQuery,
      )
    ) {
      const result = await pool.query(`
        SELECT p.first_name || ' ' || p.last_name AS player_name,
               COUNT(*) AS count,
               array_agg(c.year ORDER BY c.year DESC) AS years
        FROM championships c
        JOIN players p ON c.mvp_player_id = p.id
        WHERE c.mvp_player_id IS NOT NULL
        GROUP BY p.id, p.first_name, p.last_name
        ORDER BY count DESC LIMIT 10
      `);
      if (result.rows.length > 0) {
        const topCount = result.rows[0].count;
        const tied = result.rows.filter(
          (r) => String(r.count) === String(topCount),
        );
        let answer;
        if (tied.length === 1) {
          const top = tied[0];
          answer = `The player with the most MVPs is **${top.player_name}** with **${top.count}** award${top.count !== 1 ? "s" : ""} (${top.years.slice(0, 3).join(", ")}).`;
        } else {
          const names = tied.map((r) => `**${r.player_name}**`).join(", ");
          answer = `There is a **${tied.length}-way tie** for most MVPs with **${topCount}** award${topCount !== 1 ? "s" : ""} each: ${names}.`;
        }
        return res.json({
          success: true,
          answer,
          results: result.rows,
          queryType: "leaderboard",
          intent: { type: "leaderboard", target: "players" },
          count: result.rows.length,
        });
      }
    }

    // ── INTERCEPT 3: Championship Streaks ────────────────────────────────
    if (
      /\b(streak|consecutive|in\s+a\s+row|back.?to.?back|most\s+streak\w*)\b/i.test(
        searchQuery,
      )
    ) {
      const result = await pool.query(`
        WITH streak_data AS (
          SELECT t.name AS team_name, c.year,
                 c.year - ROW_NUMBER() OVER (PARTITION BY c.champion_team_id ORDER BY c.year) AS streak_group
          FROM championships c JOIN teams t ON c.champion_team_id = t.id
        ),
        streaks AS (
          SELECT team_name, MIN(year) AS start_year, MAX(year) AS end_year, COUNT(*) AS consecutive_wins
          FROM streak_data GROUP BY team_name, streak_group
        )
        SELECT * FROM streaks WHERE consecutive_wins > 1
        ORDER BY consecutive_wins DESC, end_year DESC LIMIT 10
      `);
      if (result.rows.length > 0) {
        const topWins = result.rows[0].consecutive_wins;
        const tiedStreaks = result.rows.filter(
          (r) => String(r.consecutive_wins) === String(topWins),
        );
        let streakAnswer;
        if (tiedStreaks.length === 1) {
          const top = tiedStreaks[0];
          streakAnswer = `The longest championship streak belongs to the **${top.team_name}** with **${top.consecutive_wins}** consecutive titles (${top.start_year}–${top.end_year}).`;
        } else {
          const names = tiedStreaks
            .map((r) => `**${r.team_name}** (${r.start_year}–${r.end_year})`)
            .join(", ");
          streakAnswer = `There is a **${tiedStreaks.length}-way tie** for the longest streak with **${topWins}** consecutive titles: ${names}.`;
        }
        return res.json({
          success: true,
          answer: streakAnswer,
          results: result.rows,
          queryType: "streaks",
          intent: { type: "streaks" },
          count: result.rows.length,
        });
      }
    }

    // ── PATTERN MATCHING ──────────────────────────────────────────────────
    const intent = parseQuery(searchQuery);
    console.log("Intent:", JSON.stringify(intent));

    const { query: sqlQuery, params } = await buildQuery(intent, searchQuery);

    if (sqlQuery) {
      const dbResult = await pool.query(sqlQuery, params);
      const formatted = formatResponse(intent, dbResult.rows);
      return res.json({ ...formatted, queryType: intent.type });
    }

    // ── FINAL GRACEFUL FALLBACK ───────────────────────────────────────────
    const finalFallback = await pool.query(
      `SELECT t.name AS team_name, t.city, t.state, COUNT(c.id) AS titles
       FROM teams t
       LEFT JOIN championships c ON c.champion_team_id = t.id
       WHERE t.name ILIKE $1 OR t.city ILIKE $1
       GROUP BY t.id, t.name, t.city, t.state
       ORDER BY titles DESC LIMIT 10`,
      [`%${searchQuery}%`],
    );

    return res.json({
      success: true,
      answer: finalFallback.rows.length
        ? `I couldn't find a specific answer, but here are some teams matching "${searchQuery}".`
        : `No results found for "${searchQuery}". Try asking about "Most MVPs" or a specific team.`,
      results: finalFallback.rows,
      queryType: "fallback",
      count: finalFallback.rows.length,
    });
  } catch (error) {
    console.error("Natural language search error:", error);
    res.json({
      success: false,
      answer: "Something went wrong. Please try rephrasing your question.",
      results: [],
      count: 0,
    });
  }
};

// ─── Suggestions ─────────────────────────────────────────────────────────
export const getSearchSuggestions = async (req, res) => {
  try {
    const suggestions = [
      "Jake Gutierrez stats",
      "Max Buettenback pitching stats",
      "Who won in 2020?",
      "Who was the MVP in 2024?",
      "Who was the runner-up in 2023?",
      "Most home runs all time",
      "Most RBI all time",
      "Most walks all time",
      "Best batting average all time",
      "Best ERA all time",
      "Top 10 home run hitters in 2025",
      "Who had the highest batting average in 2025?",
      "Best ERA in 2025",
      "Most strikeouts 2025",
      "Top 5 RBI leaders 2024",
      "Players with over 3 home runs in 2025",
      "Best slugging percentage 2025",
      "Hutchinson Monarchs roster 2025",
      "Which team has the most championships?",
      "Most championships all time",
      "Championship streaks",
    ];
    res.json({ success: true, suggestions });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to get suggestions" });
  }
};
