"use client";

import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";

interface InputProps {
  input: string;
  setInput: (value: string) => void;
  selectedModelId: string;
  isGeneratingResponse: boolean;
  isReasoningEnabled: boolean;
}

export function Input({
  input,
  setInput,
  selectedModelId,
  isGeneratingResponse,
  isReasoningEnabled,
}: InputProps) {
  const { append } = useChat({
    id: "primary",
    body: {
      selectedModelId,
      isReasoningEnabled,
    },
    onError: () => {
      toast.error("An error occurred, please try again!");
    },
  });

  return (
    <textarea
      className="mb-12 resize-none w-full min-h-12 outline-none bg-transparent placeholder:text-zinc-400"
      placeholder="Send a message"
      value={input}
      autoFocus
      onChange={(event) => {
        setInput(event.currentTarget.value);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();

          if (input === "") {
            return;
          }

          if (isGeneratingResponse) {
            toast.error("Please wait for the model to finish its response!");

            return;
          }

          append({
            role: "user",
            content: input,
            createdAt: new Date(),
          });

          setInput("");
        }
      }}
    />
  );
}
