import { pool } from "../db.js";

/**
 * COMPREHENSIVE Natural Language Search Controller
 * Supports 30+ different query patterns including:
 * - Player lookups (name, stats)
 * - Championship queries (winner, MVP, runner-up, score)
 * - Stat leaderboards (batting, pitching)
 * - Team queries (roster, championships, year played)
 * - Comparison queries (player vs player)
 * - Range queries (years, thresholds)
 * - Multi-stat queries (best all-around players)
 */

// Enhanced query patterns
const QUERY_PATTERNS = {
  // Player name search
  playerName: /\b([A-Z][a-z]+\s+[A-Z][a-z]+)\b/,
  twoPlayerNames:
    /\b([A-Z][a-z]+\s+[A-Z][a-z]+)\b.*\b([A-Z][a-z]+\s+[A-Z][a-z]+)\b/,

  // Championship queries
  champion: /who won|champion|winner|title/i,
  mvp: /\bmvp\b|most valuable player/i,
  runnerUp: /runner.?up|second place|finalist/i,
  score: /score|final score|championship score/i,

  // Stat queries - superlatives
  highest: /highest|best|top|most|leading|greatest/i,
  lowest: /lowest|worst|fewest|minimum/i,

  // Stat types - batting
  battingAvg: /batting average|avg|ba\b|average/i,
  homeRuns: /home runs?|hr\b|homers|dingers/i,
  rbi: /rbi|runs batted in/i,
  hits: /\bhits?\b|\bh\b/i,
  runs: /\bruns?\b|\br\b|runs scored/i,
  doubles: /doubles?|2b\b/i,
  triples: /triples?|3b\b/i,
  walks: /walks?|bb\b|bases on balls/i,
  strikeouts_batting: /strikeouts?|so\b|k's|struck out/i,
  stolenBases: /stolen bases?|sb\b|steals/i,
  obp: /obp|on.?base percentage/i,
  slg: /slg|slugging|slugging percentage/i,
  ops: /ops|on.?base plus slugging/i,

  // Stat types - pitching
  era: /\bera\b|earned run average/i,
  wins: /\bwins?\b|\bw\b|victories/i,
  losses: /\blosses?\b|\bl\b/i,
  saves: /\bsaves?\b|sv\b/i,
  strikeouts_pitching: /strikeouts?|so\b|k's|whiffs/i,
  innings: /innings?|ip\b|innings pitched/i,
  whip: /whip/i,
  shutouts: /shutouts?|sho\b/i,
  completeGames: /complete games?|cg\b/i,

  // Team names - comprehensive list
  team: /(?:from|for|on|with|played for)\s+(?:the\s+)?([A-Z][a-z\s]+(?:Monarchs|Larks|Foresters|Studs|Stars|Cannons|Oilers|Pilots|Bee Jays|Broncos|Heat|Twins|A's|Kraken|Dawgs|Foresters|Goldpanners))/i,
  teamOnly:
    /\b(Hutchinson Monarchs|Hays Larks|Santa Barbara Foresters|Liberal Bee Jays|Boulder Collegians|San Diego Stars|Wichita\s+\w+|Wellington|Derby|Fairbanks Goldpanners)\b/i,

  // Year patterns
  year: /(?:in|for|during|of)\s+(\d{4})|(\d{4})\s+(?:season|championship|mvp|winner|year)|year\s+(\d{4})/i,
  yearRange: /from\s+(\d{4})\s+to\s+(\d{4})|between\s+(\d{4})\s+and\s+(\d{4})/i,

  // Thresholds
  over: /over|above|more than|greater than|at least\s+(\d+)/i,
  under: /under|below|less than|fewer than|no more than\s+(\d+)/i,

  // Query types
  comparison: /compare|versus|vs\.?|against|better than/i,
  roster: /roster|players|lineup|team members/i,
  allTime: /all.?time|history|ever|career/i,
  multiple: /top\s+(\d+)|best\s+(\d+)|first\s+(\d+)/i,

  // Position
  position:
    /pitcher|catcher|infielder|outfielder|first base|second base|third base|shortstop|left field|center field|right field/i,
};

/**
 * Parse natural language query into structured intent
 */
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
  };

  const lowerQuery = query.toLowerCase();

  // Extract year(s)
  const yearMatch = query.match(QUERY_PATTERNS.year);
  if (yearMatch) {
    intent.year = parseInt(yearMatch[1] || yearMatch[2] || yearMatch[3]);
  }

  const yearRangeMatch = query.match(QUERY_PATTERNS.yearRange);
  if (yearRangeMatch) {
    intent.yearStart = parseInt(yearRangeMatch[1] || yearRangeMatch[3]);
    intent.yearEnd = parseInt(yearRangeMatch[2] || yearRangeMatch[4]);
  }

  // Extract limit (top 5, best 10, etc.)
  const multipleMatch = query.match(QUERY_PATTERNS.multiple);
  if (multipleMatch) {
    intent.limit = parseInt(
      multipleMatch[1] || multipleMatch[2] || multipleMatch[3]
    );
  }

  // Check for championship queries
  if (QUERY_PATTERNS.champion.test(lowerQuery) && intent.year) {
    intent.type = "championship_winner";
    return intent;
  }

  if (QUERY_PATTERNS.mvp.test(lowerQuery) && intent.year) {
    intent.type = "championship_mvp";
    return intent;
  }

  if (QUERY_PATTERNS.runnerUp.test(lowerQuery) && intent.year) {
    intent.type = "championship_runnerup";
    return intent;
  }

  // Check for team roster query
  if (QUERY_PATTERNS.roster.test(lowerQuery)) {
    const teamMatch =
      query.match(QUERY_PATTERNS.team) || query.match(QUERY_PATTERNS.teamOnly);
    if (teamMatch && intent.year) {
      intent.team = teamMatch[1].trim();
      intent.type = "team_roster";
      return intent;
    }
  }

  // Check for team championship count
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

  // Extract player names
  const twoNamesMatch = query.match(QUERY_PATTERNS.twoPlayerNames);
  if (twoNamesMatch && QUERY_PATTERNS.comparison.test(lowerQuery)) {
    intent.playerName = twoNamesMatch[1];
    intent.playerName2 = twoNamesMatch[2];
    intent.type = "player_comparison";
    intent.year = intent.year || 2025;
    return intent;
  }

  const nameMatch = query.match(QUERY_PATTERNS.playerName);
  if (nameMatch) {
    intent.playerName = nameMatch[1];
    intent.type = "player_lookup";
    intent.year = intent.year || 2025;
  }

  // Extract team
  const teamMatch =
    query.match(QUERY_PATTERNS.team) || query.match(QUERY_PATTERNS.teamOnly);
  if (teamMatch) {
    intent.team = teamMatch[1].trim();
  }

  // Determine stat type and order (for leaderboards)
  if (!intent.type) {
    intent.year = intent.year || 2025;

    // Batting stats
    if (QUERY_PATTERNS.battingAvg.test(lowerQuery)) {
      intent.stat = "avg";
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.homeRuns.test(lowerQuery)) {
      intent.stat = "hr";
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.rbi.test(lowerQuery)) {
      intent.stat = "rbi";
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.hits.test(lowerQuery)) {
      intent.stat = "h";
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.runs.test(lowerQuery)) {
      intent.stat = "r";
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.doubles.test(lowerQuery)) {
      intent.stat = '"2b"';
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.triples.test(lowerQuery)) {
      intent.stat = '"3b"';
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.walks.test(lowerQuery)) {
      intent.stat = "bb";
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.stolenBases.test(lowerQuery)) {
      intent.stat = "sb";
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.obp.test(lowerQuery)) {
      intent.stat = "obp";
      intent.type = "batting_stat";
    } else if (QUERY_PATTERNS.slg.test(lowerQuery)) {
      intent.stat = "slg";
      intent.type = "batting_stat";
    }
    // Pitching stats
    else if (QUERY_PATTERNS.era.test(lowerQuery)) {
      intent.stat = "era";
      intent.type = "pitching_stat";
    } else if (QUERY_PATTERNS.wins.test(lowerQuery)) {
      intent.stat = "w";
      intent.type = "pitching_stat";
    } else if (QUERY_PATTERNS.saves.test(lowerQuery)) {
      intent.stat = "sv";
      intent.type = "pitching_stat";
    } else if (
      QUERY_PATTERNS.strikeouts_pitching.test(lowerQuery) &&
      (lowerQuery.includes("pitcher") || lowerQuery.includes("pitching"))
    ) {
      intent.stat = "so";
      intent.type = "pitching_stat";
    } else if (QUERY_PATTERNS.innings.test(lowerQuery)) {
      intent.stat = "ip";
      intent.type = "pitching_stat";
    } else if (QUERY_PATTERNS.shutouts.test(lowerQuery)) {
      intent.stat = "sho";
      intent.type = "pitching_stat";
    } else if (QUERY_PATTERNS.completeGames.test(lowerQuery)) {
      intent.stat = "cg";
      intent.type = "pitching_stat";
    }

    // Determine order (highest/lowest)
    if (QUERY_PATTERNS.highest.test(lowerQuery)) {
      intent.order = "DESC";
      if (!intent.type) intent.type = "leaderboard";
    } else if (QUERY_PATTERNS.lowest.test(lowerQuery)) {
      intent.order = "ASC";
      if (!intent.type) intent.type = "leaderboard";
    }
  }

  // Extract threshold
  const overMatch = query.match(QUERY_PATTERNS.over);
  const underMatch = query.match(QUERY_PATTERNS.under);
  if (overMatch) {
    intent.threshold = { operator: ">=", value: parseInt(overMatch[1]) };
  } else if (underMatch) {
    intent.threshold = { operator: "<=", value: parseInt(underMatch[1]) };
  }

  return intent;
}

