import React from "react";

const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.role}`}>
      <div className="message-content">
        <p>{message.content}</p>
        <span className="message-time">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;
