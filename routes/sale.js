const express = require("express");
const { check } = require("express-validator");
const { jwtValidator } = require("../middlewares/jwt-validator");
const { fieldValidator } = require("../middlewares/field-validator");
const router = express.Router();

const {
  createSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale,
  generateInvoice
} = require("../controllers/sale");

router.use(jwtValidator);
router.get("/", getSales);
router.get("/:id", getSaleById);
router.post("/", createSale);
router.put("/:id", updateSale);
router.delete("/:id", deleteSale);
router.post("/generate-invoice", generateInvoice);

module.exports = router;