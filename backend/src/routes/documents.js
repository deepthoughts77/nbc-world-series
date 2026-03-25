// backend/src/routes/documents.js
import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  uploadDocument,
  getAllDocuments,
  getDocumentById,
  getDocumentYears,
  createDocument,
  updateDocument,
  deleteDocument,
} from "../controllers/documentsController.js";

const router = Router();

// Local upload dir (kept for backward compat — not used for library PDFs)
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
      cb(null, safeName);
    },
  }),
  limits: { fileSize: 300 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed."), false);
  },
});

// Static paths first — must be before /:id
router.get("/years", getDocumentYears);

// List all documents
router.get("/", getAllDocuments);

// Single document
router.get("/:id", getDocumentById);

// Create document record (metadata + external URL — preferred library workflow)
router.post("/", createDocument);

// Legacy file upload route (kept for backward compat)
router.post("/upload", upload.single("file"), uploadDocument);

// Update document record
router.put("/:id", updateDocument);

// Delete document record
router.delete("/:id", deleteDocument);

export default router;
