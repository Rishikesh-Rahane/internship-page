const mongoose = require("mongoose");

const userOTP = new mongoose.Schema({
  user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "userdata",
  },
  emailOTPExpiry:{
    type:Date
  },
  mobileOTPExpiry:{
    type:Date
  },
  mobileOTP:{
    type:String,
    default:"EMPTY"
  },
  emailOTP:{
    type:String,
    default:"EMPTY"
  }
});

const userotp = mongoose.model("userOTP", userOTP);

module.exports = userotp;