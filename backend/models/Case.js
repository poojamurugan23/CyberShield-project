const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: String,
  userEmail: String,
  description: String,
  whatHappenedNext: String,
  domain: String,
  hash: String,
  evidenceFile: String, 
  severity: { type: String, default: "Low" },
  keystrokePriority: { type: String, default: "Normal" },
  similarityScore: { type: Number, default: 0 },
  brief: String,
  suggestedActions: [String],
  status: { type: String, default: "New" },
  investigatorId: String,
  investigatorName: String,
  investigatorEmail: String,
  messages: [{
    senderRole: String,
    senderName: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Case", schema);