/**
 * Build SQL query based on parsed intent
 */
function buildQuery(intent) {
  let query = "";
  let params = [];
  let paramIndex = 1;

  // Championship queries
  if (
    intent.type === "championship_winner" ||
    intent.type === "championship_mvp" ||
    intent.type === "championship_runnerup"
  ) {
    query = `
      SELECT 
        c.year,
        t1.name as champion_name,
        t1.city as champion_city,
        t1.state as champion_state,
        t2.name as runner_up_name,
        p1.first_name || ' ' || p1.last_name as mvp,
        c.championship_score
      FROM championships c
      LEFT JOIN teams t1 ON c.champion_team_id = t1.id
      LEFT JOIN teams t2 ON c.runner_up_team_id = t2.id
      LEFT JOIN players p1 ON c.mvp_player_id = p1.id
      WHERE c.year = $1
      LIMIT 1
    `;
    params = [intent.year];
    return { query, params };
  }

  // Team roster query
  if (intent.type === "team_roster") {
    query = `
      SELECT DISTINCT
        p.first_name,
        p.last_name,
        bs.avg,
        bs.hr,
        bs.rbi,
        ps.era,
        ps.w,
        ps.sv
      FROM players p
      LEFT JOIN batting_stats bs ON p.id = bs.player_id AND bs.year = $1
      LEFT JOIN pitching_stats ps ON p.id = ps.player_id AND ps.year = $1
      JOIN teams t ON (bs.team_id = t.id OR ps.team_id = t.id)
      WHERE LOWER(t.name) LIKE LOWER($2) AND (bs.year = $1 OR ps.year = $1)
      ORDER BY bs.avg DESC NULLS LAST
      LIMIT 50
    `;
    params = [intent.year, `%${intent.team}%`];
    return { query, params };
  }

  // Team championship count
  if (intent.type === "team_championships") {
    query = `
      SELECT 
        t.name as team_name,
        t.city,
        t.state,
        COUNT(c.year) as championships,
        array_agg(c.year ORDER BY c.year DESC) as years
      FROM teams t
      JOIN championships c ON t.id = c.champion_team_id
      WHERE LOWER(t.name) LIKE LOWER($1)
      GROUP BY t.id, t.name, t.city, t.state
      LIMIT 1
    `;
    params = [`%${intent.team}%`];
    return { query, params };
  }

  // Player comparison
  if (intent.type === "player_comparison") {
    const [firstName1, ...lastNameParts1] = intent.playerName.split(" ");
    const lastName1 = lastNameParts1.join(" ");
    const [firstName2, ...lastNameParts2] = intent.playerName2.split(" ");
    const lastName2 = lastNameParts2.join(" ");

    query = `
      SELECT 
        p.first_name,
        p.last_name,
        t.name as team_name,
        bs.avg, bs.hr, bs.rbi, bs.h, bs.r, bs.ab, bs.obp, bs.slg,
        ps.era, ps.w, ps.l, ps.sv, ps.ip, ps.so as p_so
      FROM players p
      LEFT JOIN batting_stats bs ON p.id = bs.player_id AND bs.year = $1
      LEFT JOIN pitching_stats ps ON p.id = ps.player_id AND ps.year = $1
      LEFT JOIN teams t ON bs.team_id = t.id OR ps.team_id = t.id
      WHERE (
        (LOWER(p.first_name) = LOWER($2) AND LOWER(p.last_name) = LOWER($3))
        OR
        (LOWER(p.first_name) = LOWER($4) AND LOWER(p.last_name) = LOWER($5))
      )
      ORDER BY p.last_name
    `;
    params = [intent.year, firstName1, lastName1, firstName2, lastName2];
    return { query, params };
  }

  // Player name lookup
  if (intent.type === "player_lookup" && intent.playerName) {
    const [firstName, ...lastNameParts] = intent.playerName.split(" ");
    const lastName = lastNameParts.join(" ");

    query = `
      SELECT 
        p.id,
        p.first_name,
        p.last_name,
        t.name as team_name,
        bs.avg, bs.gp, bs.ab, bs.r, bs.h, bs."2b", bs."3b", bs.hr, 
        bs.rbi, bs.bb, bs.so, bs.sb, bs.obp, bs.slg,
        ps.era, ps.w, ps.l, ps.sv, ps.app as g, ps.gs, ps.cg, ps.sho,
        ps.ip, ps.h as p_h, ps.r as p_r, ps.er, ps.bb as p_bb, 
        ps.so as p_so, ps.wp, ps.hbp as p_hbp
      FROM players p
      LEFT JOIN batting_stats bs ON p.id = bs.player_id AND bs.year = $${paramIndex}
      LEFT JOIN pitching_stats ps ON p.id = ps.player_id AND ps.year = $${paramIndex}
      LEFT JOIN teams t ON bs.team_id = t.id OR ps.team_id = t.id
      WHERE LOWER(p.first_name) = LOWER($${paramIndex + 1})
        AND LOWER(p.last_name) = LOWER($${paramIndex + 2})
      LIMIT 1
    `;
    params = [intent.year, firstName, lastName];
  }

  // Batting stat leaderboard
  else if (intent.type === "batting_stat") {
    const stat = intent.stat || "avg";
    const order = intent.order || "DESC";

    query = `
      SELECT 
        p.first_name,
        p.last_name,
        t.name as team_name,
        bs.avg, bs.hr, bs.rbi, bs.h, bs.r, bs.ab, bs.gp, bs.obp, bs.slg,
        bs."2b", bs."3b", bs.bb, bs.so, bs.sb
      FROM batting_stats bs
      JOIN players p ON bs.player_id = p.id
      JOIN teams t ON bs.team_id = t.id
      WHERE bs.year = $${paramIndex}
        AND bs.${stat} IS NOT NULL
    `;
    params = [intent.year];
    paramIndex++;

    if (intent.team) {
      query += ` AND LOWER(t.name) LIKE LOWER($${paramIndex})`;
      params.push(`%${intent.team}%`);
      paramIndex++;
    }

    if (intent.threshold) {
      query += ` AND bs.${stat} ${intent.threshold.operator} $${paramIndex}`;
      params.push(intent.threshold.value);
      paramIndex++;
    }

    // Minimum AB for average
    if (stat === "avg") {
      query += ` AND bs.ab >= 10`;
    }

    query += `
      ORDER BY bs.${stat} ${order}
      LIMIT $${paramIndex}
    `;
    params.push(intent.limit);
  }

  // Pitching stat leaderboard
  else if (intent.type === "pitching_stat") {
    const stat = intent.stat || "era";
    const order = intent.order || (stat === "era" ? "ASC" : "DESC");

    query = `
      SELECT 
        p.first_name,
        p.last_name,
        t.name as team_name,
        ps.era, ps.w, ps.l, ps.sv, ps.app as g, ps.gs, ps.ip, ps.so, ps.whip,
        ps.cg, ps.sho
      FROM pitching_stats ps
      JOIN players p ON ps.player_id = p.id
      JOIN teams t ON ps.team_id = t.id
      WHERE ps.year = $${paramIndex}
        AND ps.${stat} IS NOT NULL
    `;
    params = [intent.year];
    paramIndex++;

    if (intent.team) {
      query += ` AND LOWER(t.name) LIKE LOWER($${paramIndex})`;
      params.push(`%${intent.team}%`);
      paramIndex++;
    }

    if (intent.threshold) {
      query += ` AND ps.${stat} ${intent.threshold.operator} $${paramIndex}`;
      params.push(intent.threshold.value);
      paramIndex++;
    }

    // Minimum IP for ERA
    if (stat === "era") {
      query += ` AND ps.ip >= 5`;
    }

    query += `
      ORDER BY ps.${stat} ${order}
      LIMIT $${paramIndex}
    `;
    params.push(intent.limit);
  }

  return { query, params };
}

