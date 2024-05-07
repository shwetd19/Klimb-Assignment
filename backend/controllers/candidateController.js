const Candidate = require("../models/Candidate");
const excelToJson = require("convert-excel-to-json");

exports.uploadCandidates = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const excelData = excelToJson({
      source: req.file.buffer, // Use req.file.buffer instead of req.file.path
      header: { rows: 1 },
      columnToKey: {
        A: "name",
        B: "email",
        C: "mobileNo",
        D: "dob",
        E: "workExperience",
        F: "resumeTitle",
        G: "currentLocation",
        H: "postalAddress",
        I: "currentEmployer",
        J: "currentDesignation",
      },
    });

    const candidates = excelData["Sheet1"]; // Assuming Sheet1 is the name of the sheet in Excel

    await Candidate.insertMany(candidates);

    res.status(201).json({
      message: "Candidates uploaded successfully",
      candidates: candidates,
    });
  } catch (error) {
    console.error("Error uploading candidates:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
