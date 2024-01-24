const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const gptRouter = require("./routes/GPT.js");
const LoginOrSignUp = require("./routes/loginOrSignUp");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5500;
const internshipApplication = require("./routes/internshipApplicationFormRoute.js");
const promotionalBanner = require("./routes/banner.js");
const Profile = require('./routes/profile-1.js')
const editprofile = require('./routes/editprofile.js')
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("DataBase is connected"))
  .catch((err) => {
    console.log("Error while connecting to db :(");
    console.log(err);
  });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({ secret: "your_secret_key", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/banner", promotionalBanner);
app.use("/", gptRouter);
app.use("/api", internshipApplication);
const ques = require("./routes/questionRoute.js")
app.use("/api/question", ques)
app.use("/api", LoginOrSignUp);
app.use("/api",editprofile)
app.use('/api/profile',Profile);
app.listen(PORT, (req, res) => {
  console.log(`server running on port : ${PORT}`);
});
