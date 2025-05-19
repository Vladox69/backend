const { response } = require("express");
const { generateJWT } = require("../helpers/jwt");
const getBusiness = async (req, res = response) => {
  res.status(200).json({
    ok: true,
    message: "getBusiness",
  });
};

const createBusiness = async (req, res = response) => {
  console.log(req.body);
  
  res.status(201).json({
    ok: true,
    message: "createBusiness",
  });
};

const updateBusiness = async (req, res = response) => {
  res.status(200).json({
    ok: true,
    message: "updateBusiness",
  });
};

const deleteBusiness = async (req, res = response) => {
  res.status(200).json({
    ok: true,
    message: "deleteBusiness",
  });
};

module.exports = {
  getBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
};
