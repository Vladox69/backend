const { response } = require("express");
const Product = require("../models/Product");

const getProducts = async (req, res = response) => {
  try {
    const products = await Product.find()
      .populate("iva", "description")
      .populate("ice", "description")
      .populate("business", "name");
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

const getProductsByBusinessId = async (req, res = response) => {
  const { id } = req.params;
  try {
    const products = await Product.find({business:id})
      .populate("iva", "description")
      .populate("ice", "description")
      .populate("business", "name");
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
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    await updatedProduct.save();
    res.status(200).json({
      ok: true,
      product: updatedProduct,
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
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "Product not found",
      });
    }
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
  getProductsByBusinessId,
  createProduct,
  updateProduct,
  deleteProduct,
};
