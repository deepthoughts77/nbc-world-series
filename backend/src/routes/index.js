// backend/src/routes/index.js
import { Router } from "express";

import adminRoutes from "./adminRoutes.js";
import authRoutes from "./authRoutes.js";
import healthRoutes from "./healthRoutes.js";

import mlbAlumniRoutes from "./mlbAlumniRoutes.js";
import championshipRoutes from "./championshipRoutes.js";
import teamRoutes from "./teamRoutes.js";
import statsRoutes from "./statsRoutes.js";
import playerStatsRoutes from "./playerStatsRoutes.js";
import hofRoutes from "./hofRoutes.js";
import recordsRoutes from "./recordsRoutes.js";
import searchRoutes from "./searchRoutes.js"; // contains /natural and /ask
import playerRoutes from "./playerRoutes.js";
import tournamentRoutes from "./tournamentRoutes.js";

const router = Router();

// Tracer for all /api routes
router.use((req, _res, next) => {
  console.log("API →", req.method, req.originalUrl);
  next();
});

// Health
router.use("/", healthRoutes);

// Admin / Auth
router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);

// Data routes
router.use("/alumni", mlbAlumniRoutes);
router.use("/championships", championshipRoutes);
router.use("/teams", teamRoutes);
router.use("/statistics", statsRoutes);

// Mount a fresh router for the /pitching-stats alias so we don't
// double-register the same Express router instance (causes double-execution)
router.use("/pitching-stats", (req, res, next) => {
  req.url = req.url === "/" ? req.url : req.url; // passthrough
  statsRoutes(req, res, next);
});

router.use("/player-stats", playerStatsRoutes);
router.use("/hall-of-fame", hofRoutes);
router.use("/records", recordsRoutes);

// Search — ALL search traffic goes through searchRoutes.
// searchRoutes registers both /natural and /ask so the full
// naturalLanguageSearch controller handles every query.
// Do NOT add a separate router.post("/search/ask", handleAiQuery) here —
// that would shadow the search controller with the raw Gemini SQL handler.
router.use("/search", searchRoutes);

router.use("/players", playerRoutes);
router.use("/tournaments", tournamentRoutes);

// 404 for unmatched /api routes
router.use((req, res) => {
  console.log(`API 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: "API route not found" });
});

export default router;
