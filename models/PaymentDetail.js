const { Schema, model } = require("mongoose");

const PaymentDetailSchema = new Schema(
  {
    sale: {  type: Schema.Types.ObjectId,  ref: "Sale",  required: true,}, // venta id
    paymentMethod: {  type: Schema.Types.ObjectId,  ref: "PaymentMethod",  required: true,}, // método de pago id
    value: {  type: Number,  required: true,}, // valor abonado
  },
  {
    timestamps: true,
  }
);

module.exports = model("PaymentDetail", PaymentDetailSchema);
