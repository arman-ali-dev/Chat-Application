const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const exp = require("constants");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const onlineUsers = {};

const getSocketID = (id) => onlineUsers[id];

io.on("connection", (socket) => {
  const userID = socket.handshake.query.userID;

  if (userID) {
    onlineUsers[userID] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(onlineUsers));

  socket.on("disconnect", () => {
    if (userID) {
      delete onlineUsers[userID];
    }
    io.emit("getOnlineUsers", Object.keys(onlineUsers));
  });

  socket.on("typing-feedback", (data) => {
    io.to(getSocketID(data.receiverID)).emit("typing-feedback", data);
  });
});

module.exports = { io, app, server, getSocketID };
