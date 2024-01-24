const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/signUp");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const nodemailer = require("nodemailer");
require("dotenv").config();

const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Passport setup for Google authentication
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_LOGIN_CLIENT_ID,
      clientSecret: process.env.GOOGLE_LOGIN_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if either email or Google ID exists in the database
        const existingUserByEmail = await User.findOne({
          email: profile.emails[0].value,
        });
        const existingUserByGoogleId = await User.findOne({
          googleId: profile.id,
        });

        if (existingUserByEmail) {
          // Email already exists, log them in
          return done(null, existingUserByEmail);
        } else if (existingUserByGoogleId) {
          // Google ID (profile ID) already exists, log them in
          return done(null, existingUserByGoogleId);
        }

        // User doesn't exist, create a new account
        const newUser = new User({
          // Use email as the unique identifier if profile.id is not available
          googleId: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
        });

        await newUser.save();

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Route for initiating Google authentication
exports.googleAuth = passport.authenticate("google", {
  scope: ["https://www.googleapis.com/auth/plus.login", "profile", "email"],
});

// Callback after Google authentication
exports.googleAuthCallback = (req, res, next) => {
  passport.authenticate("google", {
    failureRedirect: "/", // Redirect to home page on failure
  })(req, res, next); // Pass in the function and call it with (req, res, next)

  // Redirect to home page or any other desired page on successful authentication
  res.redirect("/");
};

exports.traditionalSignup = async (req, res) => {
  const {
    firstName,
    lastName,
    gender,
    dob,
    schoolCollegeName,
    classDegree,
    board,
    mobileNumber,
    email,
    password,
    confirmPassword,
  } = req.body;

  // Validate that password and confirmPassword match
  if (password !== confirmPassword) {
    return res.status(400).json({
      status: res.statusCode,
      success: false,
      error: "Passwords don't match",
      message: "Signup unsuccessful",
    });
  }

  try {
    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    // Check if mobile number already exists
    const existingMobileNumber = await User.findOne({ mobileNumber });

    if (existingEmail && existingMobileNumber) {
      return res.status(400).json({
        status: res.statusCode,
        success: false,
        error:
          "Both email and mobile number already exist. Please try another one.",
        message: "Signup unsuccessful",
      });
    } else if (existingEmail) {
      return res.status(400).json({
        status: res.statusCode,
        success: false,
        error: "Email already exists. Please try another one.",
        message: "Signup unsuccessful",
      });
    } else if (existingMobileNumber) {
      return res.status(400).json({
        status: res.statusCode,
        success: false,
        error: "Mobile number already exists. Please try another one.",
        message: "Signup unsuccessful",
      });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      gender,
      dob,
      schoolCollegeName,
      classDegree,
      board,
      mobileNumber,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SIGN_IN_KEY,
      {
        expiresIn: "1h", // Token expires in 1 hour
      }
    );

    res.status(200).json({
      status: res.statusCode,
      success: true,
      data: { token, message: "User successfully signed up!" },
      message: "Signup successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: res.statusCode,
      success: false,
      error: "Error saving user to the database.",
      message: "Signup unsuccessful",
    });
  }
};

exports.login = async (req, res) => {
  const { emailOrMobile, password } = req.body;

  // Check if emailOrMobile and password are provided
  if (!emailOrMobile || !password) {
    return res.status(400).json({
      status: res.statusCode,
      success: false,
      error: "Both email/mobile and password are required.",
      message: "Login unsuccessful",
    });
  }

  try {
    // Find the user by email or mobile number
    const user = await User.findOne({
      $or: [{ email: emailOrMobile }, { mobileNumber: emailOrMobile }],
    });

    // If the user is not found, return an error
    if (!user) {
      return res.status(404).json({
        status: res.statusCode,
        success: false,
        error: "User not found. Please check your credentials.",
        message: "Login unsuccessful",
      });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If passwords match, generate JWT token and send success message
    if (passwordMatch) {
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SIGN_IN_KEY,
        {
          expiresIn: "1h", // Token expires in 1 hour
        }
      );

      return res.status(200).json({
        status: res.statusCode,
        success: true,
        data: { token, message: "User successfully logged in!" },
        message: "Login successful",
      });
    } else {
      return res.status(401).json({
        status: res.statusCode,
        success: false,
        error: "Incorrect password. Please try again.",
        message: "Login unsuccessful",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: res.statusCode,
      success: false,
      error: "Error during login. Please try again later.",
      message: "Login unsuccessful",
    });
  }
};

// Route for initiating the password reset process

exports.forgotPassword = async (req, res) => {
  const { emailOrMobile } = req.body;

  try {
    if (!emailOrMobile) {
      return res.status(400).json({
        status: res.statusCode,
        success: false,
        error: "Email/mobile is required to initiate password reset.",
        message: "Password reset initiation unsuccessful",
      });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrMobile }, { mobileNumber: emailOrMobile }],
    });

    if (!user) {
      return res.status(404).json({
        status: res.statusCode,
        success: false,
        error: "User not found. Please check your credentials.",
        message: "Password reset initiation unsuccessful",
      });
    }

    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_RESET_PASSWORD_KEY,
      { expiresIn: "15m" }
    );

    const resetLink = `${process.env.APP_URL}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
      debug: true,
    });

    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: user.email,
      subject: "Password Reset Link",
      html: `<p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return res.status(200).json({
      status: res.statusCode,
      success: true,
      data: null,
      message: "Password reset link sent to your email. Check your inbox.",
    });
  } catch (error) {
    console.error(error);

    // More detailed error handling
    if (error.code === "EAUTH") {
      return res.status(401).json({
        status: res.statusCode,
        success: false,
        error: "Authentication failed. Please check your email credentials.",
        message: "Password reset initiation unsuccessful",
      });
    }

    return res.status(500).json({
      status: res.statusCode,
      success: false,
      error: "Error during password reset initiation. Please try again later.",
      message: "Password reset initiation unsuccessful",
    });
  }
};

// Route for handling password reset
exports.resetPassword = async (req, res) => {
  const { resetToken, newPassword, confirmPassword } = req.body;

  // Validate that newPassword and confirmPassword match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      status: res.statusCode,
      success: false,
      error: "New passwords don't match.",
      message: "Password reset unsuccessful",
    });
  }

  try {
    // Verify the reset token
    const decodedToken = jwt.verify(
      resetToken,
      process.env.JWT_RESET_PASSWORD_KEY
    );

    // Find the user by the decoded user ID
    const user = await User.findById(decodedToken.userId);

    // If the user is not found, return an error
    if (!user) {
      return res.status(404).json({
        status: res.statusCode,
        success: false,
        error: "User not found. Please initiate the reset process again.",
        message: "Password reset unsuccessful",
      });
    }

    // Hash the new password and update it in the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      status: res.statusCode,
      success: true,
      data: null,
      message: "Password successfully reset.",
    });
  } catch (error) {
    console.error(error);

    // More detailed error handling
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({
        status: res.statusCode,
        success: false,
        error:
          "Reset token has expired. Please initiate the reset process again.",
        message: "Password reset unsuccessful",
      });
    }

    return res.status(403).json({
      status: res.statusCode,
      success: false,
      error: "Invalid reset token. Please initiate the reset process again.",
      message: "Password reset unsuccessful",
    });
  }
};
