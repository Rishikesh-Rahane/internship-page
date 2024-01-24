const { internshipForm } = require("../model/internshipForm");

const applyInternshipApplication = async (req, res) => {
  try {
    const newApplication = new internshipForm(req.body);
    if (newApplication) {
      const result = await newApplication.save();
      res
        .status(201)
        .json({ message: "Application Form Submitted", data: result });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
module.exports = { applyInternshipApplication };
