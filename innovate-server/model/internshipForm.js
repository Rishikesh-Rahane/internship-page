const mongoose = require("mongoose");

const internshipFormSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  preferredProfile: {
    type: String,
    enum: ["IT", "Non IT"],
    required: true,
  },
  preferredSubProfile: {
    type: String,
    enum: [
      "UI/UX Designer Intern",
      "Frontend Developer Intern",
      'Backend Developer Intern',
      "DevOps Intern",
      "Human Resource Management Intern",
      "Social Media Marketing Intern",
      "Digital Marketing and Branding Intern",
      "Business Development Intern",
    ],
    required: true,
  },
  resumeUrl: {
    type: String,
  },
  questionAnswerPair: [
    {
      question: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
    },
  ],
});
const internshipForm = mongoose.model("internshipForm", internshipFormSchema);
module.exports = { internshipForm };
