// backend/src/index.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ---- DB + Routers ----
import { pool } from "./db.js";
import adminRoutes from "./routes/admin.js";
import recordsRoutes from "./routes/records.js";
import mlbAlumniRoutes from "./routes/mlbAlumni.js";

// __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Basic request tracer
app.use((req, _res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});

// Trace anything under /api
app.use("/api", (req, _res, next) => {
  console.log("API →", req.method, req.originalUrl);
  next();
});

// CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_DEV_URL,
  process.env.FRONTEND_PROD_URL,
  process.env.FRONTEND_ADMIN_URL,
  process.env.FRONTEND_ADMIN_DEV_URL,
  process.env.FRONTEND_ADMIN_PROD_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

console.log(" Starting to register routes...");

// ------------------------
// Admin routes (+ 404 after)
// ------------------------
app.use(
  "/api/admin",
  (req, _res, next) => {
    console.log("ADMIN PRE →", req.method, req.originalUrl);
    next();
  },
  adminRoutes
);

// Direct pings (still under /api/admin)
app.get("/api/admin/_direct_ping", (_req, res) => {
  res.json({ ok: true, where: "index.js (direct)" });
});
app.get("/api/admin/ping", (_req, res) => {
  res.json({ ok: true, where: "index.js (direct)" });
});
app.get("/api/admin/_rootping", (_req, res) => {
  res.json({ ok: true, where: "index" });
});

// 404 for anything under /api/admin not matched above
app.use("/api/admin", (req, res) => {
  console.log("ADMIN 404 →", req.method, req.originalUrl);
  res
    .status(404)
    .json({ ok: false, where: "admin-post-router", path: req.originalUrl });
});
console.log(" Registered: /api/admin routes");

// ------------------------
// Records routes
// ------------------------
app.use("/api/records", recordsRoutes);
console.log(" Registered: /api/records routes");

// ------------------------
// MLB Alumni routes (ESM router)
// ------------------------
app.use("/api/alumni", mlbAlumniRoutes);
console.log(" Registered: GET /api/alumni");

// ------------------------
// Health & DB helpers
// ------------------------
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});
console.log(" Registered: GET /api/health");

