import { myProvider } from "@/lib/models";
import { Message, smoothStream, streamText } from "ai";
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
          type: "enabled",
          budgetTokens: 12000,
        },
      },
    },
    model: myProvider.languageModel(selectedModelId),
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
