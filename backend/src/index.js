import "dotenv/config";
import app from "./app.js"; // Import the configured Express app

const PORT = process.env.PORT || 5000;

// For Vercel serverless - export the app
export default app;

// Only start server if running locally (not on Vercel)
if (process.env.NODE_ENV !== "1") {
  app.listen(PORT, () => {
    console.log(`\n API running on http://localhost:${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/api/health\n`);
  });
}
