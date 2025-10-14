import React from "react";

const ChatInput = ({
  value,
  onChange,
  onSend,
  onKeyPress,
  disabled,
  inputRef,
}) => {
  return (
    <div className="chat-input-container">
      <textarea
        ref={inputRef}
        className="chat-input"
        placeholder="Ask me anything about building habits..."
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        rows="1"
        disabled={disabled}
      />
      <button
        className="chat-send-btn"
        onClick={onSend}
        disabled={!value.trim() || disabled}
        aria-label="Send message"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </div>
  );
};

export default ChatInput;
