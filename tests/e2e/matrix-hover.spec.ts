import { test, expect } from "@playwright/test";

test.describe("Matrix card hover effects", () => {
  test("case study cards have matrix-card class", async ({ page }) => {
    await page.goto("/work");

    const cards = page.locator(".matrix-card");
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("card hover triggers glow effect", async ({ page }) => {
    await page.goto("/work");

    const card = page.locator(".matrix-card").first();
    await card.scrollIntoViewIfNeeded();

    const boxShadowBefore = await card.evaluate(
      (el) => getComputedStyle(el).boxShadow
    );

    await card.hover();
    await page.waitForTimeout(300);

    const boxShadowAfter = await card.evaluate(
      (el) => getComputedStyle(el).boxShadow
    );

    expect(boxShadowAfter).not.toBe(boxShadowBefore);
  });

  test("card has pseudo-elements for rain and glitch effects", async ({
    page,
  }) => {
    await page.goto("/work");

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
