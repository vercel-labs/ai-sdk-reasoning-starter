import { customProvider } from "ai";
import { openai } from "@ai-sdk/openai";
import { fireworks } from "@ai-sdk/fireworks";

export const myProvider = customProvider({
  languageModels: {
    "deepseek-r1": fireworks("accounts/fireworks/models/deepseek-r1"),
    "o3-mini": openai("o3-mini"),
  },
});

interface Model {
  id: string;
  name: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: "deepseek-r1",
    name: "DeepSeek R1",
    description:
      "A specialized model using Chain of Thought reasoning for improved accuracy, with visible reasoning steps. Served by Fireworks AI.",
  },
  {
    id: "o3-mini",
    name: "o3 mini",
    description:
      "OpenAI's small reasoning model optimized for science, math, and coding tasks. Supports structured outputs and function calling.",
  },
];
