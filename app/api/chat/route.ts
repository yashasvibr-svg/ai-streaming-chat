import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";
import { google } from "@ai-sdk/google";

// --------------------------------------------------
// TEST MODE
// Change this to true ONLY when testing the 429 error.
// Keep it false for the final project.
// --------------------------------------------------
const TEST_RATE_LIMIT = false;
const TEST_MID_STREAM=false;

export async function POST(req: Request) {
  try {
    // ----------------------------------------------
    // Temporary 429 rate-limit sabotage test
    // ----------------------------------------------
    if (TEST_RATE_LIMIT) {
      return new Response(
        JSON.stringify({
          error:
            "Too many requests. Please wait a moment and try again.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ----------------------------------------------
    // Read request
    // ----------------------------------------------
    const body = await req.json();

    const messages = body.messages as UIMessage[];

    // ----------------------------------------------
    // Validate messages
    // ----------------------------------------------
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({
          error:
            "Please enter a message before starting the chat.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ----------------------------------------------
    // Convert UI messages for the model
    // ----------------------------------------------
    const modelMessages =
      await convertToModelMessages(messages);

    // ----------------------------------------------
    // Stream Gemini response
    // ----------------------------------------------
   const result = streamText({
  model: google("gemini-3.6-flash"),

  system:
    "You are a helpful AI assistant. " +
    "Explain concepts clearly and simply. " +
    "When the user asks programming questions, " +
    "give accurate examples and step-by-step explanations.",

  messages: modelMessages,

  onFinish: async () => {
    if (TEST_MID_STREAM) {
      console.log("MID-STREAM TEST: response completed");
    }
  },
});

    // ----------------------------------------------
    // Return streaming response
    // ----------------------------------------------
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("CHAT API ERROR:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred.";

    return new Response(
      JSON.stringify({
        error: errorMessage,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}