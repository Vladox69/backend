const express = require("express");
const { check } = require("express-validator");
const { jwtValidator } = require("../middlewares/jwt-validator");
const { fieldValidator } = require("../middlewares/field-validator");
const router = express.Router();

const {
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customer");
router.use(jwtValidator);
router.get("/", getCustomer);
router.post(
  "/",
  [
    check("fullName", "Full name is required").not().isEmpty(),
    check("identification", "Identification is required").not().isEmpty(),
    check("identificationType", "Identification type is required")
      .not()
      .isEmpty(),
    fieldValidator,
  ],
  createCustomer
);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

module.exports = router;
