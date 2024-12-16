const mongoose = require("mongoose");

// הגדרת הסכמה לטיסות
const flightSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  kosherMeal: { type: String },
  date: { type: Date, required: true },
});

// יצירת המודל
const Flight = mongoose.model("Flight", flightSchema);

module.exports = Flight;
