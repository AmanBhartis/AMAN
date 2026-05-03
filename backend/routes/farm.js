const express = require("express");
const jwt = require("jsonwebtoken");
const Farmer = require("../models/farmer");

const router = express.Router();

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default-secret-key");
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    console.log(`[verifyToken] User ID: ${req.userId}, Email: ${req.userEmail}`);
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
}

// GET profile - retrieve farmer's profile data
router.get("/profile", verifyToken, async (req, res) => {
  try {
    console.log(`[GET /farm/profile] Fetching for user ID: ${req.userId}`);

    let farmer;
    if (req.app.locals.useInMemoryDb && req.app.locals.useInMemoryDb()) {
      console.log('[GET /farm/profile] Using in-memory database');
      farmer = await Farmer.findById(req.userId).catch(() => null);
    } else {
      console.log('[GET /farm/profile] Using MongoDB');
      farmer = await Farmer.findById(req.userId);
    }

    if (!farmer) {
      console.log(`[GET /farm/profile] Farmer not found for ID: ${req.userId}, trying by email: ${req.userEmail}`);
      // Try finding by email if ID lookup fails
      farmer = await Farmer.findOne({ email: req.userEmail });
    }

    if (!farmer) {
      console.log(`[GET /farm/profile] Farmer still not found`);
      return res.status(404).json({ error: "Farmer not found" });
    }

    const profileResponse = {
      farmerId: farmer._id,
      fullName: farmer.name,
      age: farmer.age,
      phone: farmer.phone,
      aadhar: farmer.aadhaar,
      aadhaar: farmer.aadhaar,
      email: farmer.email,
      photoUrl: farmer.photoUrl,
      gender: farmer.gender || "",
      address: farmer.address || "",
      landSize: farmer.landSize || null,
      farmingType: farmer.farmingType || "",
      crops: farmer.crops || "",
      livestock: farmer.livestock || "",
      bankLinked: farmer.bankLinked || "",
      loanDetails: farmer.loanDetails || "",
      fertilizers: farmer.fertilizers || "",
      pesticides: farmer.pesticides || "",
      organicPractices: farmer.organicPractices || "",
      machinery: farmer.machinery || "",
    };

    console.log(`[GET /farm/profile] Returning profile:`, profileResponse);
    res.json({
      message: "Profile retrieved successfully",
      profile: profileResponse
    });
  } catch (err) {
    console.error(`[GET /farm/profile] Error:`, err);
    res.status(500).json({ error: err.message });
  }
});

// POST/PUT profile - update farmer's profile data
router.post("/profile", verifyToken, async (req, res) => {
  try {
    console.log(`[POST /farm/profile] Updating for user ID: ${req.userId}`);
    console.log(`[POST /farm/profile] Received data:`, req.body);

    const {
      fullName,
      age,
      gender,
      phone,
      aadhar,
      address,
      landSize,
      farmingType,
      crops,
      livestock,
      bankLinked,
      loanDetails,
      fertilizers,
      pesticides,
      organicPractices,
      machinery
    } = req.body;

    const updateData = {
      name: fullName || undefined,
      age: age ? parseInt(age) : undefined,
      phone: phone || undefined,
      aadhaar: aadhar || undefined,
      gender: gender || "",
      address: address || "",
      landSize: landSize ? parseFloat(landSize) : null,
      farmingType: farmingType || "",
      crops: crops || "",
      livestock: livestock || "",
      bankLinked: bankLinked || "",
      loanDetails: loanDetails || "",
      fertilizers: fertilizers || "",
      pesticides: pesticides || "",
      organicPractices: organicPractices || "",
      machinery: machinery || "",
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    console.log(`[POST /farm/profile] Update data to save:`, updateData);

    let updatedFarmer = await Farmer.findByIdAndUpdate(req.userId, updateData, { new: true });

    if (!updatedFarmer) {
      console.log(`[POST /farm/profile] Farmer not found by ID, trying by email`);
      updatedFarmer = await Farmer.findOneAndUpdate({ email: req.userEmail }, updateData, { new: true });
    }

    if (!updatedFarmer) {
      console.log(`[POST /farm/profile] Farmer not found for update`);
      return res.status(404).json({ error: "Farmer not found" });
    }

    console.log(`[POST /farm/profile] Profile updated successfully`);

    res.json({
      message: "Profile updated successfully",
      profile: {
        farmerId: updatedFarmer._id,
        fullName: updatedFarmer.name,
        age: updatedFarmer.age,
        phone: updatedFarmer.phone,
        aadhar: updatedFarmer.aadhaar,
        email: updatedFarmer.email,
        photoUrl: updatedFarmer.photoUrl,
        gender: updatedFarmer.gender || "",
        address: updatedFarmer.address || "",
        landSize: updatedFarmer.landSize || null,
        farmingType: updatedFarmer.farmingType || "",
        crops: updatedFarmer.crops || "",
        livestock: updatedFarmer.livestock || "",
        bankLinked: updatedFarmer.bankLinked || "",
        loanDetails: updatedFarmer.loanDetails || "",
        fertilizers: updatedFarmer.fertilizers || "",
        pesticides: updatedFarmer.pesticides || "",
        organicPractices: updatedFarmer.organicPractices || "",
        machinery: updatedFarmer.machinery || "",
      }
    });
  } catch (err) {
    console.error(`[POST /farm/profile] Error:`, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
