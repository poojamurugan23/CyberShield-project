require("dotenv").config();
const express = require("express");
const app = require("./app");
const connectDB = require("./config/db");
const http = require("http");
const { initSocket } = require("./sockets/notificationSocket");
const path = require("path");

connectDB();

const server = http.createServer(app);

// SOCKET INIT
initSocket(server);

// SERVE UPLOADS STATICALLY
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/cases", require("./routes/caseRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/blockchain", require("./routes/blockchainRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});