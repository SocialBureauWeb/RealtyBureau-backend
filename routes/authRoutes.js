const express = require("express");
const router = express.Router();

const { signup, loginUser } = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", loginUser);

// Correct import
const { authMiddleware } = require("../middlewares/authMiddleware");

router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Welcome!", user: req.user });
});

module.exports = router;
