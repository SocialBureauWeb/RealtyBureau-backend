const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");

router.post("/add", async (req, res) => {
  try {
    const { userId, plotId } = req.body;

    if (!userId || !plotId) {
      return res.status(400).json({ message: "userId and plotId are required" });
    }

    // Check if already exists
    const existing = await Wishlist.findOne({ userId, plotId });

    if (existing) {
      return res.json({ message: "Already saved", saved: true });
    }

    await Wishlist.create({ userId, plotId });

    res.json({ message: "Saved to wishlist", saved: true });
  } catch (err) {
    console.log("Wishlist Add Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/remove", async (req, res) => {
  try {
    const { userId, plotId } = req.body;

    if (!userId || !plotId) {
      return res.status(400).json({ message: "userId and plotId are required" });
    }

    await Wishlist.findOneAndDelete({ userId, plotId });

    res.json({ message: "Removed from wishlist", saved: false });
  } catch (err) {
    console.log("Wishlist Remove Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;