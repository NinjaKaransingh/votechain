const Poll = require("../models/Poll");
const Candidate = require("../models/Candidate");

// ── CREATE POLL ──
const createPoll = async (req, res) => {
  try {
    const { title, description, region, startDate, endDate } = req.body;

    //1. Create the poll
    const poll = await Poll.create({
      title,
      description,
      region,
      startDate,
      endDate,
      createdBy: req.user._id, // userId of admin who created it
      candidates: [], // empty at first, candidates added later
      isActive: true,
    });

    res.status(201).json({
      message: "Poll created successfully",
      poll,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ── GET ALL POLLS ──
const getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find({ isActive: true })
      .populate({
        path: "candidates",
        populate: {
          path: "userId",
          select: "name email state",
        },
      })
      .populate("createdBy", "name email");

    res.status(200).json(polls);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ── GET SINGLE POLL ──
const getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id)
      .populate({
        path: "candidates",
        populate: {
          path: "userId",
          select: "name email state",
        },
      })
      .populate("createdBy", "name email");

    if (!poll)
      return res.status(400).json({
        message: "Poll not found",
      });
    res.status(200).json(poll);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ── ADD CANDIDATE TO POLL ──
const addCandidateToPoll = async (req, res) => {
  try {
    const { candidateId } = req.body;
    const pollId = req.params.id;

    // 1. Check poll exists
    const poll = await Poll.findById(pollId);
    if (!poll)
      return res.status(400).json({
        message: "Poll not found",
      });

    // 2. Check candidate exists
    const candidate = await Candidate.findById(candidateId);
    if (!candidate)
      return res.status(400).json({
        message: "Candidate not found",
      });

    // 3. Check if candidate already in poll
    if (poll.candidates.includes(candidateId))
      return res.status(400).json({
        message: "Candidate already in this poll",
      });

    // 4. Add candidate to poll
    poll.candidates.push(candidateId);
    await poll.save();

    res.status(201).json({
      message: "Candidate added to poll",
      poll,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = { createPoll, getAllPolls, getPollById, addCandidateToPoll };
