//backend/src/routes/searchRoutes.js
import express from "express";
import {
  naturalLanguageSearch,
  getSearchSuggestions,
} from "../controllers/naturalSearchController.js";
import { unifiedSearch } from "../controllers/unifiedSearchController.js";

const router = express.Router();

// Primary endpoint — used by Home.js, SearchInterface.jsx
router.post("/ask", naturalLanguageSearch);
router.get("/", unifiedSearch);

// Alias — keeps any older callers working
router.post("/natural", naturalLanguageSearch);

// Suggestions chip data
router.get("/suggestions", getSearchSuggestions);

export default router;
