const { Schema, model } = require("mongoose");

const PaymentMethodSchema = new Schema({
  name: { type: String, required: true }, // e.g., "EFECTIVO", "TRANSFERENCIA"
  code: { type: String, required: true }, // e.g., "01", "02"
}, {
  timestamps: true
});

module.exports = model("PaymentMethod", PaymentMethodSchema);
