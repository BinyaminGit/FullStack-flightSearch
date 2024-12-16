const express = require("express");
const Flight = require("../models/flightsModel");

const router = express.Router();

// הצגת כל הטיסות
router.get("/", async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//הכנסת טיסה חדשה למאגר
router.post("/", async (req, res) => {
  try {
    const { id, origin, destination, kosherMeal, date } = req.body;

    // וודא שכל השדות הנדרשים קיימים
    if (!id || !origin || !destination || !date) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    const newFlight = new Flight({ id, origin, destination, kosherMeal, date });
    await newFlight.save();

    res
      .status(201)
      .json({ message: "Flight added successfully", flight: newFlight });
  } catch (err) {
    if (err.code === 11000) {
      // שגיאה במקרה של id כפול
      res.status(400).json({ error: "Flight with this ID already exists" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// חיפוש טיסה לפי יעד
router.get("/search", async (req, res) => {
  try {
    const destination = req.query.destination;
    if (!destination) {
      return res.status(400).json({ message: "Destination query is required" });
    }

    const flights = await Flight.find({
      destination: { $regex: new RegExp(destination, "i") }, // חיפוש לפי מחרוזת (case insensitive)
    });

    res.json(flights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// חיפוש טיסה לפי מוצא הטיסה
router.get("/searchOrigin", async (req, res) => {
  try {
    const origin = req.query.origin;
    if (!origin) {
      return res.status(400).json({ message: "Origin query is required" });
    }

    const flights = await Flight.find({
      origin: { $regex: new RegExp(origin, "i") }, // חיפוש לפי מחרוזת (case insensitive)
    });

    res.json(flights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
