import { describe, it, expect } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { siteConfig } from "@/content/site";
import { getAllSlugs } from "@/content/case-studies";

describe("robots()", () => {
  it("returns a wildcard allow-all rule", () => {
    const result = robots();
    expect(result.rules).toMatchObject({
      userAgent: "*",
      allow: "/",
    });
  });

  it("sitemap URL points to siteConfig.url", () => {
    const result = robots();
    expect(result.sitemap).toBe(`${siteConfig.url}/sitemap.xml`);
  });

  it("sitemap URL contains no hardcoded host", () => {
    const result = robots();
    // The sitemap URL must start with the configured base, not a literal hostname
    expect(result.sitemap).toMatch(new RegExp(`^${siteConfig.url}`));
  });
});

describe("sitemap()", () => {
  it("includes an entry for the root path with priority 1.0", () => {
    const entries = sitemap();
    const root = entries.find((e) => e.url === siteConfig.url);
    expect(root).toBeDefined();
    expect(root!.priority).toBe(1.0);
  });

  it("includes an entry for /work with priority 0.8", () => {
    const entries = sitemap();
    const work = entries.find((e) => e.url === `${siteConfig.url}/work`);
    expect(work).toBeDefined();
    expect(work!.priority).toBe(0.8);
  });

  it("includes an entry for /about with priority 0.7", () => {
    const entries = sitemap();
    const about = entries.find((e) => e.url === `${siteConfig.url}/about`);
    expect(about).toBeDefined();
    expect(about!.priority).toBe(0.7);
  });

  it("includes all case study slugs from getAllSlugs()", () => {
    const entries = sitemap();
    const slugs = getAllSlugs();
    for (const slug of slugs) {
      const entry = entries.find(
        (e) => e.url === `${siteConfig.url}/work/${slug}`
      );
      expect(entry).toBeDefined();
    }
  });

  it("case study entries have priority 0.6", () => {
    const entries = sitemap();
    const slugs = getAllSlugs();
    for (const slug of slugs) {
      const entry = entries.find(
        (e) => e.url === `${siteConfig.url}/work/${slug}`
      );
      expect(entry!.priority).toBe(0.6);
    }
  });

  it("all URLs use siteConfig.url as base — no hardcoded hosts", () => {
    const entries = sitemap();
    for (const entry of entries) {
      expect(entry.url).toMatch(new RegExp(`^${siteConfig.url}`));
    }
  });

  it("returns the correct total count (3 static + all case studies)", () => {
    const entries = sitemap();
    const slugs = getAllSlugs();
    expect(entries).toHaveLength(3 + slugs.length);
  });

  it("all entries have a lastModified date", () => {
    const entries = sitemap();
    for (const entry of entries) {
      expect(entry.lastModified).toBeInstanceOf(Date);
    }
  });
});
