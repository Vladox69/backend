const { Schema, model } = require("mongoose");

const BusinessSchema = Schema(
  {
    environmentType: {type: Schema.Types.ObjectId, ref: "EnvironmentType", required: true }, // tipo de ambiente (1 = prueba, 2 = producción)
    businessName: { type: String, required: true }, // razon social
    tradeName: { type: String, required: true }, // nombre comercial
    taxId: { type: String, required: true , unique: true }, // identificacion (RUC)
    email: { type: String, required: true , unique: true }, // email
    password: { type: String, required: true }, // contraseña
    issuesRetention: { type: Boolean, default: false }, // emite retención (1 = true)
    accountingRequired: { type: Boolean, default: false }, // obligado a llevar contabilidad (1 = true)
    certificateUrl: { type: String, required: true }, // url certificado
    certificateKey: { type: String, required: true }, // clave certificado
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Relación con el usuario
  },
  {
    timestamps: true,
  }
);

module.exports = model("Business", BusinessSchema);
