const { Schema, model } = require("mongoose");

const EnvironmentTypeSchema = new Schema(
  {
    name: { type: String, required: true }, // Ejemplo: "Pruebas" o "Producción"
    code: { type: String, required: true }, // Ejemplo: "1" para pruebas, "2" para producción
  },
  {
    timestamps: true,
  }
);

module.exports = model("EnvironmentType", EnvironmentTypeSchema);
