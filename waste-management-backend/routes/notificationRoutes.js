const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// Create notification or broadcast
router.post("/", async (req, res) => {
  try {
    const { message, type } = req.body;
    const newNotification = new Notification({ message, type });
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating notification", error: error.message });
  }
});

// Get all notifications
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching notifications", error: error.message });
  }
});

// Delete a notification (admin)
router.delete("/:id", async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting notification", error: error.message });
  }
});

module.exports = router;
