import { test, expect } from "@playwright/test";

test.describe("Velmora Product Details QA", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/shop");

    const firstProduct = page.locator('a[href*="/product/"]').first();
    await expect(firstProduct).toBeVisible();

    await firstProduct.click();
    await expect(page).toHaveURL(/\/product\//);
  });

  test("product page loads", async ({ page }) => {
    await expect(page.locator("body")).toBeVisible();
  });

  test("product title is visible", async ({ page }) => {
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });

  test("product page contains price text", async ({ page }) => {
    const bodyText = await page.locator("body").innerText();

    expect(
      bodyText.includes("₹") ||
      bodyText.toLowerCase().includes("price")
    ).toBeTruthy();
  });

  test("product page has working image", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    const images = page.locator("img");
    const count = await images.count();

    expect(count).toBeGreaterThan(0);

    const brokenImages = [];

    for (let i = 0; i < count; i++) {
      const image = images.nth(i);

      await image.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);

      const info = await image.evaluate((img) => ({
        src: img.currentSrc || img.src,
        alt: img.alt,
        complete: img.complete,
        width: img.naturalWidth,
      }));

      if (!info.complete || info.width === 0) {
        brokenImages.push(info);
      }
    }

    console.log("Broken product images:", brokenImages);
    expect(brokenImages).toEqual([]);
  });

  test("product page has interactive action button", async ({ page }) => {
    const buttons = page.locator("button");
    expect(await buttons.count()).toBeGreaterThan(0);
  });

  test("product page has no console errors", async ({ page }) => {
    const errors = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForTimeout(1500);

    expect(errors).toEqual([]);
  });

  test("product page has no desktop horizontal overflow", async ({ page }) => {
    const size = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(size.scrollWidth).toBeLessThanOrEqual(size.clientWidth + 1);
  });

  test("product page works on 375px mobile", async ({ page }) => {
    await page.setViewportSize({
      width: 375,
      height: 812,
    });

    const currentUrl = page.url();
    await page.goto(currentUrl);

    const size = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(size.scrollWidth).toBeLessThanOrEqual(size.clientWidth + 1);
  });
});