const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const authRoutes = require("../backend/routes/auth");
const farmRoutes = require("../backend/routes/farm");

dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || "krishiDB";
let isConnected = false;

async function connectDatabase() {
  if (isConnected || mongoose.connection.readyState === 1) return;
  if (!MONGO_URI) {
    console.warn("❌ MONGO_URI environment variable is not set");
    return;
  }

  await mongoose.connect(MONGO_URI, {
    dbName: DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = true;
  console.log("✅ MongoDB Connected");
}

connectDatabase().catch((err) => {
  console.error("❌ Failed to connect to MongoDB:", err.message);
});

const useInMemoryDb = process.env.USE_IN_MEMORY_DB === "true";
app.locals.useInMemoryDb = () => useInMemoryDb;

app.get("/api/healthz", (_req, res) => {
  res.json({ ok: true, message: "KRISHI backend running ✅" });
});

app.use("/api/auth", authRoutes);
app.use("/api/farm", farmRoutes);

module.exports = app;
