// backend/src/server.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const morgan = require("morgan");

const pool = require("./config/database");

// ── Gemini (null-safe) ────────────────────────────────────────────────────
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;
const geminiModel = genAI
  ? genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" })
  : null;

// ── External routers ──────────────────────────────────────────────────────
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

// ── Trust proxy ───────────────────────────────────────────────────────────
if (process.env.TRUST_PROXY) {
  app.set(
    "trust proxy",
    process.env.TRUST_PROXY === "true" ? 1 : Number(process.env.TRUST_PROXY),
  );
}

// ── Security / limits ─────────────────────────────────────────────────────
app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
    max: Number(process.env.RATE_LIMIT_MAX || 120),
    standardHeaders: true,
    legacyHeaders: false,
  }),
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

// ── CORS + JSON ───────────────────────────────────────────────────────────
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
  }),
);

app.use(express.json({ limit: process.env.JSON_LIMIT || "200kb" }));
app.use(express.urlencoded({ extended: true }));

// ── Compression + logging ─────────────────────────────────────────────────
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
  }),
);

// ── Misc endpoints ────────────────────────────────────────────────────────
app.get("/favicon.ico", (_req, res) => res.sendStatus(204));
app.get("/robots.txt", (_req, res) =>
  res.type("text/plain").send("User-agent: *\nDisallow: /\n"),
);
app.use(express.static("public", { dotfiles: "ignore", index: false }));

// ── Cache hints ───────────────────────────────────────────────────────────
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
      "public, max-age=600, stale-while-revalidate=60",
    );
  }
  next();
});

// ── Health check ──────────────────────────────────────────────────────────
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
    res
      .status(500)
      .json({
        ok: false,
        service: "nbc-world-series-api",
        env: process.env.NODE_ENV,
        error: "Database not reachable",
      });
  }
});

/* ============================================================
   INLINE SMART SEARCH
   Registered BEFORE legacy routers so it wins route priority.
   queryType values match SearchResults.jsx expectations:
     championship_winner | leaderboard | streaks | championship_mvp
============================================================ */

function extractYear(q) {
  const m = String(q || "").match(/\b(19\d{2}|20\d{2})\b/);
  return m ? Number(m[1]) : null;
}

// ── DB helpers (use actual schema) ────────────────────────────────────────

/** Championships table uses champion_team_id FK — join to get name */
async function getChampionshipByYear(year) {
  const { rows } = await pool.query(
    `SELECT c.year,
            t1.name  AS champion_name,  t1.city  AS champion_city,  t1.state AS champion_state,
            t2.name  AS runner_up_name,
            array_remove(ARRAY[
              CASE WHEN p1.id IS NOT NULL THEN p1.first_name || ' ' || p1.last_name END,
              CASE WHEN p2.id IS NOT NULL THEN p2.first_name || ' ' || p2.last_name END
            ], NULL)  AS mvp_names,
            c.championship_score
       FROM championships c
  LEFT JOIN teams   t1 ON c.champion_team_id  = t1.id
  LEFT JOIN teams   t2 ON c.runner_up_team_id = t2.id
  LEFT JOIN players p1 ON c.mvp_player_id     = p1.id
  LEFT JOIN players p2 ON c.mvp_player_id2    = p2.id
      WHERE c.year = $1
      LIMIT 1`,
    [year],
  );
  return rows[0] || null;
}

async function getMostChampionships(limit = 10) {
  const { rows } = await pool.query(
    `SELECT t.name AS team_name, t.city, t.state,
            COUNT(*) AS count,
            array_agg(c.year ORDER BY c.year DESC) AS years
       FROM championships c
       JOIN teams t ON c.champion_team_id = t.id
      WHERE c.champion_team_id IS NOT NULL
      GROUP BY t.id, t.name, t.city, t.state
      ORDER BY count DESC
      LIMIT $1`,
    [limit],
  );
  return rows;
}

