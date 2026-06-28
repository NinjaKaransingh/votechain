const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    role: {
      type: String,
      enum: ["voter", "candidate"],
      default: "voter",
    },
    state: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }, //adds createdAt and updateAt automatically
);

module.exports = mongoose.model("User", UserSchema);
