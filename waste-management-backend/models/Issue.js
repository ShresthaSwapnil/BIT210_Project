const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    issueID: { type: String, unique: true, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    community: { type: String, required: true },
    issueType: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    comments: { type: String },
    photo: { type: String }, // Store filename or URL
    status: { type: String, default: "NEW" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
