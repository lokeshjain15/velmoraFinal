import { test, expect } from "@playwright/test";

test.describe("Velmora Checkout QA", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/checkout");
  });

  test("checkout page loads", async ({ page }) => {
    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("checkout contains form fields", async ({ page }) => {
    const fields = page.locator("input, textarea, select");
    expect(await fields.count()).toBeGreaterThan(0);
  });

  test("checkout has submit or payment button", async ({ page }) => {
    const buttons = page.locator("button");
    expect(await buttons.count()).toBeGreaterThan(0);
  });

  test("empty checkout submission does not crash page", async ({ page }) => {
    const submitButton = page
      .locator('button[type="submit"], input[type="submit"]')
      .first();

    if (await submitButton.count()) {
      await submitButton.click();
      await page.waitForTimeout(500);
    }

    await expect(page.locator("body")).toBeVisible();
  });

  test("checkout email field rejects invalid email when present", async ({ page }) => {
    const email = page.locator('input[type="email"]').first();

    if (await email.count()) {
      await email.fill("invalid-email");

      const valid = await email.evaluate((input) =>
        input.checkValidity()
      );

      expect(valid).toBeFalsy();
    }
  });

  test("checkout has no console errors on initial load", async ({ page }) => {
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

  test("checkout has no desktop horizontal overflow", async ({ page }) => {
    const size = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(size.scrollWidth).toBeLessThanOrEqual(size.clientWidth + 1);
  });

  test("checkout works on 375px mobile", async ({ page }) => {
    await page.setViewportSize({
      width: 375,
      height: 812,
    });

    await page.goto("http://localhost:5173/checkout");

    const size = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(size.scrollWidth).toBeLessThanOrEqual(size.clientWidth + 1);
  });
});