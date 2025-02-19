"use client";

import cn from "classnames";
import Link from "next/link";
import Markdown from "react-markdown";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { markdownComponents } from "./markdown-components";
import { ReasoningMessagePart } from "./messages";
import { Drawer } from "vaul";
import { models } from "@/lib/models";
import { ArrowUpIcon, ChevronDownIcon, StopIcon } from "./icons";
import { toast } from "sonner";

export function Chat() {
  const [input, setInput] = useState<string>("");
  const [selectedModelId, setSelectedModelId] = useState<string>("deepseek-r1");
  const selectedModel = models.find((model) => model.id === selectedModelId);

  const { messages, append, status, stop } = useChat({
    body: {
      selectedModelId,
    },
    onError: () => {
      toast.error("An error occurred, please try again!");
    },
  });

  const isGeneratingResponse = ["streaming", "submitted"].includes(status);

  return (
    <Drawer.Root>
      <div
        className={cn("px-4 md:px-0 pb-4 flex flex-col md:w-1/2 w-full h-dvh", {
          "justify-between": messages.length > 0,
          "justify-center gap-4": messages.length === 0,
        })}
      >
        {messages.length > 0 ? (
          <div className="flex flex-col gap-4 overflow-y-scroll">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col gap-4 last-of-type:mb-12 first-of-type:mt-12",
                  {
                    "ml-auto dark:bg-zinc-800 bg-zinc-200 p-2 rounded-xl":
                      message.role === "user",
                    "": message.role === "assistant",
                  },
                )}
              >
                {message.parts.map((part, partIndex) => {
                  if (part.type === "text") {
                    return (
                      <div
                        key={`${message.id}-${partIndex}`}
                        className="flex flex-col gap-4"
                      >
                        <Markdown components={markdownComponents}>
                          {part.text}
                        </Markdown>
                      </div>
                    );
                  }

                  if (part.type === "reasoning") {
                    return (
                      <ReasoningMessagePart
                        key={`${message.id}-${partIndex}`}
                        reasoning={part.reasoning}
                        isReasoning={
                          status === "streaming" &&
                          partIndex === message.parts.length - 1
                        }
                      />
                    );
                  }
                })}
              </div>
            ))}

            {status === "submitted" && (
              <div className="text-zinc-500">Hmm...</div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-0.5 sm:text-2xl text-xl">
            <div className="flex flex-row gap-2 items-center">
              <div>Welcome to the Reasoning Preview.</div>
            </div>
            <div className="dark:text-zinc-500 text-zinc-400">
              What would you like me to think about today?
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="w-full relative p-3 dark:bg-zinc-800 rounded-2xl flex flex-col gap-1 bg-zinc-100">
            <textarea
              className="resize-none w-full min-h-20 outline-none bg-transparent placeholder:text-zinc-400"
              placeholder="Send a message"
              value={input}
              autoFocus
              onChange={(event) => {
                setInput(event.currentTarget.value);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();

                  if (isGeneratingResponse) {
                    toast.error(
                      "Please wait for the model to finish its response!",
                    );

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

            <div className="absolute bottom-2.5 right-2.5 flex flex-row gap-2">
              <Drawer.Trigger>
                <div className="w-fit text-sm p-1.5 rounded-lg flex flex-row items-center gap-0.5 dark:hover:bg-zinc-700 hover:bg-zinc-200 cursor-pointer">
                  <div>
                    {selectedModel ? selectedModel.name : "Models Unavailable!"}
                  </div>
                  <div className="text-zinc-500">
                    <ChevronDownIcon />
                  </div>
                </div>
              </Drawer.Trigger>

              <button
                className={cn(
                  "size-8 flex flex-row justify-center items-center dark:bg-zinc-100 bg-zinc-900 dark:text-zinc-900 text-zinc-100 p-1.5 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-300",
                  {
                    "dark:bg-zinc-200 dark:text-zinc-500":
                      isGeneratingResponse || input === "",
                  },
                )}
                onClick={() => {
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

          <div className="text-xs text-zinc-400">
            This preview is built using{" "}
            <Link
              className="underline underline-offset-2"
              href="https://nextjs.org/"
              target="_blank"
            >
              Next.js
            </Link>{" "}
            and the{" "}
            <Link
              className="underline underline-offset-2"
              href="https://sdk.vercel.ai/"
              target="_blank"
            >
              AI SDK
            </Link>
            . Read more about how to use reasoning models in your applications
            in our{" "}
            <Link
              className="underline underline-offset-2"
              href="https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot#reasoning"
              target="_blank"
            >
              documentation
            </Link>
            .
          </div>

          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40" />
            <Drawer.Content className="bg-gray-100 h-fit fixed bottom-0 left-0 right-0 outline-none">
              <div className="p-4 dark:bg-zinc-800 flex flex-col gap-8">
                <div className="flex flex-col gap-0.5">
                  <Drawer.Title className="text-xl">
                    Choose a Model
                  </Drawer.Title>
                  <Drawer.Description className="dark:text-zinc-400 text-zinc-500">
                    Select a reasoning model from below to use for the preview.
                  </Drawer.Description>
                </div>

                <div className="flex flex-col gap-2 pb-12">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      className={cn(
                        "flex flex-row gap-4 p-2 rounded-lg dark:hover:bg-zinc-600 hover:bg-zinc-300",
                        model.id === selectedModelId
                          ? "dark:bg-zinc-700 bg-zinc-200"
                          : "",
                      )}
                      onClick={() => setSelectedModelId(model.id)}
                    >
                      <div className="min-w-32 text-left">{model.name}</div>
                      <div className="dark:text-zinc-300 text-zinc-600 text-left">
                        {model.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </div>
      </div>
    </Drawer.Root>
  );
}
