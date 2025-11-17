import { Router } from "express";
import * as adminController from "../controllers/adminController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js"; // Assuming middleware is here

const router = Router();

console.log(" adminRoutes.js loaded");

// ---- Admin Tracer ----
router.use((req, _res, next) => {
  console.log("ADMIN TRACE →", req.method, req.originalUrl);
  next();
});

// ---- Sanity Check ----
router.get("/ping", adminController.ping);

// ---- Team Routes ----
router.post(
  "/teams",
  authenticateToken,
  requireAdmin,
  adminController.createTeam
);

// ---- Championship Routes ----
router.put(
  "/championships/:year",
  authenticateToken,
  requireAdmin,
  adminController.upsertChampionship
);

// ---- Player Routes ----
router.post(
  "/players",
  authenticateToken,
  requireAdmin,
  adminController.createPlayer
);

// ---- Database Setup (DANGEROUS - Key protected in controller) ----
router.post("/setup-database", adminController.setupDatabase);

// --- 404 Handler (Catches any /api/admin route NOT defined above) ---
router.use((req, res) => {
  console.log("ADMIN 404 →", req.method, req.originalUrl);
  res
    .status(404)
    .json({ ok: false, where: "admin-404-handler", path: req.originalUrl });
});

export default router;
