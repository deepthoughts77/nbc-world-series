// src/routes/auth.js
const express = require("express");
const { comparePassword, generateToken } = require("../utils/auth");

const router = express.Router();

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const hash = process.env.ADMIN_PASSWORD_HASH;
    if (!hash) {
      return res
        .status(500)
        .json({ error: "ADMIN_PASSWORD_HASH not configured" });
    }

    const ok = await comparePassword(password, hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken({ role: "admin", email });
    res.json({ token, role: "admin" });
  } catch (err) {
    console.error("Auth login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
