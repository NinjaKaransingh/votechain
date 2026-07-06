const express = require("express");
const router = express.Router();
const {
  createPoll,
  getAllPolls,
  getPollById,
  addCandidateToPoll,
} = require("../controllers/pollController.js");

router.post("/create", createPoll);
router.get("/", getAllPolls);
router.get("/:id", getPollById);
router.post("/:id/add-candidate", addCandidateToPoll);

module.exports = router;
