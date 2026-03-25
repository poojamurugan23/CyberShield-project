const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "user" },
  otp: String,
  otpExpires: Date,
});

module.exports = mongoose.model("User", schema);