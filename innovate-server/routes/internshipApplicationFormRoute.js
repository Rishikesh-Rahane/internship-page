const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require('path') 
const { internshipForm } = require('../model/internshipForm')

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    return cb(null, "./resume")
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`)
  }
})

const upload = multer({storage})

router.post('/applyInternshipApplication', upload.single('file'), async(req, res) => {
  try{
    const StringifiedQuestionaire = JSON.parse(req.body.questionAnswerPair);
    console.log(StringifiedQuestionaire)
    console.log(req.body.file)

    // const dataFromBody ={
    //   email:req.body.email,
    //   mobileNumber:req.body.mobileNumber,
    //   preferredProfile:req.body.preferredProfile,
    //   preferredSubProfile:req.body.preferredSubProfile,
    //   resumeUrl:req.body.resumeUrl,
    //   questionAnswerPair:StringifiedQuestionaire
    // }
      const newInternshipModule = new internshipForm({
        email:req.body.email,
        mobileNumber:req.body.mobileNumber,
        preferredProfile:req.body.preferredProfile,
        preferredSubProfile:req.body.preferredSubProfile,
        resumeUrl:`${req.body.email}_resume`,
        questionAnswerPair:StringifiedQuestionaire
        })
      await newInternshipModule.save()
      console.log("created")
      return res.status(200).send({message:"File uploaded",data:newInternshipModule})
  }catch(err){
     console.log(err)
     return res.status(400).send({error:err})
  }
})
module.exports = router;
