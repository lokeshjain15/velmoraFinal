import { test, expect } from "@playwright/test";


test.describe("Velmora Navbar QA", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/");
  });

  test("homepage loads without console errors", async ({ page }) => {
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

  test("VELMORA logo navigates home", async ({ page }) => {
    const logo = page.getByText("VELMORA", { exact: true }).first();

    await expect(logo).toBeVisible();
    await logo.click();

    await expect(page).toHaveURL("http://localhost:5173/");
  });

  test("Shop route works", async ({ page }) => {
    const shop = page.getByRole("link", { name: "Shop", exact: true }).first();

    await expect(shop).toBeVisible();
    await shop.click();

    await expect(page).toHaveURL(/\/shop/);
  });

  test("Collections route works", async ({ page }) => {
    const collections = page
      .getByRole("link", { name: "Collections", exact: true })
      .first();

    await expect(collections).toBeVisible();
    await collections.click();

    await expect(page).toHaveURL(/\/collections/);
  });

  test("Wishlist page loads", async ({ page }) => {
    await page.goto("http://localhost:5173/wishlist");

    await expect(page).toHaveURL(/\/wishlist/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("Cart page loads", async ({ page }) => {
    await page.goto("http://localhost:5173/cart");

    await expect(page).toHaveURL(/\/cart/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("mobile navbar does not overflow horizontally", async ({ page }) => {
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
  });

  test("mobile page renders", async ({ page }) => {
    await page.setViewportSize({
      width: 375,
      height: 812,
    });

    await page.goto("http://localhost:5173/");

    await expect(page.locator("body")).toBeVisible();
    await expect(
      page.getByText("VELMORA", { exact: true }).first()
    ).toBeVisible();
  });
});