const express = require("express");
const { check } = require("express-validator");
const { jwtValidator } = require("../middlewares/jwt-validator");
const { fieldValidator } = require("../middlewares/field-validator");
const router = express.Router();
const {
  getLocations,
  getLocationById,
  getLocationsByBusiness,
  createLocation,
  updateLocation,
  deleteLocation,
} = require("../controllers/location");

router.use(jwtValidator);

router.get("/", getLocations);
router.get("/:id", getLocationById);
router.get("/business/:businessId", getLocationsByBusiness);
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("business", "Business ID is required").not().isEmpty(),
    check("phone", "Phone is required").not().isEmpty(),
    check("code", "Code is required").not().isEmpty(),
    check("emissionPoint", "Emission point is required").not().isEmpty(),
    check("address", "Address is required").not().isEmpty(),
    fieldValidator,
  ],
  createLocation
);
router.put("/:id", updateLocation);
router.delete("/:id", deleteLocation);

module.exports = router;
