const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    address: { type: String, required: true },
    // Optional: You can link the admin who created the community
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Community", communitySchema);
