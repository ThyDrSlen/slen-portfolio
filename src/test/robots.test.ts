import { describe, it, expect } from "vitest";
import robots from "@/app/robots";
import { siteConfig } from "@/content/site";

describe("robots()", () => {
  it("returns an object with a rules property", () => {
    const result = robots();
    expect(result).toHaveProperty("rules");
  });

  it("rules.allow includes '/'", () => {
    const result = robots();
    const { rules } = result;
    const allow = Array.isArray(rules)
      ? rules.flatMap((r) => (Array.isArray(r.allow) ? r.allow : [r.allow]))
      : Array.isArray(rules.allow)
        ? rules.allow
        : [rules.allow];
    expect(allow).toContain("/");
  });

  it("sitemap property points to <siteUrl>/sitemap.xml", () => {
    const result = robots();
    const expected = `${siteConfig.url}/sitemap.xml`;
    const sitemaps = Array.isArray(result.sitemap)
      ? result.sitemap
      : [result.sitemap];
    expect(sitemaps).toContain(expected);
  });

  it("userAgent rule covers all agents", () => {
    const result = robots();
    const { rules } = result;
    const agents = Array.isArray(rules)
      ? rules.map((r) => r.userAgent)
      : [rules.userAgent];
    expect(agents).toContain("*");
  });
});
