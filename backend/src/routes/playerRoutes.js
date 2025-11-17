import { Router } from "express";
import * as playerController from "../controllers/playerController.js";

const router = Router();

// @route   GET /api/players/search?q=...
// @desc    Search for players by name
router.get("/search", playerController.searchPlayers);

// @route   GET /api/players/:id
// @desc    Get a single player by ID with their history
router.get("/:id", playerController.getPlayerById);

export default router;
