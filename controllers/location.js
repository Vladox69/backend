const Location = require("../models/Location");
const { response } = require("express");
const getLocations = async (req, res = response) => {
  try {
    const locations = await Location.find({});
    res.status(200).json({
      ok: true,
      locations,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error fetching locations",
    });
  }
};

const getLocationById = async (req, res = response) => {
  const { id } = req.params;
  try {
    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({
        ok: false,
        message: "Location not found",
      });
    }
    res.status(200).json({
      ok: true,
      location,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error fetching location",
    });
  }
};

const getLocationsByBusiness = async (req, res = response) => {
  const { businessId } = req.params;
  try {
    const locations = await Location.find({ business: businessId });
    res.status(200).json({
      ok: true,
      locations,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error fetching locations",
    });
  }
};

const createLocation = async (req, res = response) => {
  try {
    const location = new Location(req.body);
    await location.save();
    res.status(201).json({
      ok: true,
      location,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error creating location",
    });
  }
};

const updateLocation = async (req, res = response) => {
  const { id } = req.params;
  try {
    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({
        ok: false,
        message: "Location not found",
      });
    }
    const updatedLocation = await Location.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      ok: true,
      location: updatedLocation,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error updating location",
    });
  }
};

const deleteLocation = async (req, res = response) => {
  const { id } = req.params;
  try {
    const location = await Location.findByIdAndDelete(id);
    if (!location) {
      return res.status(404).json({
        ok: false,
        message: "Location not found",
      });
    }
    res.status(200).json({
      ok: true,
      message: "Location deleted",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error deleting location",
    });
  }
};

module.exports = {
  getLocations,
  getLocationById,
  getLocationsByBusiness,
  createLocation,
  updateLocation,
  deleteLocation,
};
