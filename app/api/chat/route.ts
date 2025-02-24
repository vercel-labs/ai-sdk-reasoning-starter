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
    isReasoningEnabled,
  }: {
    messages: Array<Message>;
    selectedModelId: string;
    isReasoningEnabled: boolean;
  } = await request.json();

  const stream = streamText({
    system:
      "you are a friendly assistant. do not use emojis in your responses.",
    providerOptions: {
      anthropic: {
        thinking: {
          type: isReasoningEnabled ? "enabled" : "disabled",
          budgetTokens: 12000,
        },
      },
    },
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
