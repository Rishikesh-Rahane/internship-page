const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
/* Name of Module: Schema for banner
  Purpose: This schema will store the details of banner into database.
  Developed by : Bijendra Kumar 
*/
const promotionalBannerSchema = new mongoose.Schema({
  bannerId: {
    type: String,
    default: uuidv4,
    unique: true,
    required: [true, "Banner ID Required."],
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },

  bannerLink: {
    type: String,
    required: true,
  },
});

const PromotionalBanner = mongoose.model(
  "PromotionalBanner",
  promotionalBannerSchema
);

module.exports = PromotionalBanner;
