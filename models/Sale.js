const { Schema, model } = require("mongoose");

const SaleSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true }, // cliente id
    location: { type: Schema.Types.ObjectId, ref: "Location", required: true }, // localidad id
    sequential: { type: String, required: true }, // secuencial
    accessKey: { type: String, required: true }, // clave de acceso
    issueDate: { type: Date, required: true }, // fecha de emisión
    fiscalPeriod: { type: String, required: true }, // periodo fiscal (Ej: 05/2025)
    totalWithoutTaxes: { type: Number, required: true }, // total sin impuestos
    totalDiscount: { type: Number, required: true }, // total descuento
    totalAmount: { type: Number, required: true }, // total importe (con impuestos)
    receptionStatus: { type: String, enum: ["RECIBIDA", "RECHAZADA","PENDIENTE"], default: "RECIBIDA" }, // estado recepción
    authorizationStatus: { type: String, enum: ["AUTORIZADA", "NO AUTORIZADA","PENDIENTE"], default: "AUTORIZADA" }, // estado autorización
    errorDescription: { type: String, default: "" }, // descripción de errores
    invoiceUrl: { type: String, default: "" }, // url de factura (PDF/ZIP)
    approvalUrl: { type: String, default: "" }, // url de aprobación (documento autorizado)
    ad1: { type: String, default: "" }, // campo adicional 1
    ad2: { type: String, default: "" }, // campo adicional 2
  },
	  {
    timestamps: true,
  }
);

module.exports = model("Sale", SaleSchema);
