const { response } = require("express");
const SaleDetail = require("../models/SaleDetail");

const createSaleDetail = async (req, res = response) => {
  try {
    const saleDetail = new SaleDetail(req.body);
    await saleDetail.save();
    res.status(201).json({
      ok: true,
      saleDetail,
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error creating sale detail" });
  }
};

const getSaleDetails = async (req, res = response) => {
  try {
    const saleDetails = await SaleDetail.find()
      .populate("product", "name")
      .populate("sale", "invoiceNumber");
    res.status(200).json({
      ok: true,
      saleDetails,
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error fetching sale details" });
  }
};

const getSaleDetailById = async (req, res = response) => {
  const { id } = req.params;
  try {
    const saleDetail = await SaleDetail.findById(id)
      .populate("product", "name")
      .populate("sale", "invoiceNumber");
    if (!saleDetail) {
      return res.status(404).json({ ok: false, message: "Sale detail not found" });
    }
    res.status(200).json({ ok: true, saleDetail });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error fetching sale detail" });
  }
};

const updateSaleDetail = async (req, res = response) => {
  const { id } = req.params;
  try {
    const saleDetail = await SaleDetail.findById(id);
    if (!saleDetail) {
      return res.status(404).json({ ok: false, message: "Sale detail not found" });
    }
    const updatedSaleDetail = await SaleDetail.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedSaleDetail) {
      return res.status(400).json({ ok: false, message: "Error updating sale detail" });
    }
    res.status(200).json({ ok: true, saleDetail: updatedSaleDetail });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error updating sale detail" });
  }
};

const deleteSaleDetail = async (req, res = response) => {
  const { id } = req.params;
  try {
    const saleDetail = await SaleDetail.findByIdAndDelete(id);
    if (!saleDetail) {
      return res.status(404).json({ ok: false, message: "Sale detail not found" });
    }
    res.status(200).json({ ok: true, message: "Sale detail deleted successfully" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error deleting sale detail" });
  }
};


module.exports = {
  createSaleDetail,
  getSaleDetails,
  getSaleDetailById,
  updateSaleDetail,
  deleteSaleDetail,
};
