import { test, expect } from "@playwright/test";

test.describe("Metadata", () => {
  test("metadata happy path - public routes have correct metadata", async ({
    page,
  }) => {
    // Home
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const homeTitle = await page.title();
    expect(homeTitle).toContain("Fabrizio Corrales");

    const homeDesc = page.locator('meta[name="description"]');
    await expect(homeDesc).toHaveAttribute("content", /.+/);

    const homeCanonical = page.locator('link[rel="canonical"]');
    await expect(homeCanonical).toHaveAttribute(
      "href",
      "https://slen.win"
    );

    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute("content", /.+/);

    // JSON-LD
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd.first()).toBeAttached();

    // About
    await page.goto("/about");
    const aboutTitle = await page.title();
    expect(aboutTitle).toContain("About");

    // Resume
    await page.goto("/resume");
    const resumeTitle = await page.title();
    expect(resumeTitle).toContain("Resume");

    const resumeCanonical = page.locator('link[rel="canonical"]');
    await expect(resumeCanonical).toHaveAttribute(
      "href",
      "https://slen.win/resume"
    );

    // Case study
    await page.goto("/work/form-factor");
    const csTitle = await page.title();
    expect(csTitle).toContain("Form Factor");

    const csJsonLd = page.locator('script[type="application/ld+json"]');
    await expect(csJsonLd.first()).toBeAttached();
  });

  test("sitemap and unknown slug - sitemap contains public routes", async ({
    request,
  }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const body = await response.text();

    // Required routes
    expect(body).toContain("https://slen.win");
    expect(body).toContain("https://slen.win/work");
    expect(body).toContain("https://slen.win/about");
    expect(body).toContain("https://slen.win/resume");
    expect(body).toContain("https://slen.win/work/form-factor");
    expect(body).toContain("https://slen.win/work/orwell-scraper");
    expect(body).toContain("https://slen.win/work/palo-alto");

    // Should not contain non-existent routes
    expect(body).not.toContain("not-a-real-project");
    expect(body).not.toContain("/blog");
  });

  test("robots.txt points to sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("Sitemap:");
    expect(body).toContain("slen.win/sitemap.xml");
  });
});
