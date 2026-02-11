// backend/src/routes/index.js
import { Router } from "express";

import adminRoutes from "./adminRoutes.js";
import authRoutes from "./authRoutes.js";
import healthRoutes from "./healthRoutes.js";

import mlbAlumniRoutes from "./mlbAlumniRoutes.js";

import championshipRoutes from "./championshipRoutes.js";
// IMPORTANT: do NOT mount championshipFinalsRoutes here (it hijacks /:year/final)
// import championshipFinalsRoutes from "./championshipFinalsRoutes.js";

import teamRoutes from "./teamRoutes.js";
import statsRoutes from "./statsRoutes.js";
import playerStatsRoutes from "./playerStatsRoutes.js";

import hofRoutes from "./hofRoutes.js";
import recordsRoutes from "./recordsRoutes.js";
import searchRoutes from "./searchRoutes.js";
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

// Admin/Auth
router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);

// Data
router.use("/alumni", mlbAlumniRoutes);

// Championships (includes /:year/final and /:year/mvp inside championshipRoutes)
router.use("/championships", championshipRoutes);

router.use("/teams", teamRoutes);

// Existing stats endpoints
router.use("/statistics", statsRoutes);
router.use("/pitching-stats", statsRoutes);

// Player stats endpoints used by frontend: /api/player-stats/years
router.use("/player-stats", playerStatsRoutes);

router.use("/hall-of-fame", hofRoutes);
router.use("/records", recordsRoutes);
router.use("/search", searchRoutes);

router.use("/players", playerRoutes);
router.use("/tournaments", tournamentRoutes);

// 404 handler for unmatched /api route
router.use((req, res) => {
  console.log(`API 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: "API route not found" });
});

export default router;
