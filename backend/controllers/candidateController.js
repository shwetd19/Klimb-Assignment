const Candidate = require("../models/Candidate");
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
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
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

    const results = await Promise.all(
      candidates.map(async (candidate) => {
        try {
          const existingCandidate = await Candidate.findOne({ email: candidate.email });
          if (!existingCandidate) {
            await Candidate.create(candidate);
            return { success: true, candidate };
          } else {
            console.warn("Skipping candidate with duplicate email:", candidate.email);
            return { success: false, candidate };
          }
        } catch (error) {
          console.error("Error uploading candidate:", error);
          return { success: false, candidate, error };
        }
      })
    );

    const successfulUploads = results.filter(result => result.success);
    const failedUploads = results.filter(result => !result.success);

    res.status(201).json({
      message: "Candidates processed successfully",
      successfulUploads: successfulUploads.length,
      failedUploads: failedUploads.length,
      details: failedUploads.map(result => ({
        candidate: result.candidate,
        error: result.error?.message || "Unknown error"
      }))
    });
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
