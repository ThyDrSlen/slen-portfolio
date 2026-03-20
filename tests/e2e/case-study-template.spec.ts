import { test, expect } from "@playwright/test";

const knownSlugs = ["form-factor", "orwell-scraper", "palo-alto"];

test.describe("Case study template", () => {
  for (const slug of knownSlugs) {
    test(`known slugs - ${slug} renders all required sections`, async ({
      page,
    }) => {
      await page.goto(`/work/${slug}`);
      await expect(page.getByTestId("case-study-page")).toBeVisible();
      await expect(page.getByTestId("case-study-hero")).toBeVisible();
      await expect(page.getByTestId("case-study-problem")).toBeVisible();
      await expect(page.getByTestId("case-study-role")).toBeVisible();
      await expect(page.getByTestId("case-study-system")).toBeVisible();
      await expect(page.getByTestId("case-study-outcomes")).toBeVisible();
      await expect(page.getByTestId("case-study-proof-links")).toBeVisible();
      await expect(page.locator("h1")).toBeVisible();
    });
  }

  test("unknown slug - /work/not-a-real-project returns not-found", async ({
    page,
  }) => {
    const response = await page.goto("/work/not-a-real-project");
    expect(response?.status()).toBe(404);
  });
});
