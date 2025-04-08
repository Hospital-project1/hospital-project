const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  specialty: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
  availability: [
    {
      day: { type: String },
      timeSlot: { type: String }, // e.g. "9 AM - 12 PM"
    },
  ],
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Patient" }],
  details: { type: String, default:"" },
});

module.exports = mongoose.model("Doctor", doctorSchema);
