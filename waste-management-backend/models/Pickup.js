const mongoose = require("mongoose");

const pickupSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    community: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    wasteTypes: [{ type: String, required: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pickup", pickupSchema);
