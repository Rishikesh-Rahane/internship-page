const express = require("express");
const loginOrSignUp = require("../controller/loginOrSignUp");

const router = express.Router();

router.get("/auth/google", loginOrSignUp.googleAuth);
router.get("/auth/google/callback", loginOrSignUp.googleAuthCallback);
router.post("/traditionalsignup", loginOrSignUp.traditionalSignup);
router.post("/login", loginOrSignUp.login);
router.post("/forgot-password", loginOrSignUp.forgotPassword);
router.post("/reset-password", loginOrSignUp.resetPassword);

module.exports = router;
