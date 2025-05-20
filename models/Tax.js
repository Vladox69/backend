const { Schema, model } = require("mongoose");

const TaxSchema = new Schema({
  name: { type: String, required: true },       // e.g., "IVA"
  code: { type: String, required: true },       // e.g., "02"
}, {
  timestamps: true
});

module.exports = model("Tax", TaxSchema);
