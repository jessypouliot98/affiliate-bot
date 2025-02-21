import { extractHtmlBlockFromWebsite } from "./src/functions/extractHtmlBlockFromWebsite.ts";
import { browser } from "./src/browser/client.ts";
import { extractKeywordsFromHtml } from "./src/functions/extractKeywordsFromHtml.ts";
import { extractAmazonSearchesFromKeywords } from "./src/functions/extractAmazonSearchesFromKeywords.ts";
import { extractAmazonSearchForSaleItemLinks } from "./src/functions/extractAmazonSearchForSaleItemLinks.ts";

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
    await extractAmazonSearchForSaleItemLinks(searchTerm, { page });
  }

  await page.close();
  await b.close();
}

await main();
