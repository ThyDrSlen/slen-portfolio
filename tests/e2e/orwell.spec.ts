import { test, expect } from "@playwright/test";

test.describe("Orwell case study", () => {
  test("orwell happy path - proves technical depth without live demo", async ({
    page,
  }) => {
    await page.goto("/work/orwell-scraper");
    await expect(page.getByTestId("case-study-page")).toBeVisible();
    await expect(page.getByTestId("case-study-hero")).toBeVisible();
    await expect(page.getByTestId("case-study-system")).toBeVisible();
    await expect(page.getByTestId("case-study-outcomes")).toBeVisible();
    await expect(page.getByTestId("case-study-proof-links")).toBeVisible();

    // Has repo proof link
    const proofSection = page.getByTestId("case-study-proof-links");
    const links = proofSection.locator("a");
    await expect(links).not.toHaveCount(0);

    // Title is correct
    await expect(page.locator("h1")).toContainText("Orwell");
  });
});