async function getChampionshipStreaks() {
  const { rows } = await pool.query(
    `WITH streak_data AS (
       SELECT t.name AS team_name, c.year,
              c.year - ROW_NUMBER() OVER (PARTITION BY c.champion_team_id ORDER BY c.year) AS streak_group
         FROM championships c
         JOIN teams t ON c.champion_team_id = t.id
     ),
     streaks AS (
       SELECT team_name,
              MIN(year) AS start_year,
              MAX(year) AS end_year,
              COUNT(*)  AS consecutive_wins
         FROM streak_data
        GROUP BY team_name, streak_group
     )
     SELECT * FROM streaks
     WHERE consecutive_wins > 1
     ORDER BY consecutive_wins DESC, end_year DESC
     LIMIT 10`,
  );
  return rows;
}

async function getFirstChampion() {
  const { rows } = await pool.query(
    `SELECT c.year, t.name AS champion_name, t.city, t.state
       FROM championships c
       JOIN teams t ON c.champion_team_id = t.id
      ORDER BY c.year ASC
      LIMIT 1`,
  );
  return rows[0] || null;
}

// Intent matchers
const looksLikeFirstChamp = (q) =>
  /\b(first\s+(champ(ion(ship)?)?|winner|tournament)|earliest|inaugural)\b/i.test(
    q,
  );
const looksLikeStreak = (q) =>
  /\b(champ(ionship)?\s*)?(streak|consecutive|in\s+a\s+row|back.?to.?back)\b/i.test(
    q,
  );
const looksLikeMostChamps = (q) =>
  /\b(most\s+(champ(ionship)?s?|titles?)|who\s+(has|have)\s+won\s+the\s+most|team\s+with\s+most)\b/i.test(
    q,
  );
const looksLikeMvp = (q) => /\b(mvp|most\s+valuable\s+player)\b/i.test(q);
const looksLikeWinner = (q) =>
  /\b(who\s+won|champ(ion(ship)?)?|winner)\b/i.test(q);
const looksLikeRunnerUp = (q) =>
  /\b(runner.?up|second\s+place|finalist)\b/i.test(q);

// Gemini schema priming (user/model exchange — no role:"system")
const SCHEMA_EXCHANGE = [
  {
    role: "user",
    parts: [
      {
        text: `
You are the official historian for the NBC World Series baseball tournament.
When asked factual questions, answer clearly in 2–3 sentences.
If you don't know something specific, say so and suggest checking the Records or Championships pages.
Do not invent statistics or player names.
Acknowledge with: "Ready."
    `.trim(),
      },
    ],
  },
  { role: "model", parts: [{ text: "Ready." }] },
];

async function askGemini(question) {
  if (!geminiModel) return null;
  try {
    const result = await geminiModel.generateContent({
      contents: [
        ...SCHEMA_EXCHANGE,
        { role: "user", parts: [{ text: question }] },
      ],
    });
    return (result?.response?.text?.() ?? "").trim() || null;
  } catch (err) {
    console.error("Gemini error:", err.message);
    return null;
  }
}

// ── Search handler ────────────────────────────────────────────────────────
app.get("/api/search/ping", (_req, res) =>
  res.json({ ok: true, handler: "inline-smart-search" }),
);

