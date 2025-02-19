import { myProvider } from "@/lib/models";
import {
  extractReasoningMiddleware,
  Message,
  smoothStream,
  streamText,
  wrapLanguageModel,
} from "ai";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const {
    messages,
    selectedModelId,
  }: { messages: Array<Message>; selectedModelId: string } =
    await request.json();

  const stream = streamText({
    system:
      "you are a friendly assistant. do not use emojis in your responses.",
    model: wrapLanguageModel({
      model: myProvider.languageModel(selectedModelId),
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
    getErrorMessage: () => {
      return `An error occurred, please try again!`;
    },
  });
}
