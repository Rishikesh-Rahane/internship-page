const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  gender: {
    type: String,
  },
  dob: {
    type: Date,
  },
  schoolCollegeName: {
    type: String,
  },
  classDegree: {
    type: String,
  },
  board: {
    type: String,
  },
  mobileNumber: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  address:{
    type:String,
  },
  preferredLanguage:{
    type:String
  },
  profilePicture :{
    type:{}
  },
  verifiedMobile:{
    type:Boolean,
    default:false
  },
  verifiedEmail:{
    type:Boolean,
    default:false
  },
  googleId: String,
});

const User = mongoose.model("User", userSchema, "userdata");

module.exports = User;
