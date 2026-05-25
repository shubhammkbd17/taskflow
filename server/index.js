require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");
const { apiLimiter } = require("./middleware/rateLimiter");
const { startCronJobs } = require("./services/cronService");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const reminderRoutes = require("./routes/reminders");

const app = express();

// ── Validate Required Environment Variables ────────────────────────────────
const requiredEnv = ["MONGO_URI", "JWT_SECRET"];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.warn(`⚠️ Missing required env var: ${key}`);
  }
}

// ── Security & Logging ────────────────────────────────────────────────────
app.use(helmet());
app.disable("x-powered-by");

app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")
);

// ── CORS Configuration ────────────────────────────────────────────────────
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const allowedOrigins = [clientUrl, "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
  })
);

// ── Body Parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Rate Limiting ─────────────────────────────────────────────────────────
app.use("/api", apiLimiter);

// ── API Routes ────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reminders", reminderRoutes);

// ── Health Check Route ────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// ── 404 Handler ───────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// ── Global Error Handler ──────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// ── Server Boot ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;

connectDB()
  .then(() => {
    console.log("✅ MongoDB Atlas connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    startCronJobs();
    console.log("⏰ Cron jobs started");
  })
  .catch((err) => {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  });