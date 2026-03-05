import express from "express";
import {
  naturalLanguageSearch,
  getSearchSuggestions,
} from "../controllers/naturalSearchController.js";

const router = express.Router();

// Primary endpoint — used by Home.js, SearchInterface.jsx
router.post("/ask", naturalLanguageSearch);

// Alias — keeps any older callers working
router.post("/natural", naturalLanguageSearch);

// Suggestions chip data
router.get("/suggestions", getSearchSuggestions);

export default router;