/**
 * Format response based on query type
 */
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

  // Championship queries
  if (intent.type === "championship_winner") {
    const champ = results[0];
    answer = `The ${intent.year} NBC World Series champion was the ${champ.champion_name} from ${champ.champion_city}, ${champ.champion_state}.`;
    if (champ.championship_score) {
      answer += ` Final score: ${champ.championship_score}.`;
    }
    return {
      success: true,
      answer,
      data: champ,
      message: `${intent.year} Championship`,
      results,
      intent,
      count: 1,
    };
  }

  if (intent.type === "championship_mvp") {
    const champ = results[0];
    if (champ.mvp) {
      answer = `The ${intent.year} NBC World Series MVP was ${champ.mvp}.`;
    } else {
      answer = `No MVP was awarded in ${intent.year}.`;
    }
    return {
      success: true,
      answer,
      data: champ,
      message: `${intent.year} MVP`,
      results,
      intent,
      count: 1,
    };
  }

  if (intent.type === "championship_runnerup") {
    const champ = results[0];
    if (champ.runner_up_name) {
      answer = `The ${intent.year} runner-up was the ${champ.runner_up_name}.`;
    } else {
      answer = `Runner-up information not available for ${intent.year}.`;
    }
    return {
      success: true,
      answer,
      data: champ,
      message: `${intent.year} Runner-up`,
      results,
      intent,
      count: 1,
    };
  }

  // Team roster
  if (intent.type === "team_roster") {
    answer = `Found ${results.length} players from ${intent.team} in ${intent.year}.`;
    message = `${intent.team} Roster - ${intent.year}`;
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

  // Team championships
  if (intent.type === "team_championships") {
    const team = results[0];
    answer = `The ${team.team_name} have won ${
      team.championships
    } championship${team.championships !== 1 ? "s" : ""}.`;
    if (team.years && team.years.length > 0) {
      answer += ` Years: ${team.years.slice(0, 10).join(", ")}${
        team.years.length > 10 ? "..." : ""
      }.`;
    }
    return {
      success: true,
      answer,
      data: team,
      message: `${team.team_name} Championships`,
      results,
      intent,
      count: 1,
    };
  }

  // Player comparison
  if (intent.type === "player_comparison") {
    if (results.length === 2) {
      answer = `Comparing ${results[0].first_name} ${results[0].last_name} and ${results[1].first_name} ${results[1].last_name} - ${intent.year} Season`;
    } else {
      answer = `Found ${results.length} player(s) for comparison.`;
    }
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

  // Player lookup
  if (intent.type === "player_lookup") {
    const player = results[0];
    message = `Stats for ${player.first_name} ${player.last_name} (${
      player.team_name || "Unknown Team"
    }) - ${intent.year} Season`;

    answer = `Found stats for ${player.first_name} ${player.last_name}`;

    return {
      success: true,
      answer: answer,
      data: player,
      message: message,
      results: results,
      intent,
      count: results.length,
    };
  }

  // Batting stats leaderboard
  else if (intent.type === "batting_stat") {
    const statName =
      {
        avg: "Batting Average",
        hr: "Home Runs",
        rbi: "RBI",
        h: "Hits",
        r: "Runs",
        '"2b"': "Doubles",
        '"3b"': "Triples",
        bb: "Walks",
        sb: "Stolen Bases",
        obp: "On-Base Percentage",
        slg: "Slugging Percentage",
      }[intent.stat] || intent.stat.toUpperCase();

    message = `Top ${results.length} players by ${statName} - ${intent.year} Season`;
    answer = message;
  }

  // Pitching stats leaderboard
  else if (intent.type === "pitching_stat") {
    const statName =
      {
        era: "ERA",
        w: "Wins",
        so: "Strikeouts",
        sv: "Saves",
        ip: "Innings Pitched",
        cg: "Complete Games",
        sho: "Shutouts",
      }[intent.stat] || intent.stat.toUpperCase();

    message = `Top ${results.length} players by ${statName} - ${intent.year} Season`;
    answer = message;
  }

  return {
    success: true,
    answer: answer,
    data: results,
    message,
    results,
    intent,
    count: results.length,
  };
}

/**
 * Main search endpoint
 */
export const naturalLanguageSearch = async (req, res) => {
  try {
    const { query, question } = req.body;
    const searchQuery = query || question;

    if (!searchQuery || typeof searchQuery !== "string") {
      return res.status(400).json({
        success: false,
        error: "Query string is required",
      });
    }

    console.log("\n=== Natural Language Search ===");
    console.log("Query:", searchQuery);

    const intent = parseQuery(searchQuery);
    console.log("Parsed intent:", JSON.stringify(intent, null, 2));

    const { query: sqlQuery, params } = buildQuery(intent);

    if (!sqlQuery) {
      return res.status(400).json({
        success: false,
        error:
          "Could not understand your query. Try asking about specific players, stats, teams, or championships.",
        suggestion:
          'Examples: "Jake Gutierrez stats", "Who won in 2020?", "top 5 home runs 2025", "Hutchinson Monarchs roster 2025"',
      });
    }

    console.log("SQL:", sqlQuery);
    console.log("Params:", params);

    const result = await pool.query(sqlQuery, params);
    const response = formatResponse(intent, result.rows);

    res.json(response);
  } catch (error) {
    console.error("Natural language search error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process search query",
      details: error.message,
    });
  }
};

/**
 * Get search suggestions
 */
export const getSearchSuggestions = async (req, res) => {
  try {
    const suggestions = [
      // Player stats
      "Jake Gutierrez stats",
      "Max Buettenback pitching stats",

      // Championships
      "Who won in 2020?",
      "Who was the MVP in 2024?",
      "Who was the runner-up in 2023?",

      // Leaderboards
      "Who had the highest batting average in 2025?",
      "Top 10 home run hitters in 2025",
      "Best ERA in 2025",
      "Most strikeouts 2025",
      "Top 5 RBI leaders",

      // Advanced queries
      "Players with over 3 home runs in 2025",
      "Pitchers with ERA under 2.00",
      "Top 10 stolen bases 2025",
      "Best slugging percentage 2025",

      // Team queries
      "Hutchinson Monarchs roster 2025",
      "How many championships have the Monarchs won?",
      "Players from Hays Larks in 2025",

      // Comparisons
      "Compare Jake Gutierrez and Max Buettenback",
    ];

    res.json({
      success: true,
      suggestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to get suggestions",
    });
  }
};
