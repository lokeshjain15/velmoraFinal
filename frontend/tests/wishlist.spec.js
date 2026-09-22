import { test, expect } from "@playwright/test";

test.describe("Velmora Wishlist QA", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/wishlist");
  });

  test("wishlist page loads", async ({ page }) => {
    await expect(page).toHaveURL(/\/wishlist/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("wishlist page has visible content", async ({ page }) => {
    const text = await page.locator("body").innerText();
    expect(text.trim().length).toBeGreaterThan(20);
  });

  test("wishlist page has navigation links", async ({ page }) => {
    const links = page.locator("a[href]");
    expect(await links.count()).toBeGreaterThan(0);
  });

  test("wishlist images are valid when present", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    const images = page.locator("img");
    const count = await images.count();
    const brokenImages = [];

    for (let i = 0; i < count; i++) {
      const image = images.nth(i);

      await image.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);

      const info = await image.evaluate((img) => ({
        src: img.currentSrc || img.src,
        complete: img.complete,
        width: img.naturalWidth,
      }));

      if (!info.complete || info.width === 0) {
        brokenImages.push(info);
      }
    }

    console.log("Broken wishlist images:", brokenImages);
    expect(brokenImages).toEqual([]);
  });

  test("wishlist has no console errors", async ({ page }) => {
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

  test("wishlist has no desktop horizontal overflow", async ({ page }) => {
    const size = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(size.scrollWidth).toBeLessThanOrEqual(size.clientWidth + 1);
  });

  test("wishlist works on 375px mobile", async ({ page }) => {
    await page.setViewportSize({
      width: 375,
      height: 812,
    });

    await page.goto("http://localhost:5173/wishlist");

    const size = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(size.scrollWidth).toBeLessThanOrEqual(size.clientWidth + 1);
  });

  test("wishlist route survives reload", async ({ page }) => {
    await page.reload();

    await expect(page).toHaveURL(/\/wishlist/);
    await expect(page.locator("body")).toBeVisible();
  });
});
