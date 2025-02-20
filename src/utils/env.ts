export const GEMINI_API_KEY = String(process.env.GEMINI_API_KEY);
export const GEMINI_BASE_URL = process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta/openai/";
export const BROWSER_TIMEOUT = parseInt(process.env.BROWSER_TIMEOUT ?? "") || 10_000;