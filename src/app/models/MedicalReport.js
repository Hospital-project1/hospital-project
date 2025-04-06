const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const medicalReportSchema = new Schema({
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
  reportType: { type: String }, // For example, "X-Ray", "Blood Test", etc.
  reportDetails: { type: String },
  reportDate: { type: Date, default: Date.now },
  file: { type: String }, // URL or path to the uploaded report file
});

module.exports = mongoose.model("MedicalReport", medicalReportSchema);
