"use client";

import cn from "classnames";
import { toast } from "sonner";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { Messages } from "./messages";
import { models } from "@/lib/models";
import { Footnote } from "./footnote";
import { ArrowUpIcon, CheckedSquare, StopIcon, UncheckedSquare } from "./icons";
import { Input } from "./input";

export function Chat() {
  const [input, setInput] = useState<string>("");
  const [selectedModelId] = useState<string>("claude-3.7-sonnet");
  const selectedModel = models.find((model) => model.id === selectedModelId);

  const [isReasoningEnabled, setIsReasoningEnabled] = useState<boolean>(true);

  const { messages, append, status, stop } = useChat({
    id: "primary",
    body: {
      selectedModelId,
      isReasoningEnabled,
    },
    onError: () => {
      toast.error("An error occurred, please try again!");
    },
  });

  const isGeneratingResponse = ["streaming", "submitted"].includes(status);

  return (
    <div
      className={cn(
        "px-4 md:px-0 pb-4 pt-8 flex flex-col h-dvh items-center w-full",
        {
          "justify-between": messages.length > 0,
          "justify-center gap-4": messages.length === 0,
        },
      )}
    >
      {messages.length > 0 ? (
        <Messages messages={messages} status={status} />
      ) : (
        <div className="flex flex-col gap-0.5 sm:text-2xl text-xl md:w-1/2 w-full">
          <div className="flex flex-row gap-2 items-center">
            <div>Welcome to the AI SDK Reasoning Preview.</div>
          </div>
          <div className="dark:text-zinc-500 text-zinc-400">
            What would you like me to think about today?
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 md:w-1/2 w-full">
        <div className="w-full relative p-3 dark:bg-zinc-800 rounded-2xl flex flex-col gap-1 bg-zinc-100">
          <Input
            input={input}
            setInput={setInput}
            selectedModelId={selectedModelId}
            isGeneratingResponse={isGeneratingResponse}
          />

          <div className="absolute bottom-2.5 left-2.5">
            <div
              className="relative w-fit text-sm p-1.5 rounded-lg flex flex-row items-center gap-2 dark:hover:bg-zinc-600 dark:bg-zinc-700 hover:bg-zinc-200 bg-zinc-200 cursor-pointer"
              onClick={() => {
                setIsReasoningEnabled(!isReasoningEnabled);
              }}
            >
              {isReasoningEnabled ? <CheckedSquare /> : <UncheckedSquare />}
              <div>Reasoning</div>
            </div>
          </div>

          <div className="absolute bottom-2.5 right-2.5 flex flex-row gap-2">
            <div className="relative w-fit text-sm p-1.5 rounded-lg flex flex-row items-center gap-0.5 dark:hover:bg-zinc-700 hover:bg-zinc-200 cursor-pointer">
              <div>
                {selectedModel ? selectedModel.name : "Models Unavailable!"}
              </div>
              {/* <div className="text-zinc-500">
                <ChevronDownIcon />
              </div> */}

              {/* <select
                className="absolute opacity-0 w-full p-1 left-0 cursor-pointer"
                onChange={(event) => setSelectedModelId(event.target.value)}
              >
                <option value="claude-3.7-sonnet">Claude 3.7 Sonnet</option>
                <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
              </select> */}
            </div>

            <button
              className={cn(
                "size-8 flex flex-row justify-center items-center dark:bg-zinc-100 bg-zinc-900 dark:text-zinc-900 text-zinc-100 p-1.5 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-300 hover:scale-105 active:scale-95 transition-all",
                {
                  "dark:bg-zinc-200 dark:text-zinc-500":
                    isGeneratingResponse || input === "",
                },
              )}
              onClick={() => {
                if (input === "") {
                  return;
                }

                if (isGeneratingResponse) {
                  stop();
                } else {
                  append({
                    role: "user",
                    content: input,
                    createdAt: new Date(),
                  });
                }

                setInput("");
              }}
            >
              {isGeneratingResponse ? <StopIcon /> : <ArrowUpIcon />}
            </button>
          </div>
        </div>

        <Footnote />
      </div>
    </div>
  );
}
