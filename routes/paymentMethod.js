const express = require("express");
const { check } = require("express-validator");
const { jwtValidator } = require("../middlewares/jwt-validator");
const { fieldValidator } = require("../middlewares/field-validator");
const router = express.Router();
const {
  getPaymentMethod,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} = require("../controllers/paymentMethod");

router.use(jwtValidator);
router.get("/", getPaymentMethod);
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("code", "Code is required").not().isEmpty(),
    fieldValidator,
  ],
  createPaymentMethod
);
router.put(
  "/:id",
  [
    check("name", "Name is required").not().isEmpty(),
    check("code", "Code is required").not().isEmpty(),
    fieldValidator,
  ],
  updatePaymentMethod
);
router.delete("/:id", deletePaymentMethod);

module.exports = router;
// const express = require("express");