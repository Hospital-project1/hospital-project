const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "doctor", "patient"], required: true },
  phone: { type: String },
  address: { type: String },
  profilePicture: { type: String }, // URL to profile picture
  socialLogin: { google: String }, // Optional for social login
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
