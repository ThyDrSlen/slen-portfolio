import { test, expect } from "@playwright/test";

test.describe("Palo Alto case study", () => {
  test("palo alto happy path - useful and clearly anonymized", async ({
    page,
  }) => {
    await page.goto("/work/palo-alto");
    await expect(page.getByTestId("case-study-page")).toBeVisible();
    await expect(page.getByTestId("case-study-hero")).toBeVisible();
    await expect(page.getByTestId("case-study-problem")).toBeVisible();
    await expect(page.getByTestId("case-study-role")).toBeVisible();
    await expect(page.getByTestId("case-study-system")).toBeVisible();
    await expect(page.getByTestId("case-study-outcomes")).toBeVisible();
    await expect(page.getByTestId("case-study-proof-links")).toBeVisible();

    // Has disclaimer
    await expect(page.getByTestId("case-study-disclaimer")).toBeVisible();

    // Has anonymized badge
    await expect(page.locator(".steel-badge")).toBeVisible();

    // Page text should not contain forbidden terms
    const bodyText = await page.textContent("body");
    expect(bodyText).not.toMatch(/Cortex XDR|Prisma Cloud|Unit 42/i);
  });
});
