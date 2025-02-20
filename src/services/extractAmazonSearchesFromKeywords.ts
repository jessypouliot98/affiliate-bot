import { geminiClient } from "../ai/client.ts";

export async function extractAmazonSearchesFromKeywords(keywords: string[]) {
  const completion = await geminiClient.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
      {
        role: "system",
        content: "You will be given a list of keywords, with these you will list, in a CSV format, a minimal amount of search terms to use on Amazon to find some products to buy."
      },
      {
        role: "user",
        content: keywords.map((keyword) => `"${keyword}"`).join(", "),
      }
    ]
  }).withResponse();

  const searchTerms: string[] = [];

  for (const choice of completion.data.choices) {
    if (!choice.message.content) {
      continue;
    }

    searchTerms.push(...sanitizeMessage(choice.message.content).split(","))
  }

  if (searchTerms.length === 0) {
    throw new Error("No Amazon search terms to be extracted");
  }

  return searchTerms;
}

function sanitizeMessage(message: string) {
  return message
    // Remove label:
    .replace(/^.*:/, "")
    .replace(/(```csv|```)/gm, "")
    // Remove context from message
    .replace(/keyword(s?)|search|term(s?)|categor(y|ies)/gmi, "")
    // Replace line breaks with commas
    .replace(/(\n|\\n|\n\*|\\n\*)/gm, ",")
    // Remove stars, bruh why
    .replace(/\s*\*\s*/gm, "")
    // Remove double commas
    .replace(/,{2,}/gm, ",")
    // Remove quotes
    .replace(/(\\"|\")/gm, "")
}