const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, '../.env') });

const authRoutes = require("../backend/routes/auth");
const farmRoutes = require("../backend/routes/farm");

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

let db = null;
let connectingPromise = null;

async function connectDatabase() {
  if (db && mongoose.connection.readyState === 1) {
    return db;
  }

  if (connectingPromise) {
    return connectingPromise;
  }

  connectingPromise = (async () => {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      console.warn("⚠️ MONGO_URI not set - using in-memory fallback");
      return null;
    }

    try {
      await mongoose.connect(MONGO_URI, {
        dbName: process.env.DB_NAME || "krishiDB",
      });
      db = mongoose.connection;
      console.log("✅ MongoDB Connected");
      return db;
    } catch (err) {
      console.error("❌ MongoDB Error:", err.message);
      return null;
    }
  })();

  return connectingPromise;
}

const useInMemoryDb = process.env.USE_IN_MEMORY_DB === "true";
app.locals.useInMemoryDb = () => useInMemoryDb;

// Health check
app.get("/api/healthz", (_req, res) => {
  res.set('Content-Type', 'application/json');
  res.json({ ok: true, message: "KRISHI backend running ✅" });
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/farm", farmRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found: " + req.path });
});

// Initialize database
connectDatabase().catch((err) => {
  console.error("Database initialization error:", err);
});

module.exports = serverless(app);
