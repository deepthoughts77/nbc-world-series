import { Router } from "express";
import adminRoutes from "./adminRoutes.js";
import mlbAlumniRoutes from "./mlbAlumniRoutes.js";
import championshipRoutes from "./championshipRoutes.js";
import teamRoutes from "./teamRoutes.js";
import statsRoutes from "./statsRoutes.js";
import hofRoutes from "./hofRoutes.js";
import recordsRoutes from "./recordsRoutes.js";
import searchRoutes from "./searchRoutes.js";
import healthRoutes from "./healthRoutes.js";
import playerStatsRoutes from "./playerStatsRoutes.js";
import playerRoutes from "./playerRoutes.js";
import tournamentRoutes from "./tournamentRoutes.js";
import authRoutes from "./authRoutes.js"; // <-- 1. IMPORT THE AUTH ROUTER

const router = Router();

// Tracer for all /api routes
router.use((req, _res, next) => {
  console.log("API →", req.method, req.originalUrl);
  next();
});

// --- Mount all sub-routers ---
router.use("/", healthRoutes);
router.use("/admin", adminRoutes);
router.use("/auth", authRoutes); // <-- 2. PLUG IT IN
router.use("/alumni", mlbAlumniRoutes);
router.use("/championships", championshipRoutes);
router.use("/teams", teamRoutes);
router.use("/statistics", statsRoutes);
router.use("/player-stats", statsRoutes);
router.use("/pitching-stats", statsRoutes);
router.use("/hall-of-fame", hofRoutes);
router.use("/records", recordsRoutes);
router.use("/search", searchRoutes);
router.use("/players", playerRoutes);
router.use("/tournaments", tournamentRoutes);

// --- 404 Handler for any /api route not matched ---
router.use((req, res) => {
  console.log(`API 404: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: "API route not found" });
});

export default router;
