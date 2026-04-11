import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import { siteConfig } from "@/content/site";
import { getAllSlugs } from "@/content/case-studies";

describe("sitemap()", () => {
  it("returns an array", () => {
    const result = sitemap();
    expect(Array.isArray(result)).toBe(true);
  });

  it("array is non-empty", () => {
    const result = sitemap();
    expect(result.length).toBeGreaterThan(0);
  });

  it("every entry has a url string", () => {
    const result = sitemap();
    for (const entry of result) {
      expect(typeof entry.url).toBe("string");
      expect(entry.url.length).toBeGreaterThan(0);
    }
  });

  it("every entry has a lastModified Date", () => {
    const result = sitemap();
    for (const entry of result) {
      expect(entry.lastModified).toBeInstanceOf(Date);
    }
  });

  it("includes the home page URL", () => {
    const result = sitemap();
    const urls = result.map((e) => e.url);
    expect(urls).toContain(siteConfig.url);
  });

  it("includes the /work page URL", () => {
    const result = sitemap();
    const urls = result.map((e) => e.url);
    expect(urls).toContain(`${siteConfig.url}/work`);
  });

  it("includes the /about page URL", () => {
    const result = sitemap();
    const urls = result.map((e) => e.url);
    expect(urls).toContain(`${siteConfig.url}/about`);
  });

  it("includes a URL for every case study slug", () => {
    const result = sitemap();
    const urls = result.map((e) => e.url);
    const slugs = getAllSlugs();
    for (const slug of slugs) {
      expect(urls).toContain(`${siteConfig.url}/work/${slug}`);
    }
  });

  it("case study slugs include form-factor, orwell-scraper, palo-alto, portus", () => {
    const result = sitemap();
    const urls = result.map((e) => e.url);
    const expectedSlugs = ["form-factor", "orwell-scraper", "palo-alto", "portus"];
    for (const slug of expectedSlugs) {
      expect(urls).toContain(`${siteConfig.url}/work/${slug}`);
    }
  });
});
