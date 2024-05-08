const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const candidateController = require("../controllers/candidateController");

router.post( "/upload", upload.single("file"), candidateController.uploadCandidates);

router.get("/return", candidateController.getAllCandidates);

module.exports = router;
