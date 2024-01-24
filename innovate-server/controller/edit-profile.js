const user = require("../model/signUp");
const userOTPModel = require("../model/userOTP");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");

const profileEdit = async (req, res) => {
  const body = req.body;
  const profile = await user.findOne({ email: body.email });

  if(!profile){
    return res.status(400).send({message:"USER DOESNT EXISTS"})
  }
  if (body.newMobileNumber?.length !== 0 && profile.verifiedMobile === false) {
    return res.status(400).send({ message: "Mobile number not verified" });
  }
  if (body.newEmail?.length !== 0 && profile.verifiedEmail === false) {
    return res.status(400).send({ message: "Email number not verified" });
  }

  profile.schoolCollegeName =
    body.schoolCollegeName?.length !== 0
      ? body.schoolCollegeName
      : profile.schoolCollegeName;

  if (body.newMobileNumber?.length !== 0 && profile.verifiedMobile === true) {
    profile.mobileNumber = body.newMobileNumber;
    profile.verifiedMobile = false; /// this is for new mobile number verifyyy no serious issue
  }

  if (body.newEmail.length !== 0 && profile.email === true) {
    profile.email = body.newEmail;
    profile.verifiedEmail = false; /// this is for new mobile number verifyyy no serious issue
  }

  profile.classDegree =
    body.classDegree?.length !== 0 ? body.classDegree : profile.classDegree;

  profile.address = body.address?.length !== 0 ? body.address : profile.address;

  profile.preferredLanguage =
    body.preferredLanguage?.length !== 0
      ? body.preferredLanguage
      : profile.preferredLanguage;

  profile.profilePicture = body.profilePicture
    ? body.profilePicture
    : profile.profilePicture;

  await profile.save();
  return res.status(200).send({ message: "Updated", data: profile });
};



