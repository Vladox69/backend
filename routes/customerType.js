const express = require("express");
const { check } = require("express-validator");
const { jwtValidator } = require("../middlewares/jwt-validator");
const { fieldValidator } = require("../middlewares/field-validator");
const router = express.Router();

const {
  getCustomerType,
  createCustomerType,
  updateCustomerType,
  deleteCustomerType,
} = require("../controllers/customerType");
router.use(jwtValidator);

router.get("/", getCustomerType);
router.post(
  "/",
  [
    check("description", "Description is required").not().isEmpty(),
    check("code", "Code is required").not().isEmpty(),
    fieldValidator,
  ],
  createCustomerType
);
router.put("/:id", updateCustomerType);
router.delete("/:id", deleteCustomerType);

module.exports = router;
