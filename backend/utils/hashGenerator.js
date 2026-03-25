const crypto = require("crypto");

exports.generateHash = (data) =>
  crypto.createHash("sha256").update(data).digest("hex");