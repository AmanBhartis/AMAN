const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const Farmer = require("./models/farmer");

const app = express();

/** CORS (allow your GitHub Pages frontend) 
 * For quick start we allow all. Later, set ALLOWED_ORIGIN to your GH Pages URL.
 */
const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

// Cloudinary setup
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn("⚠️ Cloudinary credentials are not fully set, image uploads will fail");
}
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer: keep files in memory and stream to Cloudinary
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

// Helper to upload a buffer to Cloudinary
function uploadBufferToCloudinary(buffer, folder = "krishi/farmers") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Health check
app.get("/", (_req, res) => res.send("KRISHI backend running ✅"));

// mount routers
const authRoutes = require("./routes/auth");
const farmRoutes = require("./routes/farm");
app.use("/auth", authRoutes);
app.use("/farm", farmRoutes);

async function startServer() {
  if (typeof authRoutes.seedDemoFarmer === "function") {
    await authRoutes.seedDemoFarmer(app);
  }

  const PORT = process.env.PORT || 10000; // Render supplies PORT automatically
  app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
}

async function initializeApp() {
  await connectDatabase();
  await startServer();
}

initializeApp().catch((err) => {
  console.error("❌ Failed to initialize app:", err);
  process.exit(1);
});