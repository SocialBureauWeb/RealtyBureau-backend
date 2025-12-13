const Wishlist = require("../models/Wishlist");

exports.toggleWishlist = async (req, res) => {
  try {
    const { userId, plotId } = req.body;

    // Check exists
    const existing = await Wishlist.findOne({ userId, plotId });

    if (existing) {
      await Wishlist.deleteOne({ _id: existing._id });
      return res.json({ saved: false, message: "Removed from wishlist" });
    }

    await Wishlist.create({ userId, plotId });
    res.json({ saved: true, message: "Added to wishlist" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addWishlist = async (req, res) => {
  try {
    const { plotId } = req.body;

    if (!plotId) {
      return res.status(400).json({ success: false, message: "plotId is required" });
    }

    // Save item
    const saved = await Wishlist.create({ plotId });

    res.json({ success: true, saved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.removeWishlist = async (req, res) => {
  try {
    const { plotId } = req.body;

    const removed = await Wishlist.findOneAndDelete({ plotId });

    res.json({ success: true, removed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
