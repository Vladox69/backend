const express = require("express");
const { check } = require("express-validator");
const { jwtValidator } = require("../middlewares/jwt-validator");
const { fieldValidator } = require("../middlewares/field-validator");
const router = express.Router();

const {
  getEnvironmentType,
  createEnvironmentType,
  updateEnvironmentType,
  deleteEnvironmentType,
} = require("../controllers/environmentType");

router.use(jwtValidator);

router.get("/", getEnvironmentType);
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("code", "Code is required").not().isEmpty(),
    fieldValidator,
  ],
  createEnvironmentType
);
router.put("/:id", updateEnvironmentType);
router.delete("/:id", deleteEnvironmentType);

module.exports = router;
