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
  {
    id: "claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    description:
      "Claude 3.5 Sonnet is Anthropic's model that strikes the ideal balance between intelligence and speed – particularly for enterprise workloads.",
  },
];
