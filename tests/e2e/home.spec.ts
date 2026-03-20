import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("home happy path - scannable and navigable", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("hero-headline")).toBeVisible();
    await expect(page.getByTestId("hero-subhead")).toBeVisible();
    await expect(page.getByTestId("proof-rail")).toBeVisible();
    await expect(page.getByTestId("primary-cta")).toBeVisible();

    // All three case study cards
    await expect(
      page.getByTestId("case-study-card-form-factor")
    ).toBeVisible();
    await expect(
      page.getByTestId("case-study-card-orwell-scraper")
    ).toBeVisible();
    await expect(
      page.getByTestId("case-study-card-palo-alto")
    ).toBeVisible();

    // Cards link to correct routes
    const ffCard = page.getByTestId("case-study-card-form-factor");
    await expect(ffCard).toHaveAttribute("href", "/work/form-factor");

    const owCard = page.getByTestId("case-study-card-orwell-scraper");
    await expect(owCard).toHaveAttribute("href", "/work/orwell-scraper");

    const paCard = page.getByTestId("case-study-card-palo-alto");
    await expect(paCard).toHaveAttribute("href", "/work/palo-alto");
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
    await expect(
      page.getByTestId("case-study-card-form-factor")
    ).toBeVisible();
    await expect(page.getByTestId("primary-cta")).toBeVisible();
  });
});
