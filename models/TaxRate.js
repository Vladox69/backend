const { Schema, model } = require("mongoose");

const TaxRateSchema = new Schema(
  {
    tax: {type: Schema.Types.ObjectId,ref: "Tax",required: true,}, // Referencia al impuesto (por ejemplo, IVA)
    code: {type: String,required: true,}, // Código de la tarifa, como "4"
    percentage: {type: Number,required: true,}, // Porcentaje decimal, como 0.15 (equivale al 15%)
    description: {type: String,required: true,}, // Descripción amigable, como "15%"
  },
  {
    timestamps: true,
  }
);

module.exports = model("TaxRate", TaxRateSchema);
