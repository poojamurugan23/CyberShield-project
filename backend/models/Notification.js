const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  message: String,
  userId: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", schema);