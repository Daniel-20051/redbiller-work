import React, { useState, useEffect } from "react";
import socketService from "../services/socketService";

// Define the shape of a message
interface ChatMessage {
  content: string;
  createdAt: string | number | Date;
  [key: string]: any; // Allow for any additional properties
}

const ChatTest: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [typingInfo, setTypingInfo] = useState<string | null>(null);

  // Replace with actual values from your system
  const userId = "34";
  const chatId = "686e902e776cb0e814940d8b";

  useEffect(() => {
    // Connect to socket on mount
    socketService.connect(userId);

    const socket = socketService["socket"];

    if (socket) {
      // Connection handlers
      socket.on("connect", () => {
        setIsConnected(true);
        socketService.joinChat(chatId);
      });

      socket.on("disconnect", () => {
        setIsConnected(false);
      });
    }

    // Message listeners
    socketService.onNewMessage((message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    socketService.onMessageDelivered((data: any) => {
      console.log("Message was delivered:", data);
    });

    // Typing event listener
    socketService.onTyping((data: any) => {
      setTypingInfo(`${data.user || "Someone"} is typing...`);
      setTimeout(() => setTypingInfo(null), 1500);
    });

    // Cleanup
    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (messageInput.trim() && isConnected) {
      socketService.sendMessage(chatId, messageInput);
      setMessageInput("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    if (isConnected && socketService["socket"]) {
      socketService["socket"].emit("typing_start", { chatId, user: userId });
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Chat Test</h2>

      {/* Connection Status */}
      <div
        style={{
          padding: "10px",
          marginBottom: "20px",
          backgroundColor: isConnected ? "#d4edda" : "#f8d7da",
          color: isConnected ? "#155724" : "#721c24",
          borderRadius: "4px",
        }}
      >
        Status: {isConnected ? "✅ Connected" : "❌ Disconnected"}
      </div>

      {/* Typing Notification */}
      {typingInfo && (
        <div style={{ marginBottom: "10px", color: "#007bff" }}>
          {typingInfo}
        </div>
      )}

      {/* Messages Display */}
      <div
        style={{
          height: "300px",
          overflow: "auto",
          border: "1px solid #ddd",
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        {messages.length === 0 ? (
          <p>No messages yet. Send one to test!</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              style={{
                marginBottom: "10px",
                padding: "8px",
                backgroundColor: "#f8f9fa",
                borderRadius: "4px",
              }}
            >
              <strong>User:</strong> {msg.content}
              <br />
              <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
            </div>
          ))
        )}
      </div>

      {/* Send Message */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={messageInput}
          onChange={handleInputChange}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          disabled={!isConnected || !messageInput.trim()}
          style={{
            padding: "10px 20px",
            backgroundColor: isConnected ? "#007bff" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isConnected ? "pointer" : "not-allowed",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatTest;
