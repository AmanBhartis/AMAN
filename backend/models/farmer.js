const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    phone: { type: String, required: true, unique: true },
    aadhaar: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, default: false },
    password: { type: String, required: true },   // hashed
    photoUrl: { type: String, default: null },    // Cloudinary URL
    
    // Extended Profile Fields
    gender: { type: String, default: "" },
    address: { type: String, default: "" },
    landSize: { type: Number, default: null },
    farmingType: { type: String, default: "" },
    crops: { type: String, default: "" },
    livestock: { type: String, default: "" },
    bankLinked: { type: String, default: "" },
    loanDetails: { type: String, default: "" },
    fertilizers: { type: String, default: "" },
    pesticides: { type: String, default: "" },
    organicPractices: { type: String, default: "" },
    machinery: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Farmer", farmerSchema);
