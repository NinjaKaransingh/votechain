const express = require("express");
const router = express.Router();
const {
  createPoll,
  getAllPolls,
  getPollById,
  addCandidateToPoll,
} = require("../controllers/pollController.js");

const { protect, authorize } = require("../middlewares/authMiddleware");

router.post("/create", protect, authorize("admin"), createPoll);
router.get("/", getAllPolls);
router.get("/:id", getPollById);
router.post(
  "/:id/add-candidate",
  protect,
  authorize("admin"),
  addCandidateToPoll,
);

module.exports = router;
