const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({

    questions: [
        {
          question: String,
          options: [String],
          correctAnswer: String,
        },
    ],
    subject: String,
    paperType: {
        type: String,
        enum: ["Practice", "Mock"],
    },
    collegeOrSchool: {
        type: String,
    },
    degreeOrStandard: {
        type: String,
    },
    branchOrBoard: {
        type: String,
    },
    difficultyLevel: {
        type: String,
    },
    totalTime: {
        type: Number,
    },
    totalMarks: {
        type: Number,
    },
    totalQuestion: {
        type: Number,
    },
    
  });
  

const Question = mongoose.model('Question', questionSchema);
module.exports = Question