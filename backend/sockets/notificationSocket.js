const { Server } = require("socket.io");

let io;

exports.initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected");
  });
};

exports.sendNotification = (msg) => {
  if (io) io.emit("notification", msg);
};

exports.emitMessage = (data) => {
  if (io) io.emit("new_message", data);
};