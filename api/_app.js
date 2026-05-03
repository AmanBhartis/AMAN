const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

let isConnected = false;
let isInitialized = false;

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

let useInMemoryDb = false;

function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.locals.useInMemoryDb = () => useInMemoryDb;
  return app;
}

async function connectDatabase() {
  if (isConnected || useInMemoryDb) return;

  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.warn("⚠️ MONGO_URI is not set. Falling back to in-memory storage.");
    useInMemoryDb = true;
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      dbName: process.env.DB_NAME || "krishiDB",
    });
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    console.warn("⚠️ Falling back to in-memory storage.");
    useInMemoryDb = true;
  }
}

async function initialize() {
  if (isInitialized) return;
  configureCloudinary();
  await connectDatabase();
  isInitialized = true;
}

module.exports = { createApp, initialize };
