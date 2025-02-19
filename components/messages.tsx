"use client";

import cn from "classnames";
import Markdown from "react-markdown";
import { markdownComponents } from "./markdown-components";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, SpinnerIcon } from "./icons";
import { UIMessage } from "ai";
import { UseChatHelpers } from "@ai-sdk/react";

interface ReasoningMessagePartProps {
  reasoning: string;
  isReasoning: boolean;
}

export function ReasoningMessagePart({
  reasoning,
  isReasoning,
}: ReasoningMessagePartProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const variants = {
    collapsed: {
      height: 0,
      opacity: 0,
      marginTop: 0,
      marginBottom: 0,
    },
    expanded: {
      height: "auto",
      opacity: 1,
      marginTop: "1rem",
      marginBottom: 0,
    },
  };

  return (
    <div className="flex flex-col">
      {isReasoning ? (
        <div className="flex flex-row gap-2 items-center">
          <div className="font-medium text-sm">Reasoning</div>
          <div className="animate-spin">
            <SpinnerIcon />
          </div>
        </div>
      ) : (
        <div className="flex flex-row gap-2 items-center">
          <div className="font-medium text-sm">Reasoned for a few seconds</div>
          <button
            className={cn(
              "cursor-pointer rounded-full dark:hover:bg-zinc-800 hover:bg-zinc-200",
              {
                "dark:bg-zinc-800 bg-zinc-200": isExpanded,
              },
            )}
            onClick={() => {
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? <ChevronDownIcon /> : <ChevronUpIcon />}
          </button>
        </div>
      )}

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="reasoning"
            className="text-sm dark:text-zinc-400 text-zinc-600 flex flex-col gap-4 border-l pl-3 dark:border-zinc-800"
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={variants}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Markdown components={markdownComponents}>{reasoning}</Markdown>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface TextMessagePartProps {
  text: string;
}

export function TextMessagePart({ text }: TextMessagePartProps) {
  return (
    <div className="flex flex-col gap-4">
      <Markdown components={markdownComponents}>{text}</Markdown>
    </div>
  );
}

interface MessagesProps {
  messages: Array<UIMessage>;
  status: UseChatHelpers["status"];
}

export function Messages({ messages, status }: MessagesProps) {
  const messagesRef = useRef<HTMLDivElement>(null);
  const messagesLength = useMemo(() => messages.length, [messages]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messagesLength]);

  return (
    <div className="flex flex-col gap-4 overflow-y-scroll" ref={messagesRef}>
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
                <TextMessagePart
                  key={`${message.id}-${partIndex}`}
                  text={part.text}
                />
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
        <div className="text-zinc-500 mb-12">Hmm...</div>
      )}
    </div>
  );
}
