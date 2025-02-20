import OpenAI from "openai";
import { GEMINI_API_KEY, GEMINI_BASE_URL } from "../utils/env.ts";

export const geminiClient = new OpenAI({
  baseURL: GEMINI_BASE_URL,
  apiKey: GEMINI_API_KEY,
})