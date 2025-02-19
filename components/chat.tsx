"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { ArrowUpIcon } from "./icons";
import Markdown from "react-markdown";
import { markdownComponents } from "./markdown-components";
import cn from "classnames";
import { ReasoningMessagePart } from "./messages";

export function Chat() {
  const { messages, append, status } = useChat({});
  const [input, setInput] = useState<string>("");

  return (
    <div className="pb-4 flex flex-col md:w-1/2 w-full h-dvh justify-between">
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

      <div className="w-full relative p-3 dark:bg-zinc-800 rounded-2xl">
        <textarea
          className="resize-none w-full min-h-20 outline-none bg-transparent"
          placeholder="Send a message"
          value={input}
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

        <button
          className="dark:bg-zinc-100 dark:text-zinc-900 p-1.5 rounded-full absolute bottom-2.5 right-2.5 hover:bg-zinc-200"
          onClick={() => {
            append({
              role: "user",
              content: input,
              createdAt: new Date(),
            });
          }}
        >
          <ArrowUpIcon />
        </button>
      </div>
    </div>
  );
}
