// controllers/wishlistController.js
const User = require('../models/User');
const wishlist = require('../models/wishlist');

// GET /api/wishlist - Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Return wishlist as array of plot IDs
    // Filter out nulls (deleted plots) and map to IDs
    const wishlistIds = user.wishlist
      .filter(plot => plot !== null)
      .map(plot => plot._id.toString());

    res.json({
      success: true,
      wishlist: wishlistIds
    });
  } catch (err) {
    console.error('Get wishlist error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch wishlist' });
  }
};

// POST /api/wishlist/add - Add plot to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { plotId } = req.body;

    if (!plotId) {
      return res.status(400).json({ success: false, message: 'Plot ID is required' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if already in wishlist
    if (user.wishlist.includes(plotId)) {
      return res.status(400).json({ success: false, message: 'Already in wishlist' });
    }

    // Add to wishlist
    user.wishlist.push(plotId);
    await user.save();

    res.json({
      success: true,
      message: 'Added to wishlist',
      wishlist: user.wishlist
    });
  } catch (err) {
    console.error('Add to wishlist error:', err);
    res.status(500).json({ success: false, message: 'Failed to add to wishlist' });
  }
};

// POST /api/wishlist/remove - Remove plot from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { plotId } = req.body;

    if (!plotId) {
      return res.status(400).json({ success: false, message: 'Plot ID is required' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Remove from wishlist
    user.wishlist = user.wishlist.filter(id => id.toString() !== plotId.toString());
    await user.save();

    res.json({
      success: true,
      message: 'Removed from wishlist',
      wishlist: user.wishlist
    });
  } catch (err) {
    console.error('Remove from wishlist error:', err);
    res.status(500).json({ success: false, message: 'Failed to remove from wishlist' });
  }
};