async function smartSearchHandler(req, res) {
  const questionRaw = String(
    req.body?.question || req.body?.query || "",
  ).trim();
  const question = questionRaw.toLowerCase();

  if (!question) {
    return res.json({
      success: true,
      answer: "Please enter a search term.",
      results: [],
      count: 0,
    });
  }

  const year = extractYear(question);

  try {
    // 1. First champion
    if (looksLikeFirstChamp(question)) {
      const first = await getFirstChampion();
      if (first) {
        return res.json({
          success: true,
          answer: `The first NBC World Series champion was the **${first.champion_name}** in **${first.year}**.`,
          data: first,
          results: [first],
          queryType: "championship_winner",
          count: 1,
        });
      }
    }

    // 2. Streaks
    if (looksLikeStreak(question)) {
      const rows = await getChampionshipStreaks();
      const top = rows[0];
      return res.json({
        success: true,
        answer: top
          ? `The longest championship streak belongs to the **${top.team_name}** with **${top.consecutive_wins}** consecutive titles (${top.start_year}–${top.end_year}).`
          : "No streak data found.",
        data: rows,
        results: rows,
        queryType: "streaks",
        count: rows.length,
      });
    }

    // 3. Most championships
    if (looksLikeMostChamps(question)) {
      const rows = await getMostChampionships();
      const top = rows[0];
      return res.json({
        success: true,
        answer: top
          ? `The team with the most championships is the **${top.team_name}** with **${top.count}** titles.`
          : "No championship data found.",
        data: rows,
        results: rows,
        queryType: "leaderboard",
        count: rows.length,
      });
    }

    // 4. MVP for a year
    if (year && looksLikeMvp(question)) {
      const champ = await getChampionshipByYear(year);
      if (champ) {
        const names = champ.mvp_names || [];
        const mvpStr =
          names.length === 0
            ? null
            : names.length === 1
              ? names[0]
              : names.slice(0, -1).join(", ") +
                " and " +
                names[names.length - 1];
        return res.json({
          success: true,
          answer: mvpStr
            ? `The ${year} NBC World Series MVP${names.length > 1 ? "s were" : " was"} **${mvpStr}**.`
            : `No MVP recorded for ${year}.`,
          data: champ,
          results: [champ],
          queryType: "championship_mvp",
          count: 1,
        });
      }
    }

    // 5. Runner-up for a year
    if (year && looksLikeRunnerUp(question)) {
      const champ = await getChampionshipByYear(year);
      if (champ) {
        return res.json({
          success: true,
          answer: champ.runner_up_name
            ? `The ${year} NBC World Series runner-up was the **${champ.runner_up_name}**.`
            : `No runner-up recorded for ${year}.`,
          data: champ,
          results: [champ],
          queryType: "championship_runnerup",
          count: 1,
        });
      }
    }

    // 6. Champion for a year
    if (year && looksLikeWinner(question)) {
      const champ = await getChampionshipByYear(year);
      if (champ) {
        return res.json({
          success: true,
          answer: `In **${year}**, the **${champ.champion_name}** won the NBC World Series.`,
          data: champ,
          results: [champ],
          queryType: "championship_winner",
          count: 1,
        });
      }
    }

    // 7. Gemini fallback
    if (questionRaw.length > 2) {
      const aiAnswer = await askGemini(questionRaw);
      if (aiAnswer) {
        return res.json({
          success: true,
          answer: aiAnswer,
          data: [],
          results: [],
          queryType: "ai_generated",
          count: 0,
        });
      }
    }

    // 8. Default
    return res.json({
      success: true,
      answer:
        "I couldn't find a specific answer. Try asking about a champion, MVP, or year.",
      data: [],
      results: [],
      queryType: "fallback",
      count: 0,
    });
  } catch (err) {
    console.error("smartSearchHandler error:", err);
    return res.status(500).json({ success: false, error: "Search failed." });
  }
}

// /api/search/ask and /api/search-team/ask are handled by apiRouter (routes/index.js)
// via searchRoutes -> naturalLanguageSearch. Do NOT register them here.

/* ── Other routes ────────────────────────────────────────────────────────── */
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

/* ── 404 + error handler ─────────────────────────────────────────────────── */
app.use((_req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, _req, res, _next) => {
  console.error("Server error:", err?.message);
  res.status(500).json({ error: "Something went wrong!" });
});

/* ── Route inventory ─────────────────────────────────────────────────────── */
function listRoutes() {
  const out = [];
  const walk = (stack) =>
    (stack || []).forEach((l) => {
      if (l.route?.path) {
        out.push(
          `${Object.keys(l.route.methods)
            .map((m) => m.toUpperCase())
            .join(",")
            .padEnd(12)} ${l.route.path}`,
        );
      } else if (l.name === "router" && l.handle?.stack) {
        walk(l.handle.stack);
      }
    });
  walk(app._router.stack);
  console.log("=== Registered routes ===");
  out.sort().forEach((l) => console.log(l));
  console.log("=========================");
}

/* ── Boot ────────────────────────────────────────────────────────────────── */
app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
  listRoutes();
});
