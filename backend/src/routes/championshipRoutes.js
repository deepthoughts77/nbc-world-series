import { Router } from "express";
import * as champController from "../controllers/championshipController.js";

const router = Router();

// @route   GET /api/championships/
// @desc    Get all championships (with pagination)
router.get("/", champController.getAllChampionships);

// @route   GET /api/championships/:year
// @desc    Get a single championship by year
router.get("/:year", champController.getChampionshipByYear);

export default router;
