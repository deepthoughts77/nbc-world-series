import { pool } from "../db.js";

/**
 * Natural Language Search Controller
 * Handles queries like:
 * - "Jake Gutierrez stats"
 * - "Who had the highest batting average in 2025?"
 * - "Show me all pitchers from Hutchinson Monarchs"
 * - "Players with over 10 home runs"
 */

// Query intent patterns
const QUERY_PATTERNS = {
  // Player name search
  playerName: /\b([A-Z][a-z]+\s+[A-Z][a-z]+)\b/,

  // Stat queries
  highest: /highest|best|top|most|leading/i,
  lowest: /lowest|worst|fewest/i,

  // Stat types
  battingAvg: /batting average|avg|ba\b/i,
  homeRuns: /home runs?|hr\b|homers/i,
  rbi: /rbi|runs batted in/i,
  hits: /\bhits?\b|\bh\b/i,
  runs: /\bruns?\b|\br\b/i,
  era: /\bera\b|earned run average/i,
  strikeouts: /strikeouts?|so\b|k's/i,
  wins: /\bwins?\b|\bw\b/i,
  saves: /\bsaves?\b|sv\b/i,

  // Team names
  team: /(?:from|for|on)\s+([A-Z][a-z\s]+(?:Monarchs|Larks|Foresters|Studs|Stars|Cannons|Oilers|Pilots|Bee Jays|Broncos|Heat|Twins|A's|Kraken|Dawgs))/i,

  // Year
  year: /(?:in|for|during)\s+(\d{4})|(\d{4})\s+season/i,

  // Thresholds
  over: /over|above|more than|greater than\s+(\d+)/i,
  under: /under|below|less than|fewer than\s+(\d+)/i,
};

/**
 * Parse natural language query into structured intent
 */
function parseQuery(query) {
  const intent = {
    type: null,
    playerName: null,
    stat: null,
    order: null,
    team: null,
    year: 2025, // Default to 2025
    threshold: null,
    limit: 10,
  };

  const lowerQuery = query.toLowerCase();

  // Extract player name
  const nameMatch = query.match(QUERY_PATTERNS.playerName);
  if (nameMatch) {
    intent.playerName = nameMatch[1];
    intent.type = "player_lookup";
  }

  // Extract year
  const yearMatch = query.match(QUERY_PATTERNS.year);
  if (yearMatch) {
    intent.year = parseInt(yearMatch[1] || yearMatch[2]);
  }

  // Extract team
  const teamMatch = query.match(QUERY_PATTERNS.team);
  if (teamMatch) {
    intent.team = teamMatch[1].trim();
  }

  // Determine stat type and order
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
  } else if (QUERY_PATTERNS.era.test(lowerQuery)) {
    intent.stat = "era";
    intent.type = "pitching_stat";
  } else if (QUERY_PATTERNS.strikeouts.test(lowerQuery)) {
    intent.stat = "so";
    intent.type = "pitching_stat";
  } else if (QUERY_PATTERNS.wins.test(lowerQuery)) {
    intent.stat = "w";
    intent.type = "pitching_stat";
  } else if (QUERY_PATTERNS.saves.test(lowerQuery)) {
    intent.stat = "sv";
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

  // Extract threshold
  const overMatch = query.match(QUERY_PATTERNS.over);
  const underMatch = query.match(QUERY_PATTERNS.under);
  if (overMatch) {
    intent.threshold = { operator: ">", value: parseInt(overMatch[1]) };
  } else if (underMatch) {
    intent.threshold = { operator: "<", value: parseInt(underMatch[1]) };
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
        -- Batting stats
        bs.avg, bs.gp, bs.ab, bs.r, bs.h, bs."2b", bs."3b", bs.hr, 
        bs.rbi, bs.bb, bs.so, bs.sb, bs.obp, bs.slg,
        -- Pitching stats
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
  else if (
    intent.type === "batting_stat" ||
    (intent.type === "leaderboard" &&
      intent.stat &&
      !intent.stat.includes("era"))
  ) {
    const stat = intent.stat || "avg";
    const order = intent.order || "DESC";

    query = `
      SELECT 
        p.first_name,
        p.last_name,
        t.name as team_name,
        bs.avg, bs.hr, bs.rbi, bs.h, bs.r, bs.ab, bs.gp, bs.obp, bs.slg
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

    // Special handling for AVG - require minimum at bats
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
       ps.era, ps.w, ps.l, ps.sv, ps.app as g, ps.gs, ps.ip, ps.so, ps.whip
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

    // Special handling for ERA - require minimum innings pitched
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

  if (intent.type === "player_lookup") {
    const player = results[0];
    message = `Stats for ${player.first_name} ${player.last_name} (${
      player.team_name || "Unknown Team"
    }) - ${intent.year} Season`;

    answer = `Found stats for ${player.first_name} ${player.last_name}`;

    // Format for SearchInterface.jsx
    return {
      success: true,
      answer: answer,
      data: player, // Single player object
      message: message,
      results: results,
      intent,
      count: results.length,
    };
  } else if (intent.type === "batting_stat") {
    const statName =
      {
        avg: "Batting Average",
        hr: "Home Runs",
        rbi: "RBI",
        h: "Hits",
        r: "Runs",
      }[intent.stat] || intent.stat.toUpperCase();

    message = `Top ${results.length} players by ${statName} - ${intent.year} Season`;
    answer = message;
  } else if (intent.type === "pitching_stat") {
    const statName =
      {
        era: "ERA",
        w: "Wins",
        so: "Strikeouts",
        sv: "Saves",
      }[intent.stat] || intent.stat.toUpperCase();

    message = `Top ${results.length} players by ${statName} - ${intent.year} Season`;
    answer = message;
  }

  return {
    success: true,
    answer: answer,
    data: results, // Array of results
    message,
    results,
    intent,
    count: results.length,
  };
}

/**
 * Main search endpoint
 * @route POST /api/search/natural
 */
export const naturalLanguageSearch = async (req, res) => {
  try {
    const { query, question } = req.body; // Accept both
    const searchQuery = query || question;

    if (!searchQuery || typeof searchQuery !== "string") {
      return res.status(400).json({
        success: false,
        error: "Query string is required",
      });
    }

    console.log("\n=== Natural Language Search ===");
    console.log("Query:", searchQuery);

    // Parse the query
    const intent = parseQuery(searchQuery);
    console.log("Parsed intent:", JSON.stringify(intent, null, 2));

    // Build SQL query
    const { query: sqlQuery, params } = buildQuery(intent);

    if (!sqlQuery) {
      return res.status(400).json({
        success: false,
        error:
          "Could not understand your query. Try asking about specific players or stats.",
        suggestion:
          'Examples: "Jake Gutierrez stats", "highest batting average 2025", "pitchers with over 50 strikeouts"',
      });
    }

    console.log("SQL:", sqlQuery);
    console.log("Params:", params);

    // Execute query
    const result = await pool.query(sqlQuery, params);

    // Format response
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
 * @route GET /api/search/suggestions
 */
export const getSearchSuggestions = async (req, res) => {
  try {
    const suggestions = [
      "Jake Gutierrez stats",
      "Who had the highest batting average in 2025?",
      "Show me pitchers with over 50 strikeouts",
      "Players from Hutchinson Monarchs",
      "Top 5 home run hitters",
      "Lowest ERA in 2025",
      "Max Buettenback pitching stats",
      "Players with over 10 home runs",
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
