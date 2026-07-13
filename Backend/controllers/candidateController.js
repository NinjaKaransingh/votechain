const Candidate = require("../models/Candidate");
const createUserAccount = require("../utils/createUserAccount");

// ── REGISTER AS CANDIDATE ──
const registerCandidate = async (req, res) => {
  try {
    const { name, email, password, state, party, position, bio, photo } =
      req.body;

    const { user, token } = createUserAccount({
      name,
      email,
      password,
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
