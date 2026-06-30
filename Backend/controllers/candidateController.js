const User = require("../models/User");
const Candidate = require("../models/Candidate");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ── REGISTER AS CANDIDATE ──
const registerCandidate = async (req, res) => {
  try {
    const { name, email, password, state, party, position, bio, photo } =
      req.body;

    //1. checking whether the candidate is already present
    const existingCandidate = await User.findOne({ email });

    if (existingCandidate)
      return res.status(400).json({
        message: "Candidate already exists",
      });

    //2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3.Create User with role "candidate"
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "candidate",
      state,
    });

    // 4.Create Candidate profile linked to this user
    const candidate = await Candidate.create({
      userId: user._id,
      party,
      position,
      bio,
      photo: photo || "",
      voteCount: 0,
    });

    // 5. Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    //6. Send response
    res.status(201).json({
      message: "Candidate registered successfully",
      token,
      candidate: {
        id: candidate._id,
        name: user.name,
        email: user.email,
        party: candidate.party,
        position: candidate.position,
        bio: candidate.bio,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ── GET ALL CANDIDATES ──

const getAllCandidates = async (req, res) => {
  console.log("reaching to get all");
  try {
    const candidates = await Candidate.find().populate(
      "userId",
      "name email state",
    );
    res.status(200).json(candidates);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = { registerCandidate, getAllCandidates };
