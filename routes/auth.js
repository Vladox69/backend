const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { createUser, loginUser, renewUser} = require("../controllers/auth");
const { fieldValidator } = require("../middlewares/field-validator");
const { jwtValidator } = require("../middlewares/jwt-validator");

router.post(
  "/new",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe tener al menos 6 caracteres").isLength({
      min: 6,
    }),
    check("password", "El password es obligatorio").not().isEmpty(),
    fieldValidator,
  ],
  createUser
);

router.post(
  "/",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
    fieldValidator,
  ],
  loginUser
);

router.get("/renew", jwtValidator, renewUser);

module.exports = router;
