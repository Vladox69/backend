const { Schema, model } = require("mongoose");

const SaleDetailSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true }, // producto id
    sale: { type: Schema.Types.ObjectId, ref: "Sale", required: true }, // venta id
    quantity: { type: Number, required: true },
    totalValue: { type: Number, required: true }, // valor total de la línea
    unitValue: { type: Number, required: true }, // valor unitario del producto
    valueWithoutTaxes: { type: Number, required: true }, // valor sin impuestos
    totalTaxes: { type: Number, required: true }, // total de impuestos (iva + ice + ibmr)
    ad1: { type: String, default: "" }, // campo adicional 1
    ad2: { type: String, default: "" }, // campo adicional 2
    ad3: { type: String, default: "" }, // campo adicional 3
  },
  {
    timestamps: true,
  }
);

module.exports = model("SaleDetail", SaleDetailSchema);
