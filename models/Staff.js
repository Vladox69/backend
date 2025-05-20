const { Schema, model } = require("mongoose");

const StaffSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  identification: {
    type: String,
    required: true, // cédula o RUC
    unique: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: "Location",
    required: true, // solo puede emitir desde esta localidad
  },
  role: {
    type: String,
    enum: ["staff", "admin"],
    default: "staff",
  },
  active: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
});

module.exports = model("Staff", StaffSchema);
