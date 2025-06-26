const express = require("express");
const { check } = require("express-validator");
const { jwtValidator } = require("../middlewares/jwt-validator");
const { fieldValidator } = require("../middlewares/field-validator");
const router = express.Router();

const { generatePDF } = require("../controllers/pdf");


router.use(jwtValidator);
router.post("/generate-pdf/:id", generatePDF);
module.exports = router;