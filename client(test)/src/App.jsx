import { useState, useEffect } from "react";
import io from "socket.io-client";
import { nanoid } from "nanoid";
import "./App.css"; // Assuming App.css is in src/

const socket = io("http://localhost:3000");
const userId = nanoid(6); // Generate a unique ID for the user

function Home() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [username, setUsername] = useState("");
  const [to, setTo] = useState("");

  const registerUser = () => {
    if (username.trim() === "") return;
    socket.emit("register", { username });
  };
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;
    if (to.trim() === "") return;
    socket.emit("private", { message, to, from: username });
    setMessage("");
  };

  useEffect(() => {
    socket.on("private", (payload) => {
      setChatHistory((prev) => [...prev, payload]);
      console.log("Message received:", payload);
    });

    return () => {
      socket.off("private");
      console.log("Socket disconnected");
    };
  }, []);

  return (
    <div>
      <h1>Register</h1>
      <input
        type='text'
        placeholder='enter your username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={registerUser}>enter</button>
      <div className='chat-container'>
        <h1>Chat App</h1>
        {chatHistory.map((chat, index) => (
          <h2 key={index} className='chat-message'>
            {chat}
          </h2>
        ))}
        <form onSubmit={sendMessage}>
          <span>userId:</span>
          <span>
            <input
              type='text'
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </span>
          <span>message:</span>
          <input
            type='text'
            placeholder='Type your message here...'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type='submit'>Send</button>
        </form>
      </div>
    </div>
  );
}

export default Home;
