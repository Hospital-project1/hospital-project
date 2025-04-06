const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const prescriptionSchema = new Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  medication: [{ name: String, dosage: String, instructions: String }],
  issuedDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Prescription", prescriptionSchema);
