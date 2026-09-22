import { test } from "@playwright/test";

test("inspect checkout empty state", async ({ page }) => {
  await page.goto("http://localhost:5173/checkout");
  await page.waitForTimeout(1000);

  console.log("CHECKOUT TEXT:");
  console.log(await page.locator("body").innerText());

  console.log("BUTTONS:");
  console.log(await page.locator("button").allTextContents());

  console.log("LINKS:");
  console.log(await page.locator("a").allTextContents());
});