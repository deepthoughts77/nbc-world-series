// backend/src/routes/championshipRoutes.js
import { Router } from "express";
import * as champController from "../controllers/championshipController.js";

const router = Router();

// Get all championships
router.get("/", champController.getAllChampionships);

// IMPORTANT: put these BEFORE /:year
router.get("/:year/final", champController.getChampionshipFinalStats);
router.get("/:year/mvp", champController.getChampionshipMvpStats);

// Get a single championship by year
router.get("/:year", champController.getChampionshipByYear);

export default router;
