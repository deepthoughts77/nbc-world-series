import { Router } from "express";
import * as searchController from "../controllers/searchController.js";

const router = Router();

// @route   POST /api/search/ask
// @desc    Handle all natural language search queries
router.post("/ask", searchController.handleSearch);

export default router;
