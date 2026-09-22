import { test, expect } from "@playwright/test";

test.describe("Velmora Home Page QA", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/");
  });

  test("home page loads correctly", async ({ page }) => {
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByText("VELMORA", { exact: true }).first()).toBeVisible();
  });

  test("home page has no console errors", async ({ page }) => {
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

  test("hero heading is visible", async ({ page }) => {
    const heading = page.locator("h1").first();

    await expect(heading).toBeVisible();
    await expect(heading).not.toHaveText("");
  });

  test("home contains working links", async ({ page }) => {
    const links = page.locator("a[href]");

    expect(await links.count()).toBeGreaterThan(0);
  });

  test("home images load successfully", async ({ page }) => {
    const images = page.locator("img");
    const count = await images.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const image = images.nth(i);

      await expect(image).toBeVisible();

      const loaded = await image.evaluate(
        (img) => img.complete && img.naturalWidth > 0
      );

      expect(loaded).toBeTruthy();
    }
  });

  test("shop navigation from home works", async ({ page }) => {
    const shopLink = page
      .getByRole("link", { name: /shop/i })
      .first();

    await expect(shopLink).toBeVisible();
    await shopLink.click();

    await expect(page).toHaveURL(/\/shop/);
  });

  test("home has no horizontal overflow on desktop", async ({ page }) => {
    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(
      dimensions.clientWidth + 1
    );
  });

  test("home works on 375px mobile", async ({ page }) => {
    await page.setViewportSize({
      width: 375,
      height: 812,
    });

    await page.goto("http://localhost:5173/");

    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(
      dimensions.clientWidth + 1
    );

    await expect(page.locator("h1").first()).toBeVisible();
  });
});