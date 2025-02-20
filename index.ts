import { extractHtmlBlockFromWebsite } from "./src/services/extractHtmlBlockFromWebsite.ts";
import { browser } from "./src/browser/client.ts";
import { extractKeywordsFromHtml } from "./src/services/extractKeywordsFromHtml.ts";
import { extractAmazonSearchesFromKeywords } from "./src/services/extractAmazonSearchesFromKeywords.ts";
import { extractAmazonSearchForSaleItems } from "./src/services/extractAmazonSearchForSaleItems.ts";

async function main() {
  const b = await browser;

  const page = await b.newPage();
  const html = await extractHtmlBlockFromWebsite(
    {
      url: "https://www.theverge.com/",
      selector: "#content"
    },
    { page }
  );
  console.log({ html });

  const keywords = await extractKeywordsFromHtml(html);
  console.log({ keywords });

  const searchTerms = await extractAmazonSearchesFromKeywords(keywords);
  console.log({searchTerms});

  for (const searchTerm of searchTerms) {
    if (searchTerm.trim() === "") continue;
    await extractAmazonSearchForSaleItems(searchTerm, { page });
  }

  await page.close();
  await b.close();
}

await main();