const sendMobileOtp = async (req, res) => {
  try {
    const { email, mobileNumber } = req.body;
    console.log(mobileNumber);

    // checking if the student already exists in the database
    const oldStudentPhone = await user.findOne({ mobileNumber });

    //if student exists then send an error to the frontend
    if (oldStudentPhone) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this phoneNumber",
      });
    }
    const user_detail = await user.findOne({ email: email });
    //creating a new Otp
    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // hashing the otp
    const hashedOtp = await bcrypt.hash(otp, 10);

    // sending otp to the mobile number of the user
    const client = new twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    await client.messages.create({
      body: `Your One Time Password is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
      to: `+91${mobileNumber}`, //
    });

    // creating otp entry in the database with phoneNumber as well

    let user_OTPs = await userOTPModel.findOne({ user: user_detail._id });
    if (!user_OTPs) {
      const createOTPSection = new userOTPModel({
        user: user_detail._id,
        mobileOTP: "EMPTY",
        emailOTP: "EMPTY",
        mobileOTPExpiry: new Date(),
        emailOTPExpiry: new Date(),
      });
      await createOTPSection.save();
    }

    user_OTPs = await userOTPModel.findOne({ user: user_detail._id });
    user_OTPs.mobileOTP = hashedOtp;
    user_OTPs.mobileOTPExpiry = Date.now() + 1000 * 60;
    await user_OTPs.save();

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to the number",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      err,
    });
  }
};

//route to verify the otp
const verifyMobileOtp = async (req, res, next) => {
  try {
    //taking the required fields
    const { mobileNumber, email, otp } = req.body;

    const user_detail = await user.findOne({ email: email });

    if (!user_detail) {
      return res.status(400).json({
        success: false,
        message:
          "User does'nt exist , what updation are you trying to perform ?",
      });
    }

    // if any of the two fields are not there then throw an error
    if (!mobileNumber || !otp || !email) {
      return res.status(400).json({
        success: false,
        message: "Both mobileNumber and otp are required.",
      });
    }

    // checking if the student already exists in the database
    const oldStudentPhone = await user.findOne({ mobileNumber });

    //if student exists then send an error to the frontend
    if (oldStudentPhone) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this phoneNumber",
      });
    }

    //checking if otp has been generated or not
    const user_OTPs = await userOTPModel.findOne({ user: user_detail._id });

    //if otp is not already there, then send an error
    if (!user_OTPs || user_OTPs.mobileOTP === "EMPTY") {
      return res.status(400).json({
        success: false,
        message: "No OTP has been generated with this phone number",
      });
    }

    //if otp has expired then throw error
    if (user_OTPs.mobileOTPExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // comparing the given otp with hashed otp(which resides in the database)
    const isMatched = await bcrypt.compare(String(otp), user_OTPs.mobileOTP);

    //if otp doesn't match then send an error
    if (!isMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    //setting the status of verification of student to be "done"
    user_detail.verifiedMobile = true;
    await user_detail.save();

    user_OTPs.mobileOTP = "EMPTY";
    await user_OTPs.save();

    //send response back to the frontend that the user has been created
    res.status(200).json({
      success: true,
      message: "User Verified successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      err,
    });
  }
};

const sendEmailOtp = async (req, res) => {
  try {
    const { NEWemail, email } = req.body;
    console.log(email);

    // checking if the student already exists in the database
    const oldStudentEmail = await user.findOne({ email: NEWemail });

    //if student exists then send an error to the frontend
    if (oldStudentEmail) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this EMail",
      });
    }

    const user_detail = await user.findOne({ email: email });
    //creating a new Otp
    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // hashing the otp
    const hashedOtp = await bcrypt.hash(otp, 10);

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: req.body.email,
      subject: "EMAIL VERIFICATION",
      text: `Your One Time Password is ${otp}`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(400).send({
          message: "Email sent failed.",
        });
      } else {
        console.log(info);
        res.status(200).send({
          message: "Email sent successfully.",
        });
      }
    });

    // creating otp entry in the database with phoneNumber as well

    let user_OTPs = await userOTPModel.findOne({ user: user_detail._id });
    if (!user_OTPs) {
      const createOTPSection = new userOTPModel({
        user: user_detail._id,
        mobileOTP: "EMPTY",
        emailOTP: "EMPTY",
        mobileOTPExpiry: new Date(),
        emailOTPExpiry: new Date(),
      });
      await createOTPSection.save();
    }

    user_OTPs = await userOTPModel.findOne({ user: user_detail._id });
    user_OTPs.emailOTP = hashedOtp;
    user_OTPs.emailOTPExpiry = Date.now() + 1000 * 60;
    await user_OTPs.save();

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to the number",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      err,
    });
  }
};

//route to verify the otp
const verifyEmailOtp = async (req, res) => {
  try {
    //taking the required fields
    const { Newemail, email, otp } = req.body;

    const user_detail = await user.findOne({ email: email });

    if (!user_detail) {
      return res.status(400).json({
        success: false,
        message:
          "User does'nt exist , what updation are you trying to perform ?",
      });
    }

    // if any of the two fields are not there then throw an error
    if (!Newemail || !otp || !email) {
      return res.status(400).json({
        success: false,
        message: "Both New email  and otp are required.",
      });
    }

    // checking if the student already exists in the database
    const oldStudentEMail = await user.findOne({ email: Newemail });

    //if student exists then send an error to the frontend
    if (oldStudentEMail) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this Email",
      });
    }

    //checking if otp has been generated or not
    const user_OTPs = await userOTPModel.findOne({ user: user_detail._id });

    //if otp is not already there, then send an error
    if (!user_OTPs || user_OTPs.emailOTP === "EMPTY") {
      return res.status(400).json({
        success: false,
        message: "No OTP has been generated with this Email",
      });
    }

    //if otp has expired then throw error
    if (user_OTPs.emailOTPExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // comparing the given otp with hashed otp(which resides in the database)
    const isMatched = await bcrypt.compare(String(otp), user_OTPs.emailOTP);

    //if otp doesn't match then send an error
    if (!isMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    //setting the status of verification of student to be "done"
    user_detail.verifiedEmail = true;
    await user_detail.save();

    user_OTPs.emailOTP = "EMPTY";
    await user_OTPs.save();

    //send response back to the frontend that the user has been created
    res.status(200).json({
      success: true,
      message: "User Verified successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      err,
    });
  }
};

module.exports = { profileEdit , verifyEmailOtp , sendEmailOtp , sendMobileOtp , verifyMobileOtp};
