const { Schema, model } = require("mongoose");

const TaxDetailSchema = new Schema(
  {
    tax: { type: Schema.Types.ObjectId, ref: "TaxRate", required: true }, // impuesto id (puede ser IVA, ICE, etc.)
    saleDetail: { type: Schema.Types.ObjectId, ref: "SaleDetail", required: true }, // detalle movimiento id
    unitPriceWithoutTax: { type: Number, required: true },// precio sin impuesto por unidad
    unitPriceWithTax: { type: Number, required: true },// precio con impuesto por unidad
    totalPriceWithoutTax: { type: Number, required: true },// precio sin impuesto total (cantidad * unit sin impuesto)
    totalPriceWithTax: { type: Number, required: true }, // precio con impuesto total (cantidad * unit con impuesto)
  },
  {
    timestamps: true,
  }
);

module.exports = model("TaxDetail", TaxDetailSchema);
