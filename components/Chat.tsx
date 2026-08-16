"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export default function Chat() {
  const [input, setInput] = useState("");

  const {
    messages,
    sendMessage,
    status,
    error,
    regenerate,
    stop,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const text = input.trim();

    if (!text || status === "submitted" || status === "streaming") {
      return;
    }

    sendMessage({
      text,
    });

    setInput("");
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      const form = e.currentTarget.form;

      if (form) {
        form.requestSubmit();
      }
    }
  };

  const isLoading =
    status === "submitted" || status === "streaming";

  return (
    <main className="chat-page">
      <div className="chat-container">

        {/* Header */}
        <header className="chat-header">
          <div className="brand">
            <div className="ai-logo">AI</div>

            <div>
              <h1>AI Streaming Chat</h1>
              <p>
                Your intelligent AI assistant
              </p>
            </div>
          </div>

          <div className="online-status">
            <span className="status-dot"></span>
            Online
          </div>
        </header>

        {/* Chat area */}
        <section className="chat-area">

          {/* Empty state */}
          {messages.length === 0 && (
            <div className="empty-state">

              <div className="welcome-icon">
                ✨
              </div>

              <h2>
                How can I help you?
              </h2>

              <p>
                Ask me anything about programming,
                technology, projects, or learning.
              </p>

              <div className="suggestions">

                <button
                  type="button"
                  onClick={() =>
                    setInput(
                      "Explain React hooks in simple terms"
                    )
                  }
                >
                  ⚛️ React Hooks
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setInput(
                      "Explain JavaScript promises with an example"
                    )
                  }
                >
                  💻 JavaScript
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setInput(
                      "Give me some beginner programming project ideas"
                    )
                  }
                >
                  🚀 Project Ideas
                </button>

              </div>
            </div>
          )}

          {/* Messages */}
          <div className="messages">

            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-row ${
                  message.role === "user"
                    ? "user-row"
                    : "assistant-row"
                }`}
              >

                {/* Avatar */}
                <div
                  className={`message-avatar ${
                    message.role === "user"
                      ? "user-avatar"
                      : "ai-avatar"
                  }`}
                >
                  {message.role === "user"
                    ? "Y"
                    : "AI"}
                </div>

                {/* Message */}
                <div
                  className={`message-bubble ${
                    message.role === "user"
                      ? "user-bubble"
                      : "assistant-bubble"
                  }`}
                >

                  <div className="message-name">
                    {message.role === "user"
                      ? "You"
                      : "AI Assistant"}
                  </div>

                  <div className="message-content">
                    {message.parts.map(
                      (part, index) => {
                        if (part.type === "text") {
                          return (
                            <span key={index}>
                              {part.text}
                            </span>
                          );
                        }

                        return null;
                      }
                    )}
                  </div>

                </div>
              </div>
            ))}

            {/* Streaming indicator */}
            {status === "submitted" && (
              <div className="message-row assistant-row">

                <div className="message-avatar ai-avatar">
                  AI
                </div>

                <div className="message-bubble assistant-bubble">

                  <div className="message-name">
                    AI Assistant
                  </div>

                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="error-box">

                <div className="error-icon">
                  !
                </div>

                <div className="error-content">
                  <strong>
                    Something went wrong
                  </strong>

                  <p>
                    The AI response could not be
                    completed. Please try again.
                  </p>

                  <button
                    type="button"
                    onClick={() => regenerate()}
                    disabled={isLoading}
                  >
                    ↻ Try again
                  </button>
                </div>

              </div>
            )}

          </div>
        </section>

        {/* Input area */}
        <div className="input-section">

          <form
            onSubmit={handleSubmit}
            className="chat-form"
          >

            <input
              type="text"
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Message your AI assistant..."
              disabled={isLoading}
              aria-label="Chat message"
            />

            {isLoading ? (
              <button
                type="button"
                className="stop-button"
                onClick={() => stop()}
              >
                ■ Stop
              </button>
            ) : (
              <button
                type="submit"
                className="send-button"
                disabled={!input.trim()}
              >
                Send
                <span>➤</span>
              </button>
            )}

          </form>

          <p className="input-hint">
            Press Enter to send • Your AI response
            streams in real time
          </p>

        </div>

        {/* Footer */}
        <footer className="chat-footer">
          <span>Powered by Gemini</span>
          <span>•</span>
          <span>AI Streaming Assistant</span>
        </footer>

      </div>
    </main>
  );
}