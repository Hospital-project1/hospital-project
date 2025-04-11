const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "doctor", "patient"],
    required: true,
    default: "patient",
  },
  phone: { type: String, default:"" },
  address: { type: String, default:"" },
  profilePicture: { type: String, default:"" },
  socialLogin: {
    google: String,
  },
  isDeleted: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add a pre-save middleware to update the updatedAt field automatically
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("User", userSchema);