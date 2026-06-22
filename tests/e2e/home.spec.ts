import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("home happy path - scannable and navigable", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("hero-headline")).toBeVisible();
    await expect(page.getByTestId("hero-subhead")).toBeVisible();
    await expect(page.getByTestId("proof-rail")).toBeVisible();
    await expect(page.getByTestId("proof-rail")).toContainText(
      "better pre-merge detection"
    );
    await expect(page.getByTestId("primary-cta")).toBeVisible();
  });

  test("launch polish - proof appears before the interactive terminal", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const proofTop = await page.getByTestId("proof-rail").evaluate((el) =>
      el.getBoundingClientRect().top + window.scrollY
    );
    const terminalTop = await page.getByTestId("interactive-terminal").evaluate((el) =>
      el.getBoundingClientRect().top + window.scrollY
    );

    expect(proofTop).toBeLessThan(terminalTop);
  });

  test("home page has exactly one h1", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
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
