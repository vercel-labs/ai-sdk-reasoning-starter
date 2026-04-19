import { createAnthropic } from "@ai-sdk/anthropic";
import { getVercelOidcToken } from "@vercel/functions/oidc";
import { Message, smoothStream, streamText } from "ai";
import { checkBotId } from "botid/server";
import { NextRequest } from "next/server";

const MODEL_IDS: Record<string, string> = {
  "claude-3.7-sonnet": "anthropic/claude-3.7-sonnet",
  "claude-3.5-sonnet": "anthropic/claude-sonnet-4.5",
};

export async function POST(request: NextRequest) {
  const { isBot } = await checkBotId();
  if (isBot) {
    return new Response("Access denied", { status: 403 });
  }

  const {
    messages,
    selectedModelId,
  }: {
    messages: Array<Message>;
    selectedModelId: string;
    isReasoningEnabled: boolean;
  } = await request.json();

  const anthropic = createAnthropic({
    baseURL: "https://ai-gateway.vercel.sh",
    apiKey: await getVercelOidcToken(),
  });

  const modelId = MODEL_IDS[selectedModelId] ?? MODEL_IDS["claude-3.7-sonnet"];

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
    model: anthropic(modelId),
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
