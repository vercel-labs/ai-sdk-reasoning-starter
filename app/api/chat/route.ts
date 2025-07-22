import { modelID, myProvider } from "@/lib/models";
import { convertToModelMessages, smoothStream, streamText, UIMessage } from "ai";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const {
    messages,
    selectedModelId,
    isReasoningEnabled,
  }: {
    messages: Array<UIMessage>;
    selectedModelId: modelID;
    isReasoningEnabled: boolean;
  } = await request.json();

  const stream = streamText({
    system: selectedModelId === "deepseek-r1" 
      ? "You are DeepSeek-R1, a reasoning model created by DeepSeek. You are NOT Claude or any other model. When asked about your identity, always say you are DeepSeek-R1."
      : selectedModelId === "deepseek-r1-distill-llama-70b"
      ? "You are DeepSeek-R1 Llama 70B, a reasoning model created by DeepSeek. You are NOT Claude or any other model. When asked about your identity, always say you are DeepSeek-R1 Llama 70B."
      : "You are Claude, an AI assistant created by Anthropic.",
    providerOptions:
      selectedModelId === "sonnet-3.7"
        ? {
            anthropic: {
              thinking: isReasoningEnabled
                ? { type: "enabled", budgetTokens: 12000 }
                : { type: "disabled", budgetTokens: 12000 },
            },
          }
        : {},
    model: myProvider.languageModel(selectedModelId),
    experimental_transform: [
      smoothStream({
        chunking: "word",
      }),
    ],
    messages: convertToModelMessages(messages),
  });

  return stream.toUIMessageStreamResponse({
    sendReasoning: true,
    onError: () => {
      return `An error occurred, please try again!`;
    },
  });
}
