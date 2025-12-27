// routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/wishlistController');

// Routes
router.get('/wishlist', authMiddleware, getWishlist);
router.post('/wishlist/add', authMiddleware, addToWishlist);
router.post('/wishlist/remove', authMiddleware, removeFromWishlist);

module.exports = router;