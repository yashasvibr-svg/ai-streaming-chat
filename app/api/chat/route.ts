import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const messages = body.messages as UIMessage[];

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({
          error: "Please enter a message before starting the chat.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: google("gemini-3.6-flash"),

      system:
        "You are a helpful AI assistant. " +
        "Explain concepts clearly and simply. " +
        "When the user asks programming questions, give accurate examples " +
        "and step-by-step explanations.",

      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("CHAT API ERROR:", error);

    return new Response(
      JSON.stringify({
        error:
          "The AI response could not be completed. Please try again.",
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