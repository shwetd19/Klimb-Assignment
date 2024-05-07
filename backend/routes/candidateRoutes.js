const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");

router.post("/upload", candidateController.uploadCandidates);

router.get("/", candidateController.getAllCandidates);

module.exports = router;
