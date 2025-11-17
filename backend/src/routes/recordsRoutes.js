import { Router } from "express";
import * as recordsController from "../controllers/recordsController.js";

const router = Router();

// @route   GET /api/records/overview
// @desc    Get the main overview of records (streaks, MVPs, etc.)
// @note    This was the logic from your index.js
router.get("/overview", recordsController.getRecordsOverview);

// @route   GET /api/records/all
// @desc    Get all records from the 'alltime_records' table
// @note    This was the '/' route from your old records.js
router.get("/all", recordsController.getAllTimeRecords);

// @route   GET /api/records/modern-wood-era
// @desc    Get specific hard-coded modern wood era records
router.get("/modern-wood-era", recordsController.getModernWoodEraRecords);

// @route   GET /api/records/category/:category
// @desc    Get records by a specific category
router.get("/category/:category", recordsController.getRecordsByCategory);

export default router;