// Neon-safe, shape-agnostic DB test
app.get("/api/db-test", async (_req, res) => {
  try {
    const r = await pool.query("SELECT NOW() AS time");
    const time = r?.rows?.[0]?.time ?? null;
    if (!time) {
      return res
        .status(500)
        .json({ success: false, error: "db-test: no row returned" });
    }
    res.json({ success: true, time });
  } catch (err) {
    console.error("db-test error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
console.log(" Registered: GET /api/db-test");

app.get("/api/which-db", async (_req, res) => {
  try {
    const r = await pool.query(`
      SELECT
        current_database() AS db,
        inet_server_addr()::text AS host_ip,
        current_setting('server_version') AS server_version,
        current_setting('ssl') AS ssl_on
    `);
    res.json(r?.rows?.[0] ?? {});
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
console.log(" Registered: GET /api/which-db");

// ------------------------
// Stats overview
// ------------------------
app.get("/api/statistics/overview", async (_req, res) => {
  try {
    const champsResult = await pool.query("SELECT COUNT(*) FROM championships");
    const total_championships = parseInt(champsResult.rows[0].count, 10);

    const teamsResult = await pool.query("SELECT COUNT(*) FROM teams");
    const total_teams = parseInt(teamsResult.rows[0].count, 10);

    const mlbResult = await pool.query("SELECT COUNT(*) FROM mlb_alumni");
    const mlb_alumni = parseInt(mlbResult.rows[0].count, 10);

    const hofResult = await pool.query("SELECT COUNT(*) FROM hall_of_fame");
    const hall_of_fame_members = parseInt(hofResult.rows[0].count, 10);

    const mostSuccessfulResult = await pool.query(`
      SELECT
        t.name,
        COUNT(c.id) as championships
      FROM teams t
      LEFT JOIN championships c ON t.id = c.champion_team_id
      GROUP BY t.id, t.name
      ORDER BY championships DESC
      LIMIT 1
    `);

    const most_successful_team = mostSuccessfulResult.rows[0] || {
      name: "—",
      championships: 0,
    };

    res.json({
      total_championships,
      total_teams,
      mlb_alumni,
      hall_of_fame_members,
      most_successful_team,
    });
  } catch (err) {
    console.error(" Overview error:", err);
    res.status(500).json({ error: err.message });
  }
});
console.log(" Registered: GET /api/statistics/overview");

// Small helper
app.get("/api/dbcheck", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "select count(*)::int as championships from public.championships"
    );
    res.json({ ok: true, championships: rows[0].championships });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// === PLAYER STATS (per-player tournament stats) ===
app.get("/api/player-stats", async (req, res) => {
  try {
    const { year, team } = req.query;

    const conditions = [];
    const params = [];

    if (year) {
      params.push(parseInt(year, 10));
      conditions.push(`year = $${params.length}`);
    }

    if (team) {
      // partial match on team name
      params.push(`%${team.toLowerCase()}%`);
      conditions.push(`LOWER(team_name) LIKE $${params.length}`);
    }

    const whereSql = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const sql = `
      SELECT
        id,
        year,
        team_name,
        player_name,
        position,
        g,
        ab,
        r,
        h,
        "2b",
        "3b",
        hr,
        sb,
        sh,
        rbi,
        po,
        a,
        e,
        pct
      FROM public.player_stats
      ${whereSql}
      ORDER BY year DESC, team_name, player_name
    `;

    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(" /api/player-stats error:", err);
    res.status(500).json({ error: "Failed to fetch player stats" });
  }
});
console.log(" Registered: GET /api/player-stats");

app.get("/api/player-stats/years", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT DISTINCT year FROM public.player_stats ORDER BY year DESC`
    );
    res.json(rows.map((r) => r.year));
  } catch (err) {
    console.error(" /api/player-stats/years error:", err);
    res.status(500).json({ error: "Failed to fetch years" });
  }
});
console.log(" Registered: GET /api/player-stats/years");

// ------------------------
// Championships
// ------------------------
app.get("/api/championships", async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        year,
        championship_score,
        champion_id, champion_name, champion_city, champion_state,
        runner_up_id, runner_up_name, runner_up_city, runner_up_state,
        mvp_player_id, mvp_full_name AS mvp
      FROM public.vw_championships_full
      ORDER BY year DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(" /api/championships error:", err.message);
    res.status(500).json({ error: "Failed to fetch championships" });
  }
});
console.log(" Registered: GET /api/championships");

app.get("/api/championships/:year", async (req, res) => {
  try {
    const { year } = req.params;
    const { rows } = await pool.query(
      `
      SELECT
        year,
        championship_score,
        champion_id, champion_name, champion_city, champion_state,
        runner_up_id, runner_up_name, runner_up_city, runner_up_state,
        mvp_player_id, mvp_full_name AS mvp
      FROM public.vw_championships_full
      WHERE year = $1
      `,
      [year]
    );
    res.json(rows[0] || null);
  } catch (err) {
    console.error(" /api/championships/:year error:", err.message);
    res.status(500).json({ error: "server_error" });
  }
});
console.log(" Registered: GET /api/championships/:year");

// ------------------------
// Teams + views
// ------------------------
app.get("/api/teams", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        t.id,
        t.name,
        t.city,
        t.state,
        t.league,
        COUNT(DISTINCT c.id) as championships_won,
        COUNT(DISTINCT tt.tournament_id) as appearances
      FROM teams t
      LEFT JOIN championships c ON t.id = c.champion_team_id
      LEFT JOIN tournament_teams tt ON t.id = tt.team_id
      GROUP BY t.id, t.name, t.city, t.state, t.league
      ORDER BY t.name
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});
console.log(" Registered: GET /api/teams");

app.get("/api/teams/:id/batting", async (req, res) => {
  try {
    const { id } = req.params;
    const { year } = req.query;
    const { rows } = await pool.query(
      `SELECT * FROM public.vw_batting_expanded
       WHERE team_id = $1 AND year = $2
       ORDER BY last_name`,
      [id, year]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error" });
  }
});
console.log(" Registered: GET /api/teams/:id/batting");

app.get("/api/teams/:id/pitching", async (req, res) => {
  try {
    const { id } = req.params;
    const { year } = req.query;
    const { rows } = await pool.query(
      `SELECT * FROM public.vw_pitching_expanded
       WHERE team_id = $1 AND year = $2
       ORDER BY last_name`,
      [id, year]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error" });
  }
});
console.log(" Registered: GET /api/teams/:id/pitching");
// Pitching stats endpoint
app.get("/api/pitching-stats", async (req, res) => {
  try {
    const year = Number(req.query.year) || 1966;
    const result = await db.query(
      `SELECT * FROM pitching_stats WHERE year = $1 ORDER BY team_name, player_name`,
      [year]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error loading pitching stats:", err);
    res.status(500).json({ error: "Failed to load pitching stats" });
  }
});
console.log(" Registered: GET /api/pitching-stats");
// ------------------------
// Hall of Fame
// ------------------------
app.get("/api/hall-of-fame", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        COALESCE(name, inductee_name) as inductee_name,
        induction_year,
        category,
        bio,
        player_id
      FROM hall_of_fame
      ORDER BY induction_year DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Hall of Fame" });
  }
});
console.log(" Registered: GET /api/hall-of-fame");

// ------------------------
// Search
// ------------------------
app.post("/api/search/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        error: "Please provide a question",
      });
    }

    const lower = question.toLowerCase();
    console.log(" Search query:", question);

    // Who won?
    if (lower.match(/who won|champion|winner/)) {
      const yearMatch = question.match(/\d{4}/);
      const year = yearMatch ? parseInt(yearMatch[0], 10) : 2025;

      const result = await pool.query(
        `
        SELECT 
          c.year,
          t.name as champion,
          t.city,
          t.state,
          c.championship_score,
          p.first_name || ' ' || p.last_name as mvp,
          rt.name as runner_up
        FROM championships c
        JOIN teams t ON c.champion_team_id = t.id
        LEFT JOIN teams rt ON c.runner_up_team_id = rt.id
        LEFT JOIN players p ON c.mvp_player_id = p.id
        WHERE c.year = $1
      `,
        [year]
      );

      if (result.rows.length > 0) {
        const champ = result.rows[0];
        return res.json({
          success: true,
          answer:
            `🏆 The ${year} NBC World Series champion was the **${champ.champion}** from ${champ.city}, ${champ.state}.` +
            `${
              champ.runner_up ? ` They defeated the ${champ.runner_up}` : ""
            }` +
            `${
              champ.championship_score
                ? ` with a final score of ${champ.championship_score}`
                : ""
            }.` +
            `${champ.mvp ? `\n\n⭐ Tournament MVP: **${champ.mvp}**` : ""}`,
          data: champ,
          queryType: "championship",
        });
      }
      return res.json({
        success: true,
        answer: `No championship data found for ${year}.`,
        data: null,
      });
    }

    // MVP?
    if (lower.match(/mvp|most valuable/)) {
      const yearMatch = question.match(/\d{4}/);
      const year = yearMatch ? parseInt(yearMatch[0], 10) : 2025;

      const result = await pool.query(
        `
        SELECT 
          c.year,
          p.first_name || ' ' || p.last_name as mvp,
          t.name as team
        FROM championships c
        LEFT JOIN players p ON c.mvp_player_id = p.id
        LEFT JOIN teams t ON c.champion_team_id = t.id
        WHERE c.year = $1
      `,
        [year]
      );

      if (result.rows.length > 0 && result.rows[0].mvp) {
        const data = result.rows[0];
        return res.json({
          success: true,
          answer: `⭐ The ${year} NBC World Series MVP was **${data.mvp}** from the **${data.team}**.`,
          data,
          queryType: "mvp",
        });
      }
      return res.json({
        success: true,
        answer: `No MVP data available for ${year}.`,
        data: null,
      });
    }

    // Default help
    return res.json({
      success: true,
      answer:
        `I didn't quite understand that question. Here are some things you can ask:\n\n` +
        `🏆 Championships:\n• "Who won in 2025?"\n• "Who was MVP in 2025?"\n• "Recent champions"\n• "Champions in the 2010s"\n• "Championship streaks"\n\n` +
        `📊 Teams:\n• "How many championships has Hutchinson won?"\n• "When did Santa Barbara last win?"\n• "Most championships record"\n\n` +
        `📍 Tournament Info:\n• "Where is the tournament held?"\n• "Highest scoring game"\n• "MLB players from NBC"`,
      data: null,
      queryType: "help",
    });
  } catch (err) {
    console.error(" Search error:", err);
    return res.status(500).json({
      success: false,
      error: "Query failed",
      message: err.message,
    });
  }
});
console.log(" Registered: POST /api/search/ask");

console.log("\n All routes registered successfully!\n");

// ------------------------
// Serve React build (after API routes)
// ------------------------
const frontendBuild = path.resolve(__dirname, "..", "..", "frontend", "build");
app.use(express.static(frontendBuild));
const indexHtml = path.join(frontendBuild, "index.html");

// Serve index.html for anything not starting with /api
if (fs.existsSync(indexHtml)) {
  app.use(express.static(frontendBuild));
  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(indexHtml);
  });
} else {
  app.get("/", (_req, res) => {
    res.status(200).send("Frontend build not found yet. API is running.");
  });
}

// ------------------------
// Start server (local)
// ------------------------
const PORT = process.env.PORT || 5000;

// For Vercel serverless - export the app
export default app;

// Only start server if running locally (not on Vercel)
if (process.env.NODE_ENV !== "1") {
  app.listen(PORT, () => {
    console.log(` API running on http://localhost:${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/api/health\n`);
  });
}
