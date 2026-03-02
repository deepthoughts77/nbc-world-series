// backend/src/index.js
import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

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

app.listen(PORT, () => {
  console.log(`\n API running on http://localhost:${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/api/health\n`);
});
