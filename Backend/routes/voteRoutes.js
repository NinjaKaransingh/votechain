const express = require("express");
const router = express.Router();
const { castVote, getResults } = require("../controllers/voteController");
const { protect } = require("../middlewares/authMiddleware");

// Cast a vote
router.post("/cast", protect, castVote); // must be logged in — voterId comes from the token

// Get results for a poll
router.get("/results/:pollId", getResults); // public, anyone can view live results

module.exports = router;
