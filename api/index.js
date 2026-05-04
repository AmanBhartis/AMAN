const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: require('path').join(__dirname, '../.env') });

const authRoutes = require("../backend/routes/auth");
const farmRoutes = require("../backend/routes/farm");

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let db = null;

async function connectDatabase() {
  if (db && mongoose.connection.readyState === 1) return db;
  
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.warn("⚠️ MONGO_URI not set - using in-memory fallback");
    return null;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      dbName: process.env.DB_NAME || "krishiDB",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = mongoose.connection;
    console.log("✅ MongoDB Connected");
    return db;
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    return null;
  }
}

const useInMemoryDb = process.env.USE_IN_MEMORY_DB === "true";
app.locals.useInMemoryDb = () => useInMemoryDb;

app.get("/healthz", (_req, res) => {
  res.json({ ok: true, message: "KRISHI backend running ✅" });
});

app.use("/auth", authRoutes);
app.use("/farm", farmRoutes);

connectDatabase().catch((err) => {
  console.error("Database initialization error:", err);
});

module.exports = serverless(app);
