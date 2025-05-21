const express = require("express");
const { check } = require("express-validator");
const { jwtValidator } = require("../middlewares/jwt-validator");
const { fieldValidator } = require("../middlewares/field-validator");
const router = express.Router();

const {
  getTaxRate,
  createTaxRate,
  updateTaxRate,
  deleteTaxRate,
} = require("../controllers/taxRate");

router.use(jwtValidator);
router.get("/", getTaxRate);
router.post(
  "/",
  [
    check("tax", "Tax is required").not().isEmpty(),
    check("code", "Code is required").not().isEmpty(),
    check("percentage", "Percentage is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
    fieldValidator,
  ],
  createTaxRate
);
router.put("/:id", updateTaxRate);
router.delete("/:id", deleteTaxRate);

module.exports = router;