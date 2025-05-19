const express = require("express");
const { check } = require("express-validator");
const { jwtValidator } = require("../middlewares/jwt-validator");
const router = express.Router();
const {
  getBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
} = require("../controllers/business");

// Validation middleware
router.use(jwtValidator);

// Routes
router.get("/", getBusiness);
router.post("/", createBusiness);
router.put("/:id", updateBusiness);
router.delete("/:id", deleteBusiness);

module.exports = router;
