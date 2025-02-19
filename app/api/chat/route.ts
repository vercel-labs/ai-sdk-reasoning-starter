import { fireworks } from "@ai-sdk/fireworks";
import {
  extractReasoningMiddleware,
  smoothStream,
  streamText,
  wrapLanguageModel,
} from "ai";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { messages } = await request.json();

  const stream = streamText({
    system:
      "you are a friendly assistant. do not use emojis in your responses.",
    model: wrapLanguageModel({
      model: fireworks("accounts/fireworks/models/deepseek-r1"),
      middleware: extractReasoningMiddleware({ tagName: "think" }),
    }),
    experimental_transform: [
      smoothStream({
        chunking: "word",
      }),
    ],
    messages,
  });

  return stream.toDataStreamResponse({
    sendReasoning: true,
  });
}
