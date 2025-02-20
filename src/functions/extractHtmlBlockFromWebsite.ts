import type { Page } from "playwright";
import { BROWSER_TIMEOUT } from "../utils/env.ts";

export type WebsiteBlockDetails = {
  url: string;
  selector: string | string[];
}

export type Dependencies = {
  page: Page;
}

export async function extractHtmlBlockFromWebsite(block: WebsiteBlockDetails, { page }: Dependencies): Promise<string> {
  const response = await page.goto(block.url, {
    timeout: BROWSER_TIMEOUT,
  });
  if (!response || !response.ok) {
    throw new Error(`Failed to navigate to '${block.url}'`);
  }

  let html = "";

  const selectors = Array.isArray(block.selector) ? block.selector : [block.selector];

  for (const selector of selectors) {
    const locator = page.locator(selector);
    const items = await locator.all();
    for (const item of items) {
      html += await item.evaluate((node) => node.outerHTML)
    }
  }

  html = html.trim();

  if (html.length === 0) {
    throw new Error(`No html extracted from '${block.url}'`)
  }

  return html;
}