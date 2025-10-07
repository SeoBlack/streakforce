import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import { useContext } from "react";
import HabitContext from "../../context/habitContextBase";
import { API_ENDPOINTS } from "../../utils/api";
import ChatToggleButton from "./ChatToggleButton";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "./ChatInput";
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
        .slice(-5)
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
      <ChatToggleButton isOpen={isOpen} onClick={toggleChat} />

      <div className={`chat-window ${isOpen ? "chat-window-open" : ""}`}>
        <ChatHeader onClear={clearChat} />

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onSend={handleSend}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          inputRef={inputRef}
        />
      </div>
    </>
  );
};

export default Chat;
