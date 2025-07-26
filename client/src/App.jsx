import { useState, useEffect } from "react";
import io from "socket.io-client";
import {nanoid} from 'nanoid';
import "./App.css";

const socket = io("http://localhost:3000");
const userId = nanoid(6); // Generate a unique ID for the user

function App() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;
    socket.emit("chat", { message, userId });
    setMessage("");
  };

  useEffect(() => {
    socket.on("chat", (payload) => {
      setChatHistory((prev) => [...prev, payload]);
    },[chatHistory]);

    // Cleanup function to remove the event listener
    return () => {
      socket.off("chat");
    };
  }, []); // Empty dependency array means this effect runs only once

  return (
    <>
      <div>
        <h1>Chat Application</h1>
        {chatHistory.map((chat, index) => (
          <h2 key={index} className='chat-message'>
            {chat.userId}: {chat.message}
          </h2>
        ))}
        <form onSubmit={sendMessage}>
          <input
            type='text'
            placeholder='Type your message here...'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type='submit'>Send</button>
        </form>
      </div>
    </>
  );
}

export default App;
