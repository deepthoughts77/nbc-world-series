import { Router } from "express";
import { searchPlayerStats } from "../controllers/playerStatsController.js";

const router = Router();

// GET /api/player-stats/search?q=...
router.get("/search", searchPlayerStats);

export default router;
