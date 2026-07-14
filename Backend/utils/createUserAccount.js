const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Single source of truth for "how a User gets created + a token gets issued".
// Used by both authController.registerUser (voter/admin signup) and
// candidateController.registerCandidate (candidate signup), so there's only
// one place to fix if password rules, hashing, or the JWT payload ever change.

const createUserAccount = async ({ name, email, password, role, state }) => {
  // 1. Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const err = new Error("User already exists");
    err.statusCode = 400;
    throw err;
  }

  // 2. Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3. Create the user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "voter",
    state,
  });

  // 4. Generate JWT token
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );

  return { user, token };
};

module.exports = createUserAccount;
