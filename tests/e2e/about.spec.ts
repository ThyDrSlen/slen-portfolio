import { test, expect } from "@playwright/test";

test.describe("About page", () => {
  test("about happy path - page delivers resume and trust links", async ({
    page,
  }) => {
    await page.goto("/about");
    await expect(page.getByTestId("about-page-title")).toBeVisible();
    await expect(page.getByTestId("journey-timeline")).toBeVisible();

    // Resume download
    const resumeLink = page.getByTestId("about-resume-download");
    await expect(resumeLink).toBeVisible();
    await expect(resumeLink).toHaveAttribute("href", "/resume.pdf");

    // Email CTA
    const emailLink = page.getByTestId("contact-email-link");
    await expect(emailLink).toBeVisible();
    const emailHref = await emailLink.getAttribute("href");
    expect(emailHref).toContain("mailto:");

    // Social links (scoped to main content to avoid footer duplicates)
    const main = page.locator("#main-content");
    await expect(main.getByTestId("social-link-github")).toBeVisible();
    await expect(main.getByTestId("social-link-linkedin")).toBeVisible();
  });

  test("resume asset - /resume.pdf is served", async ({ request }) => {
    const response = await request.get("/resume.pdf");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");
  });

  test("about page has no form elements", async ({ page }) => {
    await page.goto("/about");
    const forms = page.locator("form");
    await expect(forms).toHaveCount(0);
  });
});
