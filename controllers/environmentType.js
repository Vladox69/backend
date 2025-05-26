const { response } = require("express");
const EnvironmentType = require("../models/EnvironmentType");

const getEnvironmentType = async (req, res = response) => {
  try {
    const environmentTypes = await EnvironmentType.find();
    res.status(200).json({
      ok: true,
      environmentTypes,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error fetching environment types",
    });
  }
};

const createEnvironmentType = async (req, res = response) => {
  try {
    const environmentType = new EnvironmentType(req.body);
    await environmentType.save();
    res.status(201).json({
      ok: true,
      environmentType,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error creating environment type",
    });
  }
};
const updateEnvironmentType = async (req, res = response) => {
  const { id } = req.params;
  try {
    const environmentType = await EnvironmentType.findById(id);
    if (!environmentType) {
      return res.status(404).json({
        ok: false,
        message: "Environment type not found",
      });
    }
    const updatedEnvironmentType = await EnvironmentType.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      ok: true,
      environmentType: updatedEnvironmentType,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error updating environment type",
    });
  }
};
const deleteEnvironmentType = async (req, res = response) => {
  const { id } = req.params;
  try {
    const environmentType = await EnvironmentType.findByIdAndDelete(id);
    if (!environmentType) {
      return res.status(404).json({
        ok: false,
        message: "Environment type not found",
      });
    }
    res.status(200).json({
      ok: true,
      message: "Environment type deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error deleting environment type",
    });
  }
};

module.exports = {
  getEnvironmentType,
  createEnvironmentType,
  updateEnvironmentType,
  deleteEnvironmentType,
};
