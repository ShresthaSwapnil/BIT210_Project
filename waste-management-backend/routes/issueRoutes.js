const express = require("express");
const router = express.Router();
const Issue = require("../models/Issue");

// Log a new issue
router.post("/", async (req, res) => {
  try {
    const {
      issueID,
      user,
      community,
      issueType,
      location,
      description,
      comments,
      photo,
    } = req.body;
    const newIssue = new Issue({
      issueID,
      user,
      community,
      issueType,
      location,
      description,
      comments,
      photo,
      status: "NEW",
    });
    await newIssue.save();
    res
      .status(201)
      .json({ message: "Issue logged successfully", issue: newIssue });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging issue", error: error.message });
  }
});

// Get issues (optionally filter by community or user)
router.get("/", async (req, res) => {
  try {
    const { community, user } = req.query;
    const query = {};
    if (community) query.community = community;
    if (user) query.user = user;
    const issues = await Issue.find(query);
    res.json(issues);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching issues", error: error.message });
  }
});

module.exports = router;
