"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

import { Message } from "@/types";
import { SYSTEM_INSTRUCTIONS } from "@/constants";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: SYSTEM_INSTRUCTIONS,
});

export default async function generateText(prompt: string): Promise<Message> {
  try {
    const result = await model.generateContent(prompt);

    return { role: "assistant", content: result.response.text() };
  } catch (error) {
    throw new Error(`Failed to generate text: ${error}`);
  }
}
