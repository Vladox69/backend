const { response } = require("express");
const Product = require("../models/Product");

const getProducts = async (req, res = response) => {
  try {
    const products = await Product.find({})
      .populate("iva", "name")
      .populate("ice", "name");
    res.status(200).json({
      ok: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error fetching products",
    });
  }
};
const createProduct = async (req, res = response) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({
      ok: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error creating product",
    });
  }
};
const updateProduct = async (req, res = response) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "Product not found",
      });
    }
    // Update product fields
    product.set(req.body);
    await product.save();
    res.status(200).json({
      ok: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error updating product",
    });
  }
};
const deleteProduct = async (req, res = response) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "Product not found",
      });
    }
    await product.remove();
    res.status(200).json({
      ok: true,
      message: "Product deleted",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error deleting product",
    });
  }
};
module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
