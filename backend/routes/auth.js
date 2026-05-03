const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("cloudinary").v2;
const Farmer = require("../models/farmer");

const router = express.Router();

// in-memory backup storage for farmers (email -> farmer object)
const inMemoryFarmers = new Map();

// helper to check for existing user in either DB or memory
async function findFarmer(query, app) {
  if (app.locals.useInMemoryDb && app.locals.useInMemoryDb()) {
    // do simple search in map
    for (const farmer of inMemoryFarmers.values()) {
      let match = true;
      for (const key of Object.keys(query)) {
        if (farmer[key] !== query[key]) {
          match = false;
          break;
        }
      }
      if (match) return farmer;
    }
    return null;
  } else {
    return Farmer.findOne(query);
  }
}

async function createFarmer(data, app) {
  if (app.locals.useInMemoryDb && app.locals.useInMemoryDb()) {
    const id = String(inMemoryFarmers.size + 1);
    const entry = { _id: id, ...data, createdAt: new Date(), updatedAt: new Date() };
    inMemoryFarmers.set(data.email, entry);
    return entry;
  } else {
    return Farmer.create(data);
  }
}

async function comparePassword(plaintext, hashed, app) {
  // always use bcrypt; in-memory store still keeps hashed passwords
  return bcrypt.compare(plaintext, hashed);
}

// Helper to generate JWT token
function generateToken(farmer) {
  return jwt.sign(
    {
      id: farmer._id,
      email: farmer.email,
      name: farmer.name,
    },
    process.env.JWT_SECRET || "default-secret-key",
    { expiresIn: "7d" }
  );
}

// configure multer to keep file in memory
const upload = multer({ storage: multer.memoryStorage() });

// helper to upload a buffer to Cloudinary
function uploadBufferToCloudinary(buffer, folder = "krishi/farmers") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// signup route - direct registration without OTP
router.post("/signup", upload.single("photo"), async (req, res) => {
  try {
    const { name, age, phone, aadhaar, email, password, confirmPassword } = req.body;

    // Validate all required fields
    if (!name || !age || !phone || !aadhaar || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Check for existing user
    const exists = await findFarmer({ $or: [{ email }, { phone }, { aadhaar }] }, req.app);
    if (exists) {
      return res.status(400).json({ error: "User already exists (email/phone/aadhaar)" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Upload photo if provided
    let photoUrl = null;
    if (req.file && req.file.buffer) {
      const up = await uploadBufferToCloudinary(req.file.buffer);
      photoUrl = up.secure_url;
    }

    // Create farmer account
    const farmer = await createFarmer({
      name,
      age,
      phone,
      aadhaar,
      email,
      emailVerified: true,
      password: hashed,
      photoUrl,
    }, req.app);

    // Generate JWT token
    const token = generateToken(farmer);

    res.json({
      message: "Signup successful",
      token,
      user: {
        id: farmer._id,
        name: farmer.name,
        email: farmer.email,
        photoUrl: farmer.photoUrl,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find farmer by email
    const farmer = await findFarmer({ email }, req.app);
    if (!farmer) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    const ok = await comparePassword(password, farmer.password, req.app);
    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = generateToken(farmer);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: farmer._id,
        name: farmer.name,
        email: farmer.email,
        photoUrl: farmer.photoUrl,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function seedDemoFarmer(app) {
  const demoEmail = "demo@demo.com";
  const demoPassword = "demo123";

  const existing = await findFarmer({ email: demoEmail }, app);
  if (existing) return;

  const hashed = await bcrypt.hash(demoPassword, 10);
  try {
    await createFarmer(
      {
        name: "Demo Farmer",
        age: 30,
        phone: "9999999999",
        aadhaar: "999999999999",
        email: demoEmail,
        emailVerified: true,
        password: hashed,
        photoUrl: null,
      },
      app
    );
    console.log(`✅ Demo farmer seeded: ${demoEmail}`);
  } catch (err) {
    console.warn(`⚠️ Demo farmer seed failed: ${err.message}`);
  }
}

module.exports = router;
module.exports.seedDemoFarmer = seedDemoFarmer;