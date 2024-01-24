const express = require("express");
const { addQuestion, getAllQuestion, getQuesByChoice } = require("../controller/questionPaper");
const router = express.Router();

router.post("/addQuestion", addQuestion);
router.get("/getallquestion", getAllQuestion);
router.get("/getquesbychoice", getQuesByChoice);

module.exports = router;