// backend/src/index.js
import "dotenv/config";
import app from "./app.js"; // Import the configured Express app

const PORT = process.env.PORT || 5000;

/**
 * ============================
 * API caching / 304 fix
 * ============================
 * Express can return 304 (Not Modified) due to ETag caching.
 * That can cause fetch() to receive an empty body and break res.json().
 * We disable ETag and force no-store on all /api responses.
 */

// Disable ETag so Express won't respond 304 for API calls
app.disable("etag");

// Force no-cache headers for all API routes
app.use("/api", (req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});

// For Vercel serverless - export the app
export default app;

// Only start server if running locally (not on Vercel)
// (Keeping your exact condition, just using strict comparison)
if (process.env.NODE_ENV !== "1") {
  app.listen(PORT, () => {
    console.log(`\n API running on http://localhost:${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/api/health\n`);
  });
}
