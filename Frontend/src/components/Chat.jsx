import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { useContext } from "react";
import HabitContext from "../context/habitContextBase";
import { API_ENDPOINTS } from "../utils/api";
import "./Chat.css";

const Chat = () => {
  const { user, apiCall } = useAuth();
  const { habits } = useContext(HabitContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello ${
        user?.firstName || "there"
      }! 👋 I'm your personal habit-building coach. I'm here to help you build positive life aspects through consistent habits. How can I assist you today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const buildContextPrompt = () => {
    const userContext = {
      name: `${user?.firstName} ${user?.lastName}`,
      email: user?.email,
      habitsCount: habits?.length || 0,
      activeHabits: habits?.filter((h) => h.status !== "completed") || [],
    };

    const habitsList =
      habits && habits.length > 0
        ? habits
            .map(
              (h, i) =>
                `${i + 1}. ${h.title} - ${
                  h.description || "No description"
                } (Duration: ${h.duration} days, Privacy: ${h.privacy})`
            )
            .join("\n")
        : "No habits created yet.";

    return `
You are a friendly and motivational habit-building coach for StreakForce. Your role is to help users build positive life aspects through consistent habits.

User Context:
- Name: ${userContext.name}
- Current Habits Count: ${userContext.habitsCount}
- Active Habits: ${userContext.activeHabits.length}

Current Habits:
${habitsList}

Guidelines:
1. Be encouraging and supportive
2. Provide actionable advice based on the user's current habits
3. Suggest specific habit-building strategies
4. Help users stay motivated and overcome challenges
5. Keep responses concise but meaningful (2-4 sentences usually)
6. Use emojis sparingly to add warmth
7. If asked to create a habit, guide them on what makes a good habit
8. Reference their existing habits when relevant
9. Focus on building sustainable, life-improving habits

Remember: You're a coach, not just an information provider. Be personal, be supportive, and be practical.
`;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const contextPrompt = buildContextPrompt();
      const conversationHistory = messages
        .slice(-5) // Last 5 messages for context
        .map(
          (msg) =>
            `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
        )
        .join("\n");

      const fullQuery = `${contextPrompt}

Conversation History:
${conversationHistory}

User's Current Question: ${input}

Respond as the habit coach:`;

      const response = await apiCall(`${API_ENDPOINTS.AI}/query`, {
        method: "POST",
        body: JSON.stringify({ query: fullQuery }),
      });

      const assistantMessage = {
        role: "assistant",
        content:
          response.result || "I'm here to help! Could you rephrase that?",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        role: "assistant",
        content:
          "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: `Hello ${
          user?.firstName || "there"
        }! 👋 I'm your personal habit-building coach. I'm here to help you build positive life aspects through consistent habits. How can I assist you today?`,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className={`chat-toggle-btn ${isOpen ? "chat-open" : ""}`}
        onClick={toggleChat}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {/* Chat Window */}
      <div className={`chat-window ${isOpen ? "chat-window-open" : ""}`}>
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-avatar">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
            </div>
            <div className="chat-header-text">
              <h3>Habit Coach</h3>
              <span className="chat-status">
                <span className="status-indicator"></span>
                Online
              </span>
            </div>
          </div>
          <button
            className="chat-clear-btn"
            onClick={clearChat}
            title="Clear chat"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="1 4 1 10 7 10"></polyline>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
            </svg>
          </button>
        </div>

        {/* Chat Messages */}
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.role}`}>
              <div className="message-content">
                <p>{msg.content}</p>
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="chat-message assistant">
              <div className="message-content typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="chat-input-container">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Ask me anything about building habits..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            rows="1"
            disabled={isLoading}
          />
          <button
            className="chat-send-btn"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
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
      </div>
    </>
  );
};

export default Chat;
