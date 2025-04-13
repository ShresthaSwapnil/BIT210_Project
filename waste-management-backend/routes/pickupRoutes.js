const express = require("express");
const router = express.Router();
const Pickup = require("../models/Pickup");

// Schedule a new pickup
router.post("/", async (req, res) => {
  try {
    const { user, community, date, time, wasteTypes } = req.body;
    const newPickup = new Pickup({ user, community, date, time, wasteTypes });
    await newPickup.save();
    res
      .status(201)
      .json({ message: "Pickup scheduled successfully", pickup: newPickup });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error scheduling pickup", error: error.message });
  }
});

// Get pickups (optionally filter by user or community)
router.get("/", async (req, res) => {
  try {
    const { user, community } = req.query;
    const query = {};
    if (user) query.user = user;
    if (community) query.community = community;
    const pickups = await Pickup.find(query);
    res.json(pickups);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching pickups", error: error.message });
  }
});

module.exports = router;
