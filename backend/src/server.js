// backend/src/server.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const morgan = require("morgan");

const pool = require("./config/database");

// External routers (still mounted after our inline search handlers)
const nbcImport = require("./routes/nbcImport");
const authRouter = require("./routes/auth");
const championshipsRouter = require("./routes/championships");
const tournamentsRouter = require("./routes/tournaments");
const teamsRouter = require("./routes/teams");
const hallOfFameRouter = require("./routes/hallOfFame");
const mlbAlumniRouter = require("./routes/mlbAlumni");
const recordsRouter = require("./routes/records");
const playersRouter = require("./routes/players");
const adminRouter = require("./routes/admin");
const statisticsRouter = require("./routes/statistics");

const app = express();
const port = process.env.PORT || 5000;

/* ---------------------------------------
   Trust proxy
---------------------------------------- */
if (process.env.TRUST_PROXY) {
  app.set(
    "trust proxy",
    process.env.TRUST_PROXY === "true" ? 1 : Number(process.env.TRUST_PROXY)
  );
}

/* -------------------
   Security / limits
-------------------- */
app.disable("x-powered-by");
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(
  rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
    max: Number(process.env.RATE_LIMIT_MAX || 120),
    standardHeaders: true,
    legacyHeaders: false,
  })
);

const ALLOWED_METHODS = new Set([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "OPTIONS",
  "HEAD",
]);
app.use((req, res, next) => {
  if (!ALLOWED_METHODS.has(req.method)) return res.sendStatus(405);
  next();
});

const badPath = (u) =>
  /\.\.|%2e%2e|%uff0e|\/\.|\\\.|%5c%2e%5c|%5c\.\.|%\w{2}\.\.%/i.test(u);
app.use((req, res, next) => {
  let raw = req.url || "";
  try {
    raw = decodeURIComponent(raw);
  } catch {}
  if (badPath(raw)) return res.sendStatus(400);
  next();
});

/* -------------
   CORS + JSON
-------------- */
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  process.env.FRONTEND_URL,
  process.env.FRONTEND_PROD_URL,
  process.env.FRONTEND_DEV_URL,
  process.env.FRONTEND_ADMIN_URL,
  process.env.FRONTEND_ADMIN_PROD_URL,
  process.env.FRONTEND_ADMIN_DEV_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);

// CRITICAL: Must come BEFORE routes
app.use(express.json({ limit: process.env.JSON_LIMIT || "200kb" }));
app.use(express.urlencoded({ extended: true }));

/* -----------------
   Compression + log
------------------ */
app.use(compression());
const noisy404 = [
  /win\.ini/i,
  /etc\/passwd/i,
  /(wls|weblogic|solr|drupal|wp-?|owa|orion|nifi|kylin|airflow|apex|ords|tomcat|confluence|geoserver)/i,
  /(login|console|admin|portal|webconsole|index\.(jsp|asp|do))/i,
];
app.use(
  morgan("combined", {
    skip: (req, res) =>
      res.statusCode === 404 && noisy404.some((rx) => rx.test(req.url)),
  })
);

/* ----------------------
   Small misc endpoints
----------------------- */
app.get("/favicon.ico", (_req, res) => res.sendStatus(204));
app.get("/robots.txt", (_req, res) =>
  res.type("text/plain").send("User-agent: *\nDisallow: /\n")
);
app.use(express.static("public", { dotfiles: "ignore", index: false }));

/* ---------------------------------
   Public cache hints for hot GETs
---------------------------------- */
const cacheablePrefixes = [
  "/api/statistics/overview",
  "/api/championships",
  "/api/teams",
  "/api/hall-of-fame",
  "/api/records",
];
app.use((req, res, next) => {
  if (
    req.method === "GET" &&
    cacheablePrefixes.some((p) => req.path.startsWith(p))
  ) {
    res.setHeader(
      "Cache-Control",
      "public, max-age=600, stale-while-revalidate=60"
    );
  }
  next();
});

