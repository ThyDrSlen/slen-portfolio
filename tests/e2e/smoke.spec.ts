import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Smoke tests", () => {
  test("home page loads and has heading", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toBeVisible();
  });

  test("home page passes basic accessibility checks", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("404 - unknown route returns not-found", async ({ page }) => {
    const response = await page.goto("/not-a-real-route");
    expect(response?.status()).toBe(404);
  });
});
