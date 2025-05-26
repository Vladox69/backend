const { response } = require("express");
const Sale = require("../models/Sale");

const createSale = async (req, res = response) => {
  try {
    const sale = new Sale(req.body);
    await sale.save();
    res.status(201).json({
      ok: true,
      sale,
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error creating sale" });
  }
};

const getSales = async (req, res = response) => {
  try {
    const sales = await Sale.find()
    .populate("location", "name")
    .populate("customer", "fullName");
    
    res.status(200).json({
      ok: true,
      sales,
    });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ ok: false, message: "Error fetching sales" });
  }
};

const getSaleById = async (req, res = response) => {
  const { id } = req.params;
  try {
    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({ ok: false, message: "Sale not found" });
    }
    res.status(200).json({ ok: true, sale });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error fetching sale" });
  }
};

const updateSale = async (req, res = response) => {
  const { id } = req.params;
  try {
    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({ ok: false, message: "Sale not found" });
    }
    const updatedSale = await Sale.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedSale) {
      return res
        .status(400)
        .json({ ok: false, message: "Error updating sale" });
    }
    res.status(200).json({ ok: true, sale: updatedSale });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error updating sale" });
  }
};

const deleteSale = async (req, res = response) => {
  const { id } = req.params;
  try {
    const sale = await Sale.findById(id);
    if (!sale) {
      return res.status(404).json({ ok: false, message: "Sale not found" });
    }
    await Sale.findByIdAndDelete(id);
    res.status(200).json({ ok: true, message: "Sale deleted successfully" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error deleting sale" });
  }
};


module.exports = {
  createSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale,
};
