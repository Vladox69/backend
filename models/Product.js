const { Schema, model } = require("mongoose");

const ProductSchema = new Schema(
  {
    iva: { type: Schema.Types.ObjectId, ref: "TaxRate", required: true },  // relación con IVA
    ice: { type: Schema.Types.ObjectId, ref: "TaxRate", required: true },  // relación con ICE
    name: { type: String, required: true },                            // nombre del producto
    pvp: { type: Number, required: true },                             // precio de venta al público
    business: { type: Schema.Types.ObjectId, ref: "Business", required: true }, // relación con el negocio
  },
  {
    timestamps: true,
  }
);

module.exports = model("Product", ProductSchema);
