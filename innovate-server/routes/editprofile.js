const Express = require("express");
const { profileEdit , verifyEmailOtp , sendEmailOtp , sendMobileOtp , verifyMobileOtp} = require('../controller/edit-profile.js');
const Router = Express.Router();

Router.post('/editprofile',profileEdit)
Router.post('/otpgenerateEmail',sendEmailOtp)
Router.post('/otpgenerateMobile',sendMobileOtp) 
Router.post('/verifyEmailOtp',verifyEmailOtp) 
Router.post('/verifyMobileOtp',verifyMobileOtp)

module.exports = Router;