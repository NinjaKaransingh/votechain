const Vote = require("../models/Vote");
const Candidate = require("../models/Candidate");
const Poll = require("../models/Poll");

const castVote = async (req, res) => {
  try {
    const { candidateId, pollId } = req.body;
    const voterId = req.user._id; // taken from the verified JWT — never trust a client-sent voterId

    // 1. Check if poll exists and is active
    const poll = await Poll.findById(pollId);

    if (!poll)
      return res.status(400).json({
        message: "Poll not found",
      });

    if (!poll.isActive)
      return res.status(400).json({
        message: "This poll is closed",
      });

    if (poll.endDate && new Date() > new Date(poll.endDate)) {
      return res.status(400).json({ message: "This poll has ended" });
    }

    // 2. Check if candidate is actually in this poll
    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({
        message: "Candidate not found",
      });
    }

    if (!poll.candidates.map(String).includes(String(candidateId))) {
      return res
        .status(400)
        .json({ message: "Candidate is not part of this poll" });
    }

    // 3. Check if voter already voted in this poll
    // This is the FIRST layer of protection (controller level)
    const alreadyVoted = await Vote.findOne({ voterId, pollId });

    if (alreadyVoted)
      return res.status(400).json({
        message: "You have already voted in this poll",
      });

    // 4. Create the vote record
    // The SECOND layer of protection is the unique index on Vote model
    // VoteSchema.index({ voterId: 1, pollId: 1 }, { unique: true })
    // Even if step 3 fails due to a race condition, MongoDB will block it
    const vote = await Vote.create({
      voterId,
      candidateId,
      pollId,
    });

    // 5. Increment candidate voteCount
    await Candidate.findByIdAndUpdate(candidateId, { $inc: { voteCount: 1 } }); // $inc adds 1 to voteCount

    res.status(201).json({
      message: "Vote cast successfully",
      vote,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already voted in this poll" });
    }
    res.status(500).json({ message: err.message });
  }
};

// ── GET RESULTS ──

const getResults = async (req, res) => {
  try {
    const { pollId } = req.params;

    // 1. Check poll exists
    const poll = await Poll.findById(pollId);

    if (!poll)
      return res.status(400).json({
        message: "Poll not found",
      });

    // 2. Get all votes for this poll grouped by candidate
    const results = await Vote.aggregate([
      { $match: { pollId: poll._id } },
      { $group: { _id: "$candidateId", voteCount: { $sum: 1 } } }, // fixed: was "candidateId" (missing $), which grouped everything into one bucket
      { $sort: { voteCount: -1 } },
    ]);

    // 3. Get total votes
    const totalVotes = results.reduce((sum, r) => sum + r.voteCount, 0);

    // 4. Populate candidate details for each result
    const enriched = await Promise.all(
      results.map(async (r) => {
        const candidate = await Candidate.findById(r._id).populate(
          "userId",
          "name state",
        );
        return {
          candidateId: r._id,
          name: candidate?.userId?.name,
          state: candidate?.userId?.state,
          party: candidate?.party,
          position: candidate?.position,
          voteCount: r.voteCount,
          percentage:
            totalVotes > 0
              ? ((r.voteCount / totalVotes) * 100).toFixed(1)
              : "0.0",
        };
      }),
    );

    // Include candidates with 0 votes so the frontend can render every candidate, not just ones with votes
    const votedIds = new Set(results.map((r) => String(r._id)));
    const zeroVoteIds = poll.candidates.filter(
      (id) => !votedIds.has(String(id)),
    );
    const zeroVoteCandidates = await Candidate.find({
      _id: { $in: zeroVoteIds },
    }).populate("userId", "name state");

    zeroVoteCandidates.forEach((c) => {
      enriched.push({
        candidateId: c._id,
        name: c.userId?.name,
        state: c.userId?.state,
        party: c.party,
        position: c.position,
        voteCount: 0,
        percentage: "0.0",
      });
    });

    res
      .status(200)
      .json({
        pollId: poll._id,
        poll: poll.title,
        totalVotes,
        results: enriched,
      });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = { castVote, getResults };
