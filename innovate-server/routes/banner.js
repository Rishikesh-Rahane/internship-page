/*
  Developed by:- Bijendra Kumar
  Module Name:- Routes for Promotional Banner
*/
const express = require("express");
const router = express.Router();
const {
  getActivePromotionalBannerDetails,
  addPromotionalBannerDetails,
  updatePromotionalBannerDetails,
  deletePromotionalBannerDetails,
} = require("../controller/banner.controller");

// Get active promotional banner from database
router.get(
  "/activePromotionalBannerDetails/:bannerId",
  getActivePromotionalBannerDetails
);

// Add a new promotional banner into database
router.post("/addPromotionalBannerDetails", addPromotionalBannerDetails);

// Update an existing promotional banner into database
router.patch(
  "/updatePromotionalBannerDetails/:bannerId",
  updatePromotionalBannerDetails
);

// Delete an existing promotional banner from database
router.delete(
  "/deletePromotionalBannerDetails/:bannerId",
  deletePromotionalBannerDetails
);

module.exports = router;
