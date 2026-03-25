const crypto = require("crypto");

module.exports.generateHash = (data) =>
  crypto.createHash("sha256").update(data).digest("hex");