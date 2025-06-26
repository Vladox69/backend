const express = require("express");
const { check } = require("express-validator");
const { jwtValidator } = require("../middlewares/jwt-validator");
const { fieldValidator } = require("../middlewares/field-validator");
const router = express.Router();

const { sendMail, downloadFile } = require("../controllers/mail");

router.use(jwtValidator);
router.post("/send-mail/:id",sendMail);
router.post("/download-file",downloadFile);
module.exports = router;