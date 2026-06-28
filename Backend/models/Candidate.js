const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User", //links to User model
      required: true,
    },
    party: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      maxLength: 300,
    },
    photo: {
      type: String, //will store image URL/path
      default: "",
    },
    voteCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Candidate", CandidateSchema);
