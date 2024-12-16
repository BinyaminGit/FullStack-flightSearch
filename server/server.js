const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const flightRoutes = require("./routes/flightRoutes");

require("dotenv").config();
console.log("Mongo URI:", process.env.MONGO_URI);

const app = express();

// אמצעי ביניים
app.use(
  cors({
    origin: "http://localhost:5173", // כתובת הלקוח שלך
  })
);

app.use(express.json());

// התחברות ל-MongoDB
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/flightsDB"; // חיבור ברירת מחדל
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
};

// הגדרת הראוטר
app.use("/api/flights", flightRoutes);

// הרצת השרת
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
