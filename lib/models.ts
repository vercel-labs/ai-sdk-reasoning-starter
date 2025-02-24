import { customProvider } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

export const myProvider = customProvider({
  languageModels: {
    "claude-3.7-sonnet": anthropic("claude-3-7-sonnet-20250219"),
  },
});

interface Model {
  id: string;
  name: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: "claude-3.7-sonnet",
    name: "Claude 3.7 Sonnet",
    description:
      "Claude 3.7 Sonnet is Anthropic's most intelligent model to date and the first Claude model to offer extended thinking – the ability to solve complex problems with careful, step-by-step reasoning.",
  },
];
