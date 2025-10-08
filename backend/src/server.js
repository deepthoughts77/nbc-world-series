// backend/src/server.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/database");

// Routers (CommonJS)
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

// Build an allowlist from env
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  process.env.FRONTEND_URL,
  process.env.FRONTEND_PROD_URL,
  process.env.FRONTEND_DEV_URL,
  process.env.FRONTEND_ADMIN_URL,
  process.env.FRONTEND_ADMIN_PROD_URL,
  process.env.FRONTEND_ADMIN_DEV_URL,
].filter(Boolean);

// CORS + JSON
app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);
app.use(express.json());

// Health check with DB ping
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

// Routes
app.use(authRouter); // defines its own /api/auth/*
app.use("/api/championships", championshipsRouter);
app.use("/api/tournaments", tournamentsRouter);
app.use("/api/teams", teamsRouter);
app.use("/api/hall-of-fame", hallOfFameRouter);
app.use("/api/mlb-alumni", mlbAlumniRouter);
app.use("/api/records", recordsRouter);
app.use("/api/players", playersRouter);
app.use("/api", statisticsRouter);
app.use("/api", nbcImport);
app.use(adminRouter); // defines /api/admin/*

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler (keep last before listen)
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start
app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
