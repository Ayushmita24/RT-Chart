import { createServer } from "http";
import { Server } from "socket.io";
import { app } from "./app.js";
import { connectDB } from "../db/inddex.db.js";

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("chat", (payload) => {
    console.log("Message received:", payload);
    io.emit("chat", payload);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    httpServer.listen(3000, "0.0.0.0", () => {
      console.log("Server is running on http://localhost:3000");
      console.log("Socket.IO server is running");
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });
