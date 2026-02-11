//backend/src/app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Import your new main API router
import apiRouter from "./routes/index.js";
import errorHandler from "./utils/errorHandler.js";

// __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- Top-Level Middleware ---

// Basic request tracer
app.use((req, _res, next) => {
  console.log("", req.method, req.url);
  next();
});

// CORS
// backend/src/app.js (CORS)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_DEV_URL,
  process.env.FRONTEND_PROD_URL,
  process.env.FRONTEND_ADMIN_URL,
  process.env.FRONTEND_ADMIN_DEV_URL,
  process.env.FRONTEND_ADMIN_PROD_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // allow server-to-server / curl / render health checks
      if (!origin) return cb(null, true);

      // exact match env allowlist
      if (allowedOrigins.includes(origin)) return cb(null, true);

      // allow any Vercel preview domains (optional)
      if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return cb(null, true);

      return cb(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json()); // Body parser
app.use(morgan("dev")); // HTTP request logger

// Preflight for all routes (safe in Express 5 + path-to-regexp updates)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// --- API Routes ---
// All API routes are now handled in the /routes/index.js file
app.use("/api", apiRouter);

// --- Serve React Build (Frontend) ---
// This serves your built frontend *after* all API routes
const frontendBuild = path.resolve(__dirname, "..", "..", "frontend", "build");
const indexHtml = path.join(frontendBuild, "index.html");

if (fs.existsSync(indexHtml)) {
  app.use(express.static(frontendBuild));

  // For any route that is NOT an API route, send the React app
  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(indexHtml);
  });
  console.log(` Serving frontend from: ${frontendBuild}`);
} else {
  console.warn(` Frontend build not found at: ${frontendBuild}`);
  app.get("/", (_req, res) => {
    res.status(200).send("Frontend build not found. API is running.");
  });
}

export default app;
