const express = require("express");
const { check } = require("express-validator");
const { jwtValidator } = require("../middlewares/jwt-validator");
const { fieldValidator } = require("../middlewares/field-validator");
const router = express.Router();

const { receptionXML,authorizeXML } = require("../controllers/sri");
router.use(jwtValidator);
router.post(
  "/reception/:id",
  [check("id", "Invalid sale ID").isMongoId(), fieldValidator],
  receptionXML
);

router.post(
  "/authorize/:id",
  [check("id", "Invalid sale ID").isMongoId(), fieldValidator],
  authorizeXML
);

module.exports = router;