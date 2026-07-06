const Vote = require("../models/Vote");
const Candidate = require("../models/Candidate");
const Poll = require("../models/Poll");

const castVote = async (req, res) => {
  try {
    const { voterId, candidateId, pollId } = req.body;

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

    // 2. Check if candidate is actually in this poll
    const candidate = await Candidate.findById(candidateId);

    if (!poll.candidates.includes(candidateId))
      return res.status(400).json({
        message: "Candidate is not part of this poll",
      });

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
      {
        $match: { pollId: poll._id }, // filter by pollId
      },
      {
        $group: {
          _id: "candidateId", // group by candidate
          voteCount: { $sum: 1 }, // count votes per candidate
        },
      },
      { $sort: { voteCount: -1 } }, // sort highest votes first
    ]);

    // 3. Get total votes
    const totalVotes = results.reduce((sum, r) => sum + r.voteCount, 0);

    // 4. Populate candidate details for each result
    const Candidate = require("../models/Candidate");
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

    res.status(200).json({
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
