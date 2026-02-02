// routes/wishlistRoutes.js
const express = require('express');
const wishlistRouter = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/wishlistController');

// Routes
wishlistRouter.get('/wishlist', authMiddleware, getWishlist);
wishlistRouter.post('/wishlist/add', authMiddleware, addToWishlist);
wishlistRouter.post('/wishlist/remove', authMiddleware, removeFromWishlist);

module.exports = wishlistRouter;