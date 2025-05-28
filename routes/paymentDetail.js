const express = require("express");
const { check } = require("express-validator");
const { jwtValidator } = require("../middlewares/jwt-validator");
const { fieldValidator } = require("../middlewares/field-validator");
const router = express.Router();

const {
  getPaymentDetails,
  createPaymentDetail,
  updatePaymentDetail,
  deletePaymentDetail,
} = require("../controllers/paymentDetail");

router.use(jwtValidator);
router.get("/", getPaymentDetails);
router.post(
  "/",
  [
    check("sale", "Sale ID is required").not().isEmpty(),
    check("paymentMethod", "Payment method ID is required").not().isEmpty(),
    check("amount", "Amount is required").isNumeric(),
    fieldValidator,
  ],
  createPaymentDetail
);
router.put(
  "/:id",
  [
    check("sale", "Sale ID is required").not().isEmpty(),
    check("paymentMethod", "Payment method ID is required").not().isEmpty(),
    check("amount", "Amount is required").isNumeric(),
    fieldValidator,
  ],
  updatePaymentDetail
);
router.delete("/:id", deletePaymentDetail);

module.exports = router;