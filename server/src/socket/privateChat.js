import { Message } from "../models/message.models.js";
import {User} from "../models/user.models.js"; // Assuming you have a User model
const userSocketMap = new Map();

const privateChatSetup = (io) => {
  io.on("connection", (socket) => {

    // User registration
    socket.on("register", ({ userid }) => {
      userSocketMap.set(userid, socket.id);
      console.log("User registered:", userid, "--", userSocketMap.get(userid));
      socket.data.userid = userid; // Store the userid in the socket object
      console.log("current userSocketMap:", userSocketMap);
    });

    // Private message handling
    socket.on("private", async ({ message, to, from }) => {
      try {
        const recipientSocketId = userSocketMap.get(to);
        const senderSocketId = userSocketMap.get(from);

        // const sender = await User.findOne({ userid: from }).select("-password"); // Fetch sender details without password
        // console.log("Sender details:", sender);
        // const receiver = await User.findOne({ userid: to }).select("-password"); // Fetch receiver details without password
        const sender = from; // Assuming 'from' is the sender's userid
        const receiver = to; // Assuming 'to' is the receiver's userid
        console.log("Receiver details:", receiver);

        const payload = await Message.create({
          sender,
          receiver,
          content: message,
        });

        // Send to recipient if online
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("private", payload);
          console.log(`Message sent to ${to}:`, message);
        }

        // Send to sender (for confirmation)
        if (senderSocketId) {
          io.to(senderSocketId).emit("private", payload);
          console.log(`Message confirmed to ${from}:`, message);
        }
      } catch (error) {
        console.error("Error handling private message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      if (socket.data.userid) {
        userSocketMap.delete(socket.data.userid);
        console.log("User removed from map:", socket.data.userid);
      }
    });
  });
};

export { privateChatSetup };
