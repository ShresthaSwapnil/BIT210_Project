const express = require("express");
const router = express.Router();
const Community = require("../models/Community");

// Create a new community
router.post("/", async (req, res) => {
  try {
    const { name, address, pickupTime, admin } = req.body;
    const newCommunity = new Community({ name, address, pickupTime, admin });
    await newCommunity.save();
    res.status(201).json(newCommunity);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Community creation failed", error: error.message });
  }
});

// Get all communities
router.get("/", async (req, res) => {
  try {
    const communities = await Community.find();
    res.json(communities);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching communities", error: error.message });
  }
});

module.exports = router;