/* --------------------------
   Health check with DB ping
--------------------------- */
app.get("/health", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT NOW() as now");
    res.json({
      ok: true,
      service: "nbc-world-series-api",
      env: process.env.NODE_ENV,
      dbTime: rows[0].now,
      allowedOrigins,
    });
  } catch (err) {
    console.error("Health DB ping failed:", err.message);
    res.status(500).json({
      ok: false,
      service: "nbc-world-series-api",
      env: process.env.NODE_ENV,
      error: "Database not reachable",
    });
  }
});

/* ============================================================
   INLINE SMART SEARCH  (registered BEFORE legacy routers)
   - /api/search/ping
   - /api/search/ask        (preferred; overrides legacy)
   - /api/search-team/ask   (collision-proof alias)
============================================================ */

const strong = (s) => `**${s}**`;
const norm = (s) => String(s || "").trim();

// intents - ORDER MATTERS! More specific patterns first
// FIXED: Added (ion)? to match both "champ" and "champion"
const looksLikeFirstChamp = (q) =>
  /\b(first\s+(champ(ion(ship)?)?|winner|tournament)|earliest|inaugural)\b/i.test(
    q
  );

// FIXED: Made "championship" optional in streak queries
const looksLikeStreak = (q) =>
  /\b(champ(ionship)?\s*)?(streak|consecutive|in\s+a\s+row|back.?to.?back)\b/i.test(
    q
  );

// FIXED: Made "championship" optional and added more variations
const looksLikeMostChamps = (q) =>
  /\b(most\s+(champ(ionship)?s?|titles?)|who\s+(has|have)\s+won\s+the\s+most|team\s+with\s+most)\b/i.test(
    q
  );

const looksLikeRecent = (q) =>
  /\b(recent|latest|last.*champ(ion)?)\b/i.test(q) &&
  !/\b(when|what\s+year)\b/i.test(q);

const looksLikeLocation = (q) =>
  /\b(where|location|venue|stadium|held|wichita)\b/i.test(q);

const looksLikeTeamChampCount = (q) =>
  /\bhow\s+many\s+(time|champ)/i.test(q) &&
  /\b(champ|title|won|crown)/i.test(q);

const looksLikeMvp = (q) => /\b(mvp|most\s+valuable\s+player)\b/i.test(q);

const looksLikeWinner = (q) =>
  /\b(who\s+won|champ(ion(ship)?)?|winner)\b/i.test(q);

const looksLikeTopBatters = (q) =>
  /\b(top\s+batters?|batting\s+leaders?|hitting\s+leaders?)\b/i.test(q);

const looksLikeTopPitchers = (q) =>
  /\b(top\s+pitchers?|pitching\s+leaders?)\b/i.test(q);

function extractYear(q) {
  const m = String(q || "").match(/\b(19\d{2}|20\d{2})\b/);
  return m ? Number(m[1]) : null;
}

// DB helpers
async function getChampionshipByYear(year) {
  const { rows } = await pool.query(
    `SELECT year, champion as champion_name, runner_up as runner_up_name, mvp,
            city as champion_city, state, score as championship_score
       FROM championships
      WHERE year = $1
      LIMIT 1`,
    [year]
  );
  return rows[0] || null;
}

