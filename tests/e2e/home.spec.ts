import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("home happy path - scannable and navigable", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("hero-headline")).toBeVisible();
    await expect(page.getByTestId("hero-subhead")).toBeVisible();
    await expect(page.getByTestId("proof-rail")).toBeVisible();
    await expect(page.getByTestId("proof-rail")).toContainText(
      "20% better pre-merge detection"
    );
    await expect(page.getByTestId("primary-cta")).toBeVisible();
  });

  test("home page has exactly one h1", async ({ page }) => {
    await page.goto("/");
    const headings = page.locator("h1");
    await expect(headings).toHaveCount(1);
  });

  test("no js - home page works without JavaScript", async ({ page }) => {
    await page.route("**/*.js", (route) => route.abort());
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByTestId("proof-rail")).toBeVisible();
    await expect(page.getByTestId("primary-cta")).toBeVisible();
  });
});
