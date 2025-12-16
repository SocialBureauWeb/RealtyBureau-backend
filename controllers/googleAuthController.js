const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  try {
    console.log("req.body",req.body);
    const { credential } = req.body;
    console.log("c",credential);
    
    if (!credential)
      return res.status(400).json({ message: "No credential received" });

    // VERIFY TOKEN WITH GOOGLE
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
console.log("t",ticket);

    const payload = ticket.getPayload();

    const { sub, name, email, picture } = payload; // Google data
    const normalizedEmail = email && email.trim().toLowerCase();

    // CHECK IF USER EXISTS
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // CREATE NEW GOOGLE USER
      user = await User.create({
        name,
        email: normalizedEmail,
        googleId: sub,
        picture
      });
    }

    // JWT TOKEN
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({
      success: true,
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
      
    }
  
  );

  

  } catch (err) {
    console.error("Google Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Accepts already-decoded Google user info (used by frontend signup flow)
exports.googleAuth = async (req, res) => {
  try {
    const { name, email, picture, googleId } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    const normalizedEmail = email && email.trim().toLowerCase();

    // FIND OR CREATE USER
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        name,
        email: normalizedEmail,
        googleId,
        picture
      });
    } else if (!user.googleId) {
      // attach googleId if user registered earlier with email/password
      user.googleId = googleId;
      if (picture) user.picture = picture;
      await user.save();
    }

    // JWT TOKEN
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Google auth successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture
      }
    });

  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
