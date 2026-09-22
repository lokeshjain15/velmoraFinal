import { test, expect } from "@playwright/test";

test.describe("Velmora Shop Page QA", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/shop");
  });

  test("shop page loads", async ({ page }) => {
    await expect(page).toHaveURL(/\/shop/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("shop heading is visible", async ({ page }) => {
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();
  });

  test("shop contains product links", async ({ page }) => {
    const productLinks = page.locator('a[href*="/product/"]');
    expect(await productLinks.count()).toBeGreaterThan(0);
  });

  test("first product opens product details", async ({ page }) => {
    const firstProduct = page.locator('a[href*="/product/"]').first();

    await expect(firstProduct).toBeVisible();
    await firstProduct.click();

    await expect(page).toHaveURL(/\/product\//);
  });

  test("shop images load", async ({ page }) => {
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

    console.log("Broken images:", brokenImages);

    expect(brokenImages).toEqual([]);
  });

  test("shop has no console errors", async ({ page }) => {
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

  test("shop has no desktop horizontal overflow", async ({ page }) => {
    const size = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(size.scrollWidth).toBeLessThanOrEqual(size.clientWidth + 1);
  });

  test("shop works on 375px mobile", async ({ page }) => {
    await page.setViewportSize({
      width: 375,
      height: 812,
    });

    await page.goto("http://localhost:5173/shop");

    const size = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(size.scrollWidth).toBeLessThanOrEqual(size.clientWidth + 1);
  });
});