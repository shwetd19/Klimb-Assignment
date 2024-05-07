const Candidate = require("../models/Candidate");
const excelToJson = require("convert-excel-to-json");

exports.uploadCandidates = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const excelData = excelToJson({
      source: req.file.buffer,
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

    const candidates = excelData["Sheet1"];

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

exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json({ candidates });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
