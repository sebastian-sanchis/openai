"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import { Message } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import generateText from "@/lib/actions/gemini.actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function GeminiChat() {
  const [prompt, setPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [displayedMessages, setDisplayedMessages] = useState<
    { role: string; content: string }[]
  >([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPrompt("");
    setIsTyping(true);

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: prompt },
    ]);
    setDisplayedMessages((prev) => [
      ...prev,
      { role: "user", content: prompt },
    ]);

    const message = await generateText(prompt);

    setMessages((prevMessages) => [...prevMessages, message]);
    setDisplayedMessages((prev) => [
      ...prev,
      { role: "assistant", content: "" },
    ]);
    setIsTyping(false);
  }

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    const lastDisplayed = displayedMessages[displayedMessages.length - 1];

    if (
      lastMessage &&
      lastDisplayed &&
      lastMessage.role === "assistant" &&
      lastDisplayed.content.length < (lastMessage.content?.length ?? 0)
    ) {
      const timer = setInterval(() => {
        setDisplayedMessages((prev) => {
          const updated = [...prev];
          const currentText = updated[updated.length - 1].content;
          const fullText = lastMessage.content;

          if (fullText && currentText.length < fullText.length) {
            updated[updated.length - 1].content = fullText.slice(
              0,
              currentText.length + 1
            );
          }
          return updated;
        });
      }, 20);

      return () => clearInterval(timer);
    }
  }, [messages, displayedMessages]);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [displayedMessages, isTyping]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Gemini Chat</CardTitle>
        </CardHeader>
        <CardContent
          ref={chatContainerRef}
          className="h-[60vh] overflow-y-auto no-scrollbar"
        >
          {displayedMessages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <ReactMarkdown
                  components={{
                    p: ({ ...props }) => (
                      <p className="mb-2 last:mb-0" {...props} />
                    ),
                    ul: ({ ...props }) => (
                      <ul className="mb-2 list-disc pl-5" {...props} />
                    ),
                    li: ({ ...props }) => <li className="mb-1" {...props} />,
                    strong: ({ ...props }) => (
                      <strong className="font-bold" {...props} />
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="text-left">
              <span className="inline-block p-2 rounded-lg bg-gray-200 text-black">
                AI is typing...
              </span>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSubmit} className="flex w-full space-x-2">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow"
            />
            <Button type="submit" disabled={isTyping}>
              Send
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
