"use client";

import { FormEvent, useState } from "react";

import { Message } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import generateText from "@/lib/actions/openai.actions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OpenAIChat() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsTyping(true);
    const message = await generateText(prompt);

    setMessages((prevMessages) => [...prevMessages, message]);

    setIsTyping(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>OpenAI Chat</CardTitle>
        </CardHeader>
        <CardContent className="h-[60vh] overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block p-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {message.content}
              </span>
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
