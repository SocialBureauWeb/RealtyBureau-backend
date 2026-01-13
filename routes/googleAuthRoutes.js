const express = require("express");
const router = express.Router();

const {
  googleLogin,
  googleAuth
} = require("../controllers/googleAuth");

router.post("/login", googleLogin);
router.post("/auth", googleAuth);

module.exports = router;
