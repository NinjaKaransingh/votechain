const express = require("express");
const router = express.Router();
const {
  createPoll,
  getAllPolls,
  getPollById,
  addCandidateToPoll,
} = require("../controllers/pollController.js");

const { protect } = require("../middlewares/authMiddleware");

router.post("/create", protect, createPoll);
router.get("/", getAllPolls);
router.get("/:id", getPollById);
router.post("/:id/add-candidate", protect, addCandidateToPoll);

module.exports = router;
