import type { Page } from "playwright";
import * as path from "node:path";
import { BROWSER_TIMEOUT } from "../utils/env.ts";

export type Dependencies = {
  page: Page;
}

export async function extractAmazonSearchForSaleItems(searchTerm: string, { page }: Dependencies) {
  const k = searchTerm.replace(/\s/g, "+");
  const url = `https://www.amazon.ca/s?k=${k}`;
  await pageGoto(page, url);
  await page.waitForSelector("[data-component-type='s-search-results']", {
    timeout: BROWSER_TIMEOUT,
  });
  await page.screenshot({
    path: path.join(process.cwd(), `.debug/amazon-search_${k}.jpeg`),
    fullPage: true,
    type: "jpeg",
  })
}

async function pageGoto(page: Page, url: string) {
  const response = await page.goto(url, {
    timeout: BROWSER_TIMEOUT,
  });
  if (!response || !response.ok) {
    throw new Error(`Failed to navigate to '${url}'`);
  }
}