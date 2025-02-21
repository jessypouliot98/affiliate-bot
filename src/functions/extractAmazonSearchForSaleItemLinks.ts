import type { Page } from "playwright";
import * as path from "node:path";
import { BROWSER_TIMEOUT } from "../utils/env.ts";

export type Dependencies = {
  page: Page;
}

export async function extractAmazonSearchForSaleItemLinks(searchTerm: string, { page }: Dependencies): Promise<string[]> {
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
  });
  const dealLocator = page.locator("[data-a-badge-type='deal']");
  const dealTags = await dealLocator.all();

  const productPaths = await Promise.all(
    dealTags.map((dealTag) => {
      return dealTag.evaluate((node) => {
        return node.querySelector("[data-a-badge-type='deal']")?.closest("[data-component-id]")?.querySelector("a")?.getAttribute("href");
      })
    })
  )

  return productPaths
    .filter((path) => path != undefined)
    .map((path) => "https://amazon.ca" + path);
}

async function pageGoto(page: Page, url: string) {
  const response = await page.goto(url, {
    timeout: BROWSER_TIMEOUT,
  });
  if (!response || !response.ok) {
    throw new Error(`Failed to navigate to '${url}'`);
  }
}