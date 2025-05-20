const { Schema, model } = require("mongoose");

const LocationSchema = new Schema(
  {
    business: { type: Schema.Types.ObjectId, ref: "Business", required: true }, // Relación con la empresa
    name: { type: String, required: true }, // nombre de la localidad
    phone: { type: String, required: true },
    code: { type: String, required: true }, // código de la sucursal (001)
    emissionPoint: { type: String, required: true }, // punto de emisión (002)
    address: { type: String, required: true }, // dirección
  },
  {
    timestamps: true,
  }
);

module.exports = model("Location", LocationSchema);
