const express = require("express");
const router = express.Router();
const { castVote, getResults } = require("../controllers/voteController");

// Cast a vote
router.post("/cast", castVote);

// Get results for a poll
router.get("/results/:pollId", getResults);

module.exports = router;
