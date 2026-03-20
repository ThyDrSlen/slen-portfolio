import { test, expect } from "@playwright/test";

test.describe("Form Factor case study", () => {
  test("form factor happy path - tells a complete story", async ({
    page,
  }) => {
    await page.goto("/work/form-factor");
    await expect(page.getByTestId("case-study-page")).toBeVisible();
    await expect(page.getByTestId("case-study-hero")).toBeVisible();
    await expect(page.getByTestId("case-study-problem")).toBeVisible();
    await expect(page.getByTestId("case-study-role")).toBeVisible();
    await expect(page.getByTestId("case-study-system")).toBeVisible();
    await expect(page.getByTestId("case-study-outcomes")).toBeVisible();
    await expect(page.getByTestId("case-study-proof-links")).toBeVisible();

    // Has proof links
    const proofSection = page.getByTestId("case-study-proof-links");
    const links = proofSection.locator("a");
    await expect(links).not.toHaveCount(0);

    // Title is correct
    await expect(page.locator("h1")).toContainText("Form Factor");
  });
});
