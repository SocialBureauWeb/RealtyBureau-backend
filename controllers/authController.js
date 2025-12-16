const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.signup = async (req, res) => {


  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });
    
    const passwordRegex =  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#^-_])[A-Za-z\d@$!%*?&#^-_]{8,}$/;
      
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Password must contain at least 8 characters, including one letter, one number, and one special character" });
    }
    

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash
    });

    res.json({
      success: true,
      message: "Signup successful",
      user
    });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.loginUser =  async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email not registered" });

    // compare plain password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};