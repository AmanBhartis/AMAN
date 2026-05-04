const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const multer = require("multer");
require("dotenv").config();

const Farmer = require("./models/farmer");

const app = express();

/** CORS (allow your GitHub Pages frontend) 
 * For quick start we allow all. Later, set ALLOWED_ORIGIN to your GH Pages URL.
 */
const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

// Multer: keep files in memory
const upload = multer({ storage: multer.memoryStorage() });

// MongoDB connection
let useInMemoryDb = false;
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI environment variable is not set");
  process.exit(1);
}

async function connectDatabase() {
  try {
    await mongoose.connect(MONGO_URI, { dbName: process.env.DB_NAME || "krishiDB" });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ Mongo Error:", err.message);
    console.warn("⚠️ Falling back to in-memory database; data will be lost on restart.");
    useInMemoryDb = true;
  }
}

// expose flag and shared in-memory storage for routes
app.locals.useInMemoryDb = () => useInMemoryDb;

// Lazy DB connection middleware for Vercel
let isInitialized = false;
app.use(async (req, res, next) => {
  if (!isInitialized) {
    isInitialized = true;
    await connectDatabase();
    // try to seed demo farmer if authRoutes is loaded later, we will handle it below
  }
  next();
});

// Health check
app.get("/", (_req, res) => res.send("KRISHI backend running ✅"));

// mount routers
const authRoutes = require("./routes/auth");
const farmRoutes = require("./routes/farm");
app.use("/auth", authRoutes);
app.use("/farm", farmRoutes);

// alias routes for local development to match deployed /api/* paths
app.use("/api/auth", authRoutes);
app.use("/api/farm", farmRoutes);
app.get("/api/healthz", (_req, res) => res.json({ ok: true, message: "KRISHI backend running ✅" }));

module.exports = app;

if (require.main === module) {
  async function startLocal() {
    await connectDatabase();
    if (typeof authRoutes.seedDemoFarmer === "function") {
      await authRoutes.seedDemoFarmer(app);
    }
    const PORT = process.env.PORT || 10000;
    app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server on port ${PORT} host 0.0.0.0`));
  }
  startLocal().catch(console.error);
}