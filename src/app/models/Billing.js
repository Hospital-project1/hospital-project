const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const billingSchema = new Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "paid", "canceled"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "paypal", "cliq"],
    required: true,
  },
  paymentDate: { type: Date },
  paymentDetails: { type: String }, // For detailed payment transaction information
});

module.exports = mongoose.model("Billing", billingSchema);
