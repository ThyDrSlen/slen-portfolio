import { describe, it, expect } from "vitest";
import {
  siteConfigSchema,
  caseStudySchema,
  validateSiteConfig,
  validateCaseStudies,
} from "@/lib/content-schema";
import { siteConfig } from "@/content/site";
import { caseStudies } from "@/content/case-studies";

describe("Site config schema", () => {
  it("validates the site config", () => {
    expect(() => validateSiteConfig(siteConfig)).not.toThrow();
  });

  it("has required fields", () => {
    const result = siteConfigSchema.safeParse(siteConfig);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBeTruthy();
      expect(result.data.email).toBeTruthy();
      expect(result.data.socialLinks.length).toBeGreaterThanOrEqual(1);
    }
  });
});

describe("Case study schema", () => {
  it("validates all three case studies", () => {
    expect(() => validateCaseStudies(caseStudies)).not.toThrow();
  });

  it("has all three required slugs", () => {
    const slugs = caseStudies.map((cs) => cs.slug);
    expect(slugs).toContain("form-factor");
    expect(slugs).toContain("orwell-scraper");
    expect(slugs).toContain("palo-alto");
  });

  it("each case study has required fields", () => {
    for (const cs of caseStudies) {
      const result = caseStudySchema.safeParse(cs);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.slug).toBeTruthy();
        expect(result.data.title).toBeTruthy();
        expect(result.data.summary.length).toBeGreaterThanOrEqual(10);
        expect(result.data.role).toBeTruthy();
        expect(result.data.outcomes.length).toBeGreaterThanOrEqual(1);
        expect(result.data.proofLinks.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("palo alto has non-anonymized disclosure with confidentiality disclaimer", () => {
    const paloAlto = caseStudies.find((cs) => cs.slug === "palo-alto");
    expect(paloAlto).toBeDefined();
    expect(paloAlto!.disclosure.anonymizationLevel).toBe("none");
    expect(paloAlto!.disclosure.requiresDisclaimer).toBe(true);
    expect(paloAlto!.disclaimer).toBeTruthy();
  });
});
