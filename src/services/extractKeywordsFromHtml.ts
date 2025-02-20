import { geminiClient } from "../ai/client.ts";

export async function extractKeywordsFromHtml(html: string): Promise<string[]> {
  const completion = await geminiClient.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [
      {
        role: "system",
        content: "You will be given some HTML and you need to give me back a list of keywords, listed in a CSV format, for stuff people would like to buy"
      },
      {
        role: "user",
        content: debloatHtml(html)
      }
    ]
  }).withResponse();

  for (const choice of completion.data.choices) {
    if (!choice.message.content) {
      continue;
    }

    const keywords = sanitizeMessage(choice.message.content).split(",");
    if (keywords.length === 0) {
      continue;
    }

    return keywords;
  }

  throw new Error("No keywords found while analyzing given HTML.");
}

function debloatHtml(html: string) {
  return html.replace(/ (srcset|d)="[\s?&%;=\w:/.,-]*"/gm, "");
}

function sanitizeMessage(message: string) {
  return message
    // Remove label:
    .replace(/^.*:/, "")
    // Remove context from message
    .replace(/keyword(s)/gmi, "")
    // Replace line breaks with commas
    .replace(/(\n|\\n|\n\*|\\n\*)/gm, ",")
    // Remove stars, bruh why
    .replace(/\s*\*\s*/gm, "")
    // Remove double commas
    .replace(/,{2,}/gm, ",")
}