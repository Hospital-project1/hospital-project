const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  medicalHistory: [{ type: String }],
  allergies: [{ type: String }],
  prescriptions: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Prescription" },
  ],
  testReports: [{ type: mongoose.Schema.Types.ObjectId, ref: "MedicalReport" }],
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
  billingInfo: { type: mongoose.Schema.Types.ObjectId, ref: "Billing" },
});

module.exports = mongoose.model("Patient", patientSchema);
