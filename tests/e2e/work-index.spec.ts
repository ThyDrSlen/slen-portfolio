import { test, expect } from "@playwright/test";

test.describe("Work index", () => {
  test("work navigation - all cards link to case studies", async ({
    page,
  }) => {
    await page.goto("/work");
    await expect(page.getByTestId("work-page-title")).toBeVisible();
    await expect(page.getByTestId("work-grid")).toBeVisible();

    // All three cards present
    const ffCard = page.getByTestId("case-study-card-form-factor");
    const owCard = page.getByTestId("case-study-card-orwell-scraper");
    const paCard = page.getByTestId("case-study-card-palo-alto");

    await expect(ffCard).toBeVisible();
    await expect(owCard).toBeVisible();
    await expect(paCard).toBeVisible();

    // Links resolve correctly
    await expect(ffCard).toHaveAttribute("href", "/work/form-factor");
    await expect(owCard).toHaveAttribute("href", "/work/orwell-scraper");
    await expect(paCard).toHaveAttribute("href", "/work/palo-alto");
  });

  test("mobile - work index is usable at 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/work");
    await expect(page.getByTestId("work-page-title")).toBeVisible();

    // Cards should be visible and not overflow
    const cards = page.getByTestId("work-grid");
    await expect(cards).toBeVisible();

    const box = await cards.boundingBox();
    expect(box!.width).toBeLessThanOrEqual(390);
  });
});
