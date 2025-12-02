import express from "express";
import {
  naturalLanguageSearch,
  getSearchSuggestions,
} from "../controllers/naturalSearchController.js";

const router = express.Router();

// Natural language search endpoint
router.post("/natural", naturalLanguageSearch);
router.post("/ask", naturalLanguageSearch); // ← ADD THIS LINE

// Get search suggestions
router.get("/suggestions", getSearchSuggestions);

export default router;
