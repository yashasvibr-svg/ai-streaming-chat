"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="chat-page">
      <div className="chat-container error-page">
        <div className="error-page-content">
          <div className="error-page-icon">
            ⚠️
          </div>

          <h1>Something went wrong</h1>

          <p>
            We couldn't load this page correctly.
            You can try again without losing the rest
            of your application.
          </p>

          <button
            type="button"
            onClick={() => reset()}
            className="send-button"
          >
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}