const { response } = require("express");
const CustomerType = require("../models/CustomerType");
const getCustomerType = async (req, res = response) => {
  try {
    const customerType = await CustomerType.find();
    res.status(200).json({
      ok: true,
      customerType,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error fetching customer type",
    });
  }
};
const createCustomerType = async (req, res = response) => {
  try {
    const customerType = new CustomerType(req.body);
    await customerType.save();
    res.status(201).json({
      ok: true,
      customerType,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error creating customer type",
    });
  }
};
const updateCustomerType = async (req, res = response) => {
  const { id } = req.params;
  try {
    const customerType = await CustomerType.findById(id);
    if (!customerType) {
      return res.status(404).json({
        ok: false,
        message: "Customer type not found",
      });
    }
    const updatedCustomerType = await CustomerType.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      ok: true,
      customerType: updatedCustomerType,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error updating customer type",
    });
  }
};

const deleteCustomerType = async (req, res = response) => {
  const { id } = req.params;
  try {
    const customerType = await CustomerType.findByIdAndDelete(id);
    if (!customerType) {
      return res.status(404).json({
        ok: false,
        message: "Customer type not found",
      });
    }
    res.status(200).json({
      ok: true,
      message: "Customer type deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error deleting customer type",
    });
  }
};

module.exports = {
  getCustomerType,
  createCustomerType,
  updateCustomerType,
  deleteCustomerType,
};
