import { test, expect } from "@playwright/test";

test.describe("Matrix card hover effects", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/work", { waitUntil: "domcontentloaded" });
    await page
      .getByTestId("boot-sequence")
      .evaluate((overlay) => overlay.remove());
  });

  test("case study cards have matrix-card class", async ({ page }) => {
    const cards = page.locator(".matrix-card");
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("card hover triggers glow effect", async ({ page }) => {
    const card = page.locator(".matrix-card").first();
    await card.waitFor({ state: "visible", timeout: 5000 });
    await card.scrollIntoViewIfNeeded();

    await page.mouse.move(0, 0);
    await page.waitForTimeout(300);

    const boxShadowBefore = await card.evaluate(
      (el) => getComputedStyle(el).boxShadow
    );

    await card.hover();

    await expect
      .poll(
        () => card.evaluate((el) => getComputedStyle(el).boxShadow),
        { timeout: 3000 }
      )
      .not.toBe(boxShadowBefore);
  });

  test("card has pseudo-elements for rain and glitch effects", async ({
    page,
  }) => {
    const card = page.locator(".matrix-card").first();
    await card.hover();
    await page.waitForTimeout(200);

    const beforeContent = await card.evaluate((el) => {
      return getComputedStyle(el, "::before").content;
    });
    expect(beforeContent).toBe('""');

    const afterContent = await card.evaluate((el) => {
      return getComputedStyle(el, "::after").content;
    });
    expect(afterContent).toBe('""');
  });
});