async function findTeamByName(q) {
  const cleaned = norm(q)
    .replace(
      /\b(how|many|time[s]?|have|has|been|crown(ed)?|won|win[s]?|the|a|an|is|are|champ(ion|ionship|ionships)?|title[s]?|by|any|team|which|did|do|does|in|of|for)\b/gi,
      " "
    )
    .replace(/\?/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return null;

  const { rows } = await pool.query(
    `SELECT id, name, city, state, championships_won
       FROM teams
      WHERE name ILIKE $1
      ORDER BY length(name) ASC
      LIMIT 1`,
    [`%${cleaned}%`]
  );
  if (rows[0]) return rows[0];

  const token = cleaned.split(" ").slice(0, 2).join(" ");
  if (!token) return null;

  const alt = await pool.query(
    `SELECT id, name, city, state, championships_won
       FROM teams
      WHERE name ILIKE $1
      ORDER BY length(name) ASC
      LIMIT 1`,
    [`%${token}%`]
  );
  return alt.rows[0] || null;
}

async function getTeamChampionshipYears(teamName) {
  const { rows } = await pool.query(
    `SELECT year, runner_up as runner_up_name, score as championship_score, mvp
       FROM championships
      WHERE champion ILIKE $1
   ORDER BY year DESC`,
    [`%${teamName}%`]
  );
  return rows;
}

async function findPlayerByName(name) {
  if (!name) return null;
  const exact = await pool.query(
    `SELECT id, name FROM players WHERE name = $1 LIMIT 1`,
    [name]
  );
  if (exact.rows[0]) return exact.rows[0];
  const fuzzy = await pool.query(
    `SELECT id, name FROM players WHERE name ILIKE $1 ORDER BY length(name) ASC LIMIT 1`,
    [`%${name}%`]
  );
  return fuzzy.rows[0] || null;
}

async function getPlayerSeasonBatting(playerId, year) {
  const { rows } = await pool.query(
    `SELECT games, plate_appearances, at_bats, runs, hits, doubles, triples,
            home_runs, rbi, walks, strikeouts, stolen_bases, caught_stealing,
            batting_avg, obp, slg, ops, team_id
       FROM player_season_batting
      WHERE player_id = $1 AND year = $2
      LIMIT 1`,
    [playerId, year]
  );
  return rows[0] || null;
}

async function getPlayerSeasonPitching(playerId, year) {
  const { rows } = await pool.query(
    `SELECT games, starts, innings_pitched, hits_allowed, runs_allowed,
            earned_runs, walks_allowed, strikeouts, home_runs_allowed,
            wins, losses, saves, era, whip, fip, team_id
       FROM player_season_pitching
      WHERE player_id = $1 AND year = $2
      LIMIT 1`,
    [playerId, year]
  );
  return rows[0] || null;
}

async function getTeamName(teamId) {
  if (!teamId) return null;
  const { rows } = await pool.query(
    `SELECT name FROM teams WHERE id = $1 LIMIT 1`,
    [teamId]
  );
  return rows[0]?.name || null;
}

async function getTopBatters(year, limit = 10, minPA = 10) {
  const { rows } = await pool.query(
    `SELECT psb.*, p.name AS player_name, t.name AS team_name
       FROM player_season_batting psb
       JOIN players p ON p.id = psb.player_id
  LEFT JOIN teams   t ON t.id = psb.team_id
      WHERE psb.year = $1 AND COALESCE(psb.plate_appearances,0) >= $2
   ORDER BY psb.batting_avg DESC NULLS LAST, psb.ops DESC NULLS LAST
      LIMIT $3`,
    [year, minPA, limit]
  );
  return rows;
}

async function getTopPitchers(year, limit = 10, minIP = 5) {
  const { rows } = await pool.query(
    `SELECT psp.*, p.name AS player_name, t.name AS team_name
       FROM player_season_pitching psp
       JOIN players p ON p.id = psp.player_id
  LEFT JOIN teams   t ON t.id = psp.team_id
      WHERE psp.year = $1 AND COALESCE(psp.innings_pitched,0) >= $2
   ORDER BY psp.era ASC NULLS LAST, psp.whip ASC NULLS LAST
      LIMIT $3`,
    [year, minIP, limit]
  );
  return rows;
}

// Sanity ping
app.get("/api/search/ping", (_req, res) =>
  res.json({ ok: true, handler: "inline-smart-search" })
);

// Common handler used by both routes below
async function smartSearchHandler(req, res) {
  const questionRaw = req.body?.question || "";
  const question = norm(questionRaw).toLowerCase();
  const year = extractYear(question);

  console.log("🔍 Backend received question:", questionRaw);
  console.log("🔍 Normalized question:", question);
  console.log("🔍 Extracted year:", year);

  try {
    // === CHECK IN ORDER: Most specific patterns FIRST ===

    // === FIRST CHAMPION === (must come before generic "winner")
    if (looksLikeFirstChamp(question)) {
      console.log("✅ Matched: firstChampion");
      const result = await pool.query(`
        SELECT year, champion, city, state
        FROM championships
        WHERE year != 2020
        ORDER BY year ASC
        LIMIT 1
      `);

      if (result.rows.length > 0) {
        const first = result.rows[0];
        return res.json({
          success: true,
          answer: `🏆 The first NBC World Series champion was the **${first.champion}** from ${first.city}, ${first.state} in **${first.year}**.`,
          data: first,
          queryType: "firstChampion",
        });
      }
    }

    // === CHAMPIONSHIP STREAKS ===
    if (looksLikeStreak(question)) {
      console.log("✅ Matched: championshipStreaks");
      const result = await pool.query(`
        WITH championship_data AS (
          SELECT 
            champion as name,
            year,
            year - ROW_NUMBER() OVER (PARTITION BY champion ORDER BY year) as streak_group
          FROM championships
          WHERE year != 2020
        ),
        longest_streaks AS (
          SELECT 
            name,
            MIN(year) as start_year,
            MAX(year) as end_year,
            COUNT(*) as consecutive_wins
          FROM championship_data
          GROUP BY name, streak_group
        )
        SELECT * FROM longest_streaks
        WHERE consecutive_wins > 1
        ORDER BY consecutive_wins DESC, end_year DESC
        LIMIT 10
      `);

      if (result.rows.length > 0) {
        return res.json({
          success: true,
          answer: `🏆 **Longest Championship Streaks:**`,
          data: result.rows,
          queryType: "championshipStreaks",
        });
      } else {
        return res.json({
          success: true,
          answer: `No championship streaks found.`,
          data: [],
          queryType: "championshipStreaks",
        });
      }
    }

    // === MOST CHAMPIONSHIPS ===
    if (looksLikeMostChamps(question)) {
      console.log("✅ Matched: mostChampionships");
      const result = await pool.query(`
        SELECT 
          champion as name,
          COUNT(*) as championships,
          array_agg(year ORDER BY year) as years
        FROM championships
        WHERE year != 2020
        GROUP BY champion
        ORDER BY championships DESC, name
        LIMIT 10
      `);

      if (result.rows.length > 0) {
        return res.json({
          success: true,
          answer: `🏆 Teams with the most NBC World Series championships:`,
          data: result.rows,
          queryType: "mostChampionships",
        });
      }
    }

    // === RECENT CHAMPIONS ===
    if (looksLikeRecent(question)) {
      console.log("✅ Matched: recentChampions");
      const result = await pool.query(`
        SELECT 
          year,
          champion,
          score as championship_score,
          mvp
        FROM championships
        WHERE year != 2020
        ORDER BY year DESC
        LIMIT 5
      `);

      if (result.rows.length > 0) {
        return res.json({
          success: true,
          answer: `🏆 Recent NBC World Series Champions:`,
          data: result.rows,
          queryType: "recentChampions",
        });
      }
    }

    // === LOCATION ===
    if (looksLikeLocation(question)) {
      console.log("✅ Matched: location");
      return res.json({
        success: true,
        answer: `🏟️ **NBC World Series Location**\n\nThe tournament has been held in **Wichita, Kansas** since **1935**.\n\n📍 **Current Venue**: Riverfront Stadium (formerly Lawrence-Dumont Stadium)\n\n🎟️ The tournament typically runs in late July through early August each year.`,
        data: {
          city: "Wichita",
          state: "Kansas",
          since: 1935,
          venue: "Riverfront Stadium",
        },
        queryType: "location",
      });
    }

    // === TEAM CHAMPIONSHIP COUNT ===
    if (looksLikeTeamChampCount(question)) {
      console.log("✅ Matched: teamChampionshipHistory");
      const team = await findTeamByName(questionRaw);
      if (!team) {
        return res.json({
          answer:
            'I couldn\'t identify the team. Try the full team name, e.g. "How many times have Hutchinson Monarchs won the championship?"',
          queryType: "teamChampionshipHistory",
          data: null,
        });
      }

      const wins = await getTeamChampionshipYears(team.name);
      const count = wins.length;
      const years = wins.map((r) => r.year).sort((a, b) => b - a);

      const highlights = wins
        .slice(0, 5)
        .map((r) => {
          const parts = [`${r.year}`];
          if (r.championship_score) parts.push(r.championship_score);
          if (r.runner_up_name) parts.push(`vs ${r.runner_up_name}`);
          if (r.mvp) parts.push(`MVP: ${r.mvp}`);
          return parts.join(" • ");
        })
        .join(" | ");

      return res.json({
        answer: `${strong(team.name)} have won the championship ${strong(
          String(count)
        )} ${count === 1 ? "time" : "times"}${
          years.length ? ` (Years: ${years.join(", ")})` : ""
        }${highlights ? `.  Highlights — ${highlights}.` : ""}`,
        queryType: "teamChampionshipHistory",
        data: {
          team: team.name,
          championships_won: count,
          years: wins.map((r) => ({
            year: r.year,
            runner_up: r.runner_up_name || null,
            score: r.championship_score || null,
            mvp: r.mvp || null,
          })),
        },
      });
    }

    // === MVP BY YEAR ===
    if (year && looksLikeMvp(question)) {
      console.log("✅ Matched: mvp by year");
      const champ = await getChampionshipByYear(year);
      if (!champ) {
        return res.json({
          answer: `No championship record found for ${year}.`,
          queryType: "mvp",
          data: null,
          extra: { seasonYear: year },
        });
      }

      const mvpName = champ.mvp || null;
      let mvpStats = null;
      let playerResolved = null;

      if (mvpName) {
        playerResolved = await findPlayerByName(mvpName);
        if (playerResolved?.id) {
          const [bat, pit] = await Promise.all([
            getPlayerSeasonBatting(playerResolved.id, year),
            getPlayerSeasonPitching(playerResolved.id, year),
          ]);
          if (bat?.team_id) bat.team_name = await getTeamName(bat.team_id);
          if (pit?.team_id) pit.team_name = await getTeamName(pit.team_id);
          mvpStats = {};
          if (bat) mvpStats.batting = bat;
          if (pit) mvpStats.pitching = pit;
        }
      }

      const [leadersBat, leadersPit] = await Promise.all([
        getTopBatters(year, 10, 10),
        getTopPitchers(year, 10, 5),
      ]);

      return res.json({
        answer: `${strong("MVP")} in ${year}: ${strong(mvpName || "Unknown")}${
          champ.champion_name ? ` (${champ.champion_name})` : ""
        }${
          champ.championship_score
            ? ` — Final: ${champ.championship_score}`
            : ""
        }`,
        queryType: "mvp",
        data: {
          year: champ.year,
          mvp: mvpName,
          champion: champ.champion_name || null,
          runner_up: champ.runner_up_name || null,
          final_score: champ.championship_score || null,
        },
        extra: {
          seasonYear: year,
          mvpPlayer: playerResolved || null,
          mvpStats,
          leaders: { topBatters: leadersBat, topPitchers: leadersPit },
        },
      });
    }

    // === WINNER BY YEAR === (comes AFTER first champion check)
    if (year && looksLikeWinner(question)) {
      console.log("✅ Matched: winner by year", year);
      const champ = await getChampionshipByYear(year);
      if (!champ) {
        return res.json({
          answer: `No winner on record for ${year}.`,
          queryType: "winner",
          data: null,
          extra: { seasonYear: year },
        });
      }
      const [leadersBat, leadersPit] = await Promise.all([
        getTopBatters(year, 10, 10),
        getTopPitchers(year, 10, 5),
      ]);

      return res.json({
        answer: `Champion in ${year}: ${strong(
          champ.champion_name || "Unknown"
        )}${
          champ.runner_up_name ? ` — Runner-up: ${champ.runner_up_name}` : ""
        }${
          champ.championship_score
            ? ` — Final: ${champ.championship_score}`
            : ""
        }${champ.mvp ? ` — MVP: ${strong(champ.mvp)}` : ""}`,
        queryType: "winner",
        data: {
          year: champ.year,
          champion: champ.champion_name || null,
          runner_up: champ.runner_up_name || null,
          mvp: champ.mvp || null,
          final_score: champ.championship_score || null,
        },
        extra: {
          seasonYear: year,
          leaders: { topBatters: leadersBat, topPitchers: leadersPit },
        },
      });
    }

    // === TOP BATTERS ===
    if (year && looksLikeTopBatters(question)) {
      console.log("✅ Matched: topBatters");
      const rows = await getTopBatters(year, 50, 10);
      return res.json({
        answer: `Top batters in ${strong(String(year))}`,
        queryType: "topBatters",
        data: rows,
        extra: { seasonYear: year },
      });
    }

    // === TOP PITCHERS ===
    if (year && looksLikeTopPitchers(question)) {
      console.log("✅ Matched: topPitchers");
      const rows = await getTopPitchers(year, 50, 5);
      return res.json({
        answer: `Top pitchers in ${strong(String(year))}`,
        queryType: "topPitchers",
        data: rows,
        extra: { seasonYear: year },
      });
    }

    // === FALLBACK ===
    console.log("❌ No match found, using fallback");
    return res.json({
      answer:
        'Try: "First champion", "Championship streaks", "Most championships", "Recent champions", "Who won in 2024?", "MVP 2024", or "Where is the tournament held?"',
      queryType: "unknown",
      data: null,
    });
  } catch (err) {
    console.error("Smart search error:", err);
    return res
      .status(500)
      .json({ error: "Search failed", message: err.message });
  }
}

// Register the endpoints (BEFORE legacy routers)
app.post("/api/search/ask", smartSearchHandler);
app.post("/api/search-team/ask", smartSearchHandler);

/* -------
   Other routes
-------- */
app.use(authRouter);
app.use("/api/championships", championshipsRouter);
app.use("/api/tournaments", tournamentsRouter);
app.use("/api/teams", teamsRouter);
app.use("/api/hall-of-fame", hallOfFameRouter);
app.use("/api/mlb-alumni", mlbAlumniRouter);
app.use("/api/records", recordsRouter);
app.use("/api/players", playersRouter);

app.use("/api", statisticsRouter);
app.use("/api", nbcImport);
app.use(adminRouter);

/* ----
   404
----- */
app.use((req, res) => res.status(404).json({ error: "Not found" }));

/* ---------------
   Error handler
---------------- */
app.use((err, _req, res, _next) => {
  console.error("Server error:", err && err.message);
  res.status(500).json({ error: "Something went wrong!" });
});

/* ---------------
   Route inventory (console)
---------------- */
function listRoutes() {
  const out = [];
  const walk = (stack) => {
    (stack || []).forEach((l) => {
      if (l.route && l.route.path) {
        const methods = Object.keys(l.route.methods).map((m) =>
          m.toUpperCase()
        );
        out.push(`${methods.join(",").padEnd(12)} ${l.route.path}`);
      } else if (l.name === "router" && l.handle && l.handle.stack) {
        walk(l.handle.stack);
      }
    });
  };
  walk(app._router.stack);
  console.log("=== Registered routes ===");
  out.sort().forEach((line) => console.log(line));
  console.log("=========================");
}

/* -----
   Boot
------ */
app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
  listRoutes();
});
