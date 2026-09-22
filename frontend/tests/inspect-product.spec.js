import { test, expect } from "@playwright/test";

test("inspect product actions", async ({ page }) => {
  await page.goto("http://localhost:5173/shop");

  const firstProduct = page.locator('a[href*="/product/"]').first();
  await expect(firstProduct).toBeVisible();

  await firstProduct.click();
  await page.waitForTimeout(1000);

  console.log("PRODUCT URL:");
  console.log(page.url());

  console.log("BUTTONS:");
  console.log(await page.locator("button").allTextContents());

  console.log("LINKS:");
  console.log(await page.locator("a").allTextContents());
});