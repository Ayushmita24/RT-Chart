import { createServer } from "http";
import { Server } from "socket.io";
import { app } from "./app.js";
import { connectDB } from "./db/inddex.db.js";

const userSocketMap = {};
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  socket.on("register", ({username}) => {
    userSocketMap[username] = socket.id;
    console.log("User registered:", username,"--", userSocketMap[username]);
    socket.username = username; // Store the username in the socket object
    console.log(userSocketMap);
  });
  // socket.on("chat", (payload) => {
  //   console.log("Message received:", payload);
  //   io.emit("chat", payload);
  // });
  socket.on("private",({message,to,from})=>{
    const recipientSocketId = userSocketMap[to];
    const senderSocketId = userSocketMap[from];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("private", message);
      io.to(senderSocketId).emit("private", message);
      console.log(`Message sent to ${to}:`, message);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    if (socket.username) {
      delete userSocketMap[socket.username]; // Remove the user from the map on disconnect
      console.log("User removed from map:", socket.username);
    }
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
