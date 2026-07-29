const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // 🔥 Validation
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashed
    });

    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const secret = process.env.JWT_SECRET;

  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password required" });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  if (!secret ) {
    return res.status(500).json({ error: "JWT_SECRET not set"});
  }
  
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
});

module.exports = router;