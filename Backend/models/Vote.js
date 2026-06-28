const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema(
  {
    voterId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    candidateId: {
      type: mongoose.Schema.ObjectId,
      ref: "Candidate",
      required: true,
    },
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
    },
  },
  { timestamps: true },
);

// Prevent a voter from voting twice in the same poll
VoteSchema.index(
  {
    voterId: 1,
    pollId: 1,
  },
  {
    unique: true,
  },
);

module.exports = mongoose.model("Vote", VoteSchema);
