const express = require("express");
const { check } = require("express-validator");
const { jwtValidator } = require("../middlewares/jwt-validator");
const { fieldValidator } = require("../middlewares/field-validator");
const router = express.Router();

const {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} = require("../controllers/staff");

router.use(jwtValidator);
router.get("/", getStaff);
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("identification", "Identification is required").not().isEmpty(),
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").not().isEmpty(),
    check("location", "Location is required").not().isEmpty(),
    check("role", "Role is required").not().isEmpty(),
    fieldValidator,
  ],
  createStaff
);
router.put("/:id", updateStaff);
router.delete("/:id", deleteStaff);

module.exports = router;