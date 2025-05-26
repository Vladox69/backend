const { response } = require("express");
const TaxRate = require("../models/TaxRate");

const getTaxRate = async (req, res = response) => {
  try {
    const taxRates = await TaxRate.find();
    res.json(taxRates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "Error fetching tax rates" });
  }
};

const createTaxRate = async (req, res = response) => {
  try {
    const newTaxRate = new TaxRate(req.body);
    await newTaxRate.save();
    res.status(201).json({ ok: true, newTaxRate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "Error creating tax rate" });
  }
};

const updateTaxRate = async (req, res = response) => {
  const { id } = req.params;
  try {
    const updatedTaxRate = await TaxRate.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedTaxRate) {
      return res.status(404).json({ message: "Tax rate not found" });
    }
    res.json(updatedTaxRate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating tax rate" });
  }
};

const deleteTaxRate = async (req, res = response) => {
  const { id } = req.params;
  try {
    const taxRate = await TaxRate.findByIdAndDelete(id);
    if (!taxRate) {
      return res.status(404).json({
        ok: false,
        message: "Tax rate not found",
      });
    }
    res.status(200).json({
      ok: true,
      message: "Tax rate deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error deleting tax rate",
    });
  }
};
module.exports = {
  getTaxRate,
  createTaxRate,
  updateTaxRate,
  deleteTaxRate,
};
