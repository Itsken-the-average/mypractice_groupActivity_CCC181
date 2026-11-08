require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { findByEmail, findById } = require("./users");
const requireAuth = require("./middleware/requireAuth");
const { notFound, errorHandler } = require("./middleware/errorHandlers");

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

if (!JWT_SECRET) {
  console.error("JWT_SECRET is missing. Add it to server/.env and try again.");
  process.exit(1);
}

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

// Health check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Login
app.post("/api/v1/sessions", (req, res) => {
  const { email, password } = req.body || {};

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = findByEmail(email);
  const passwordOk = user && bcrypt.compareSync(password, user.passwordHash);

  if (!passwordOk) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

  res.status(200).json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// ===== Member 2 routes and handlers go here (next branch) =====

// Who am I? (protected by the guard)
app.get("/api/v1/users/me", requireAuth, (req, res) => {
  const user = findById(req.userId);

  if (!user) {
    return res.status(401).json({ error: "Not logged in." });
  }

  res.status(200).json({ id: user.id, name: user.name, email: user.email });
});

// Unknown route: must come AFTER all routes
app.use(notFound);

// Crash catcher: must be the very LAST one
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});