const express = require("express");
const { check } = require("express-validator");
const { jwtValidator } = require("../middlewares/jwt-validator");
const { fieldValidator } = require("../middlewares/field-validator");
const router = express.Router();

const {
  getTax,
  createTax,
  updateTax,
  deleteTax,
} = require("../controllers/tax");

router.use(jwtValidator);

router.get("/", getTax);
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("code", "Code is required").not().isEmpty(),
    fieldValidator,
  ],
  createTax
);
router.put(
  "/:id",
  [
    check("name", "Name is required").not().isEmpty(),
    check("code", "Code is required").not().isEmpty(),
    fieldValidator,
  ],
  updateTax
);
router.delete("/:id", deleteTax);

module.exports = router;
