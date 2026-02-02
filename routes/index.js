const express = require("express");
const plotRoutes = require("./plotRoutes");
const uploadRoutes = require("./uploadRoutes");
const wishlistRouter = require("./wishlistRoutes");
const router = express.Router();

router.use(express.json());

router.use("/plot", plotRoutes);
router.use("/upload", uploadRoutes);
router.use("/api/wishlist", wishlistRouter);

module.exports = router;