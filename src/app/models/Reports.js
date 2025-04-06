const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportSchema = new Schema({
  reportType: { type: String, required: true }, // E.g., "weekly", "monthly"
  totalPatients: { type: Number },
  totalRevenue: { type: Number },
  totalAppointments: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", reportSchema);
