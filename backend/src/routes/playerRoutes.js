// backend/src/routes/playerRoutes.js
import { Router } from "express";
import * as playerController from "../controllers/playerController.js";

const router = Router();

// Leaders endpoints
// GET /api/players/batting-leaders?year=2025&sort=avg&order=desc&teamId=463
router.get("/batting-leaders", playerController.getBattingLeaders);

// GET /api/players/pitching-leaders?year=2025&sort=era&order=asc&teamId=463
router.get("/pitching-leaders", playerController.getPitchingLeaders);

// Player search
// GET /api/players/search?q=...
router.get("/search", playerController.searchPlayers);

// Player profile
// GET /api/players/:id
router.get("/:id", playerController.getPlayerById);

export default router;
