import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Cross-page accessibility", () => {
  test("about page passes accessibility checks", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByTestId("about-page-title")).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("work index passes accessibility checks", async ({ page }) => {
    await page.goto("/work");
    await expect(page.getByTestId("work-page-title")).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("case study page passes accessibility checks", async ({ page }) => {
    await page.goto("/work/form-factor");
    await page.locator("h1").waitFor({ state: "visible" });

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
