/* 
  Name of Module: Profile view Module 
  Purpose:  This controller contains functions for accessing thier profile content.
  Developed by : Jamal Mydeen
*/
const  User   = require('../model/signUp')

const Myprofile = async (req, res) => {
   try{
    const userProfile = await User.findOne({email:req.body.email}) 
    // checks if user exists or not , if yes then proceed
    if (userProfile) {
      return res.status(201).json({ message: "Success", data: userProfile });
    }else{
       return res.status(400).json({message:"No user found"})
    }
   }catch(error){
    res.status(400).json(error);
   }
}

module.exports = {  Myprofile };