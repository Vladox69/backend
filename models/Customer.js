const { Schema, model } = require("mongoose");

const CustomerSchema = new Schema(
  {
    fullName: { type: String, required: true }, // Nombre completo del cliente
    identification: { type: String, required: true }, // Cédula, RUC, etc.
    identificationType: { type: Schema.Types.ObjectId, ref: "CustomerType", required: true }, // Relación con tipo de identificación (CustomerType)
    email: { type: String, required: false }, // Puede ser opcional
    phone: { type: String, required: false }, // También puede ser opcional
  },
  {
    timestamps: true,
  }
);

module.exports = model("Customer", CustomerSchema);
