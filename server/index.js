import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  }
});

io.on("connection", (socket) => {
    socket.on("chat",(payload) => {
        console.log("Message received:", payload);
        io.emit("chat", payload);
    });
});

httpServer.listen(3000, () => {
  console.log("Server is listening on port 3000");
});