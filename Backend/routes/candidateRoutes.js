const express = require("express");
const router = express.Router();
const {
  registerCandidate,
  getAllCandidates,
} = require("../controllers/candidateController");

router.post("/register", registerCandidate);
router.get("/", getAllCandidates);

module.exports = router;
