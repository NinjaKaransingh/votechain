const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createUserAccount = require("../utils/createUserAccount");

//Register

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, state } = req.body;

    const { user, token } = await createUserAccount({
      name,
      email,
      password,
      role,
      state,
    });

    // 5. Send response
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        state: user.state,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ── LOGIN ──

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({
        message: "Invalid credentials",
      });

    // 3. Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );

    // 4. Send response
    res.status(200).json({
      message: "User Loggedin successfully",
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        state: user.state,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ── GET CURRENT USER (used by frontend on page load to check if the token is still valid) ──
const getMe = async (req, res) => {
  res.status(200).json({ user: req.user });
};

module.exports = { registerUser, loginUser, getMe };
