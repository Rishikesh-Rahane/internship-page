/* Name of Module: Banner for landing page
  Purpose: This controller contains functions for manupulating banner data into database.
  Developed by : Bijendra Kumar 
*/
const PromotionalBanner = require("../model/PromotionalBanner");
//gets the active banner data from database.
const getActivePromotionalBannerDetails = async (req, res) => {
  try {
    const currentDate = new Date().toISOString();
    const banner = await PromotionalBanner.findOne({
      bannerId: req.params.bannerId,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    });
    if (banner) {
      res.status(200).json({
        success: true,
        data: banner,
        message: "Active promotional banner retrieved successfully",
      });
    } else {
      res.status(200).json({
        success: false,
        message: "No active promotional banner found at the current date",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
};
//Adding Promotional Banner details to database.
const addPromotionalBannerDetails = async (req, res) => {
  try {
    const bannerData = req.body;

    if (!bannerData || !bannerData.startDate || !bannerData.endDate) {
      throw new Error(
        "Invalid banner data. Both 'startDate' and 'endDate' are required."
      );
    }

    const newBanner = new PromotionalBanner(bannerData);
    const savedBanner = await newBanner.save();

    res.status(201).json({
      success: true,
      data: savedBanner,
      message: "Promotional banner added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
};

// Update an existing promotional banner details into database.
const updatePromotionalBannerDetails = async (req, res) => {
  try {
    const bannerId = req.params.bannerId;
    const updatedBannerData = req.body;

    const updatedBanner = await PromotionalBanner.findByIdAndUpdate(
      bannerId,
      updatedBannerData,
      { new: true }
    );

    if (updatedBanner) {
      res.status(200).json({
        success: true,
        data: updatedBanner,
        message: "Promotional banner updated successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Promotional banner not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
};

// Delete an existing promotional banner from database.
const deletePromotionalBannerDetails = async (req, res) => {
  try {
    const bannerId = req.params.bannerId;

    const deletedBanner = await PromotionalBanner.findByIdAndDelete(bannerId);

    if (deletedBanner) {
      res.status(200).json({
        success: true,
        data: deletedBanner,
        message: "Promotional banner deleted successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Promotional banner not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
};

module.exports = {
  getActivePromotionalBannerDetails,
  addPromotionalBannerDetails,
  updatePromotionalBannerDetails,
  deletePromotionalBannerDetails,
};
