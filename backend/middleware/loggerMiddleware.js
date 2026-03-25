const AuditLog = require("../models/AuditLog");

module.exports = async (req, res, next) => {
  await AuditLog.create({
    action: req.method + " " + req.url,
    userId: req.user?.id || "guest",
  });

  next();
};