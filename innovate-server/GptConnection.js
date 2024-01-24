const OpenAI = require("openai");
const dotenv = require("dotenv");
require("dotenv").config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
});

module.exports = openai;
