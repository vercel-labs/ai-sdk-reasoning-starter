"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { ArrowUpIcon, ChevronDownIcon, VercelIcon } from "./icons";
import Markdown from "react-markdown";
import { markdownComponents } from "./markdown-components";
import cn from "classnames";
import { ReasoningMessagePart } from "./messages";
import Link from "next/link";

export function Chat() {
  const { messages, append, status } = useChat({});
  const [input, setInput] = useState<string>("");

  return (
    <div
      className={cn("pb-4 flex flex-col md:w-1/2 w-full h-dvh", {
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
                  "ml-auto bg-zinc-800 p-2 rounded-xl": message.role === "user",
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
        </div>
      ) : (
        <div className="flex flex-col gap-0.5">
          <div className="text-2xl flex flex-row gap-2 items-center">
            <div>Welcome to the Reasoning Preview</div>
          </div>
          <div className="text-2xl dark:text-zinc-500">
            What would you like me to think about today?
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="w-full relative p-3 dark:bg-zinc-800 rounded-2xl flex flex-col gap-1">
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
            <div className="w-fit text-sm p-1 px-1.5 rounded-md flex flex-row items-center gap-0.5 hover:bg-zinc-700 cursor-pointer">
              <div>Deepseek R1</div>
              <ChevronDownIcon />
            </div>

            <button
              className={cn(
                "dark:bg-zinc-100 dark:text-zinc-900 p-1.5 rounded-full hover:bg-zinc-200",
                {
                  "bg-zinc-200 text-zinc-500 cursor-not-allowed":
                    status === "streaming" ||
                    status === "submitted" ||
                    input === "",
                },
              )}
              onClick={() => {
                append({
                  role: "user",
                  content: input,
                  createdAt: new Date(),
                });

                setInput("");
              }}
              disabled={
                status === "streaming" || status === "submitted" || input === ""
              }
            >
              <ArrowUpIcon />
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
          . Read more about how to use reasoning models in your applications in
          our{" "}
          <Link
            className="underline underline-offset-2"
            href="https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot#reasoning"
            target="_blank"
          >
            documentation
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
