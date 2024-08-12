const Candidate = require("../models/Candidate");
const async = require("async");
const excel = require("exceljs");

exports.uploadCandidates = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = new excel.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const worksheet = workbook.getWorksheet(1);

    const candidates = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber !== 1) {
        candidates.push({
          name: row.getCell(1).value,
          email: row.getCell(2).value,
          mobileNo: row.getCell(3).value,
          dob: row.getCell(4).value,
          workExperience: row.getCell(5).value,
          resumeTitle: row.getCell(6).value,
          currentLocation: row.getCell(7).value,
          postalAddress: row.getCell(8).value,
          currentEmployer: row.getCell(9).value,
          currentDesignation: row.getCell(10).value,
        });
      }
    });

    async.eachSeries(
      candidates,
      async (candidate) => {
        try {
          const existingCandidate = await Candidate.findOne({
            email: candidate.email,
          });
          if (!existingCandidate) {
            await Candidate.create(candidate);
          } else {
            console.error(
              "Skipping candidate with duplicate email:",
              candidate
            );
          }
        } catch (error) {
          console.error("Error uploading candidate:", error);
          throw error;
        }
      },
      (err) => {
        if (err) {
          console.error("Error processing candidates:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        res.status(201).json({
          message: "Candidates uploaded successfully",
          candidates: candidates,
        });
      }
    );
  } catch (error) {
    console.error("Error uploading candidates:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
