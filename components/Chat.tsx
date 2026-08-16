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

    if (!text || isLoading) {
      return;
    }

    sendMessage({
      text,
    });

    setInput("");
  };

  const isLoading =
    status === "submitted" || status === "streaming";

  return (
    <main className="chat-page">
      <div className="chat-container">

        {/* Header */}
        <header className="chat-header">
          <div className="header-left">
            <div className="ai-logo">AI</div>

            <div>
              <h1>AI Streaming Chat</h1>
              <p>Your intelligent AI assistant</p>
            </div>
          </div>

          <div className="online-status">
            <span className="status-dot"></span>
            Online
          </div>
        </header>

        {/* Chat area */}
        <section className="chat-body">

          {/* Empty state */}
          {messages.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">✨</div>

              <h2>Start a conversation</h2>

              <p>
                Ask me anything and watch the response
                stream in real time.
              </p>

              <button
                type="button"
                className="example-button"
                onClick={() =>
                  setInput(
                    "Explain React hooks in simple terms"
                  )
                }
              >
                Try an example
              </button>
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

                {/* AI avatar */}
                {message.role === "assistant" && (
                  <div className="message-avatar">
                    AI
                  </div>
                )}

                <div
                  className={`message ${
                    message.role === "user"
                      ? "user-message"
                      : "assistant-message"
                  }`}
                >
                  <div className="message-label">
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

                {/* User avatar */}
                {message.role === "user" && (
                  <div className="message-avatar user-avatar">
                    Y
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {status === "submitted" && (
              <div className="message-row assistant-row">
                <div className="message-avatar">
                  AI
                </div>

                <div className="message assistant-message">
                  <div className="message-label">
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
                <div className="error-content">
                  <strong>
                    Something went wrong
                  </strong>

                  <p>
                    The response could not be completed.
                    Please try again.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => regenerate()}
                  disabled={isLoading}
                  className="retry-button"
                >
                  Try again
                </button>
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
              placeholder="Message your AI assistant..."
              disabled={isLoading}
              aria-label="Chat message"
            />

            {/* Stop button while generating */}
            {isLoading ? (
              <button
                type="button"
                onClick={() => stop()}
                className="stop-button"
              >
                ■ Stop
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                className="send-button"
              >
                Send ➤
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