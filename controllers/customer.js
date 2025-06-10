const { response } = require("express");
const Customer = require("../models/Customer");

const getCustomer = async (req, res = response) => {
  try {
    const customer = await Customer.find().populate(
      "identificationType",
      "description"
    );
    res.status(200).json({
      ok: true,
      customer,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error fetching customer",
    });
  }
};
const createCustomer = async (req, res = response) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json({
      ok: true,
      customer,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error creating customer",
    });
  }
};
const updateCustomer = async (req, res = response) => {
  const { id } = req.params;
  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({
        ok: false,
        message: "Customer not found",
      });
    }
    const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      ok: true,
      customer: updatedCustomer,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error updating customer",
    });
  }
};

const deleteCustomer = async (req, res = response) => {
  const { id } = req.params;
  try {
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      return res.status(404).json({
        ok: false,
        message: "Customer not found",
      });
    }
    res.status(200).json({
      ok: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error deleting customer",
    });
  }
};

const searchCustomerByIdentification = async (req, res = response) => {
  const { q = "" } = req.query;
  const searchTerm = q.trim().toLowerCase();

  if (!searchTerm) {
    return res.status(400).json({
      ok: false,
      message: "Search term is required",
    });
  }

  const filters = { identification: { $regex: searchTerm, $options: "i" } };

  try {
    const customer = await Customer.findOne(filters);

    if (!customer) {
      return res.status(200).json({
        ok: true,
        message: "Customer not found",
        customer: null,
      });
    }

    res.status(200).json({
      ok: true,
      customer,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error searching customer",
    });
  }
};

module.exports = {
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomerByIdentification,
};
