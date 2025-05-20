const { response } = require("express");
const bcrypt = require("bcryptjs");
const Business = require("../models/Business");

const getBusiness = async (req, res = response) => {
  try {
    const business = await Business.find({});
    res.status(200).json({
      ok: true,
      business,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error fetching business",
    });
  }
};

const createBusiness = async (req, res = response) => {
  const { taxId } = req.body;
  try {
    let business = await Business.findOne({ taxId });
    if (business) {
      return res.status(400).json({
        ok: false,
        message: "Business already exists",
      });
    }
    business = new Business(req.body);
    business.user = req.uid;
    const salt = bcrypt.genSaltSync();
    business.password = bcrypt.hashSync(business.password, salt);
    await business.save();
    res.status(201).json({
      ok: true,
      business,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      message: "Error creating business",
    });
  }
};

const updateBusiness = async (req, res = response) => {
  const { id } = req.params;
  try {
    const business = await Business.findById(id);
    if (!business) {
      return res.status(404).json({
        ok: false,
        message: "Business not found",
      });
    }
    const updatedBusiness = await Business.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      ok: true,
      business: updatedBusiness,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error updating business",
    });
  }
};

const deleteBusiness = async (req, res = response) => {
  const { id } = req.params;
  try {
    const business = await Business.findByIdAndDelete(id);
    if (!business) {
      return res.status(404).json({
        ok: false,
        message: "Business not found",
      });
    }
    res.status(200).json({
      ok: true,
      message: "Business deleted",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error deleting business",
    });
  }
};

module.exports = {
  getBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
};
