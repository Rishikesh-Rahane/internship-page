const Question = require('../model/question')

exports.addQuestion = async (req,res) =>{

    try {
       
        const newQuestion = await Question.create(req.body);

        return res.status(200).json({
            success:true,
            data:newQuestion,
            message:"question added"
        })
        
    } 
    catch (error) {
        return res.status(500).json({
            success:false,
            error:error.message,
            message:"question not added"
        })
       
    }

   
}

exports.getAllQuestion = async (req,res) =>{

    try {
        const allQues = await Question.find({})

        return res.status(200).json({
            success:true,
            data:allQues,
            message:"data fetched successfully"
        })
        
    } 
    catch (error) {
        return res.status(400).json({
            success:false,
            error:error.message,
            message:"data fetching was unsuccessful"
        })
       
    }

   
}

exports.getQuesByChoice = async (req,res) =>{

    try {
        const {subject,paperType,collegeOrSchool,degreeOrStandard,branchOrBoard} = req.body

        const filter = {};
        if (subject) filter['subject'] = subject;
        if (paperType) filter['paperType'] = paperType;
        if (collegeOrSchool) filter['collegeOrSchool'] = collegeOrSchool;
        if (degreeOrStandard) filter['degreeOrStandard'] = degreeOrStandard;
        if (branchOrBoard) filter['branchOrBoard'] = branchOrBoard;

   
        const allQues = await Question.find(filter)

        return res.status(200).json({
            success:true,
            data:allQues,
            message:"data fetched successfully"
        })
        
    } 
    catch (error) {
        return res.status(400).json({
            success:false,
            error:error.message,
            message:"data fetching was unsuccessful"
        })
       
    }

   
}