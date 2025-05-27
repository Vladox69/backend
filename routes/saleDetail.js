const express = require("express");
const { check } = require("express-validator");
const { jwtValidator } = require("../middlewares/jwt-validator");
const { fieldValidator } = require("../middlewares/field-validator");
const router = express.Router();

const {
  getSaleDetails,
  getSaleDetailById,
  createSaleDetail,
  updateSaleDetail,
  deleteSaleDetail,
} = require("../controllers/saleDetail");
router.use(jwtValidator);

router.get("/", getSaleDetails);
router.get("/:id", getSaleDetailById);
router.post("/", createSaleDetail);
router.put("/:id", updateSaleDetail);
router.delete("/:id", deleteSaleDetail);

module.exports = router;
