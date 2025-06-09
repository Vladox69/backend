const express = require("express");
const { check } = require("express-validator");
const { jwtValidator } = require("../middlewares/jwt-validator");
const { fieldValidator } = require("../middlewares/field-validator");
const router = express.Router();

const {
  getProducts,
  getProductsByBusinessId,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} = require("../controllers/products");

router.use(jwtValidator);
router.get("/", getProducts);
router.get("/business/:id", getProductsByBusinessId);
router.post("/", [
  check("name", "Name is required").not().isEmpty(),
  check("pvp", "PVP is required").isNumeric(),
  fieldValidator,
], createProduct);
router.put("/:id", [
  check("name", "Name is required").not().isEmpty(),
  check("pvp", "PVP is required").isNumeric(),
  fieldValidator,
], updateProduct);
router.delete("/:id", deleteProduct);
router.get("/search",searchProducts)
module.exports = router;