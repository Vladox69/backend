const { response } = require("express");
const bcrypt = require("bcryptjs");
const Staff = require("../models/Staff");

const getStaff = async (req, res = response) => {
  try {
    const staff = await Staff.find({}).populate("location", "name");
    res.status(200).json({
      ok: true,
      staff,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error fetching staff",
    });
  }
};

const createStaff = async (req, res = response) => {
  try {
    const staff = new Staff(req.body);
    const salt = bcrypt.genSaltSync();
    staff.password = bcrypt.hashSync(staff.password, salt);
    await staff.save();
    res.status(201).json({
      ok: true,
      staff,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error creating staff",
    });
  }
};

const updateStaff = async (req, res = response) => {
  const { id } = req.params;
  try {
    const staff = await Staff.findById(id);
    if (!staff) {
      return res.status(404).json({
        ok: false,
        message: "Staff not found",
      });
    }
    const updatedStaff = await Staff.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      ok: true,
      staff: updatedStaff,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error updating staff",
    });
  }
};

const deleteStaff = async (req, res = response) => {
  const { id } = req.params;
  try {
    const staff = await Staff.findByIdAndDelete(id);
    if (!staff) {
      return res.status(404).json({
        ok: false,
        message: "Staff not found",
      });
    }
    res.status(200).json({
      ok: true,
      message: "Staff deleted",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error deleting staff",
    });
  }
};

module.exports = {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
};
