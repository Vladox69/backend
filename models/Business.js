const { Schema, model } = require("mongoose");

const BusinessSchema = Schema({
  businessName: { type: String, required: true }, // razon social
  tradeName: { type: String, required: true }, // nombre comercial
  taxId: { type: String, required: true }, // identificacion (RUC)
  password: { type: String, required: true }, // contraseña
  email: { type: String, required: true }, // email
  phone: { type: String, required: true }, // telefono
  address: { type: String, required: true }, // direccion
  issuesRetention: { type: Boolean, default: false }, // emite retención (1 = true)
  accountingRequired: { type: Boolean, default: false }, // obligado a llevar contabilidad (1 = true)
  certificateUrl: { type: String, required: true }, // url certificado
  certificateKey: { type: String, required: true }, // clave certificado
},{
    timestamps: true,
});

module.exports = model("Business", BusinessSchema);
