const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  action: String,
  userId: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AuditLog", schema);