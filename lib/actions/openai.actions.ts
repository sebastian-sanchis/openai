"use server";

import { Message } from "@/types";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function generateText(prompt: string): Promise<Message> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });

    return completion.choices[0].message;
  } catch (error) {
    throw new Error(`Failed to generate text: ${error}`);
  }
}
