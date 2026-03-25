const Notification = require("../models/Notification");

exports.createNotification = async (msg, userId) => {
  return await Notification.create({ message: msg, userId });
};

exports.getNotifications = async (req, res) => {
  res.json(await Notification.find());
};