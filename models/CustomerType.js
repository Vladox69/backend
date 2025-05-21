const { Schema, model } = require("mongoose");

const CustomerTypeSchema = new Schema(
  {
    description: { type: String, required: true }, // Ejemplo: "CÉDULA", "RUC", "PASAPORTE"
    code: { type: String, required: true }, // Ejemplo: "04" para cédula, "05" para RUC
  },
  {
    timestamps: true,
  }
);

module.exports = model("CustomerType", CustomerTypeSchema);
