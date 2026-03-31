// backend/src/routes/documents.js
import { Router } from "express";
import {
  getAllDocuments,
  getDocumentById,
  getDocumentYears,
  createDocument,
  updateDocument,
  deleteDocument,
} from "../controllers/documentsController.js";

const router = Router();

// GET  /api/documents/years  — distinct years (must be before /:id)
router.get("/years", getDocumentYears);

// GET  /api/documents        — list all documents
router.get("/", getAllDocuments);

// GET  /api/documents/:id    — single document
router.get("/:id", getDocumentById);

// POST /api/documents        — create document (metadata + external URL)
router.post("/", createDocument);

// PUT  /api/documents/:id    — update document
router.put("/:id", updateDocument);

// DELETE /api/documents/:id  — delete document
router.delete("/:id", deleteDocument);

export default router;
