const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  specialty: {
    type: String,
    enum: ["Orthopedist", "	Internist", "Dermatologist" ,"ENT Doctor" ,"doctor"],
    required: false,
    default: "doctor",
  },
  
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
