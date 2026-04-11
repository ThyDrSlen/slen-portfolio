import { describe, it, expect } from "vitest";
import {
  siteConfigSchema,
  caseStudySchema,
  validateSiteConfig,
  validateCaseStudies,
  validateCaseStudy,
} from "@/lib/content-schema";
import { siteConfig } from "@/content/site";
import {
  caseStudies,
  getCaseStudyBySlug,
  getFeaturedCaseStudies,
  getAllSlugs,
  getAdjacentCaseStudies,
} from "@/content/case-studies";

// ---------------------------------------------------------------------------
// Minimal valid case study fixture used across multiple tests
// ---------------------------------------------------------------------------
const validCaseStudy = {
  slug: "form-factor" as const,
  title: "Form Factor",
  summary: "A valid case study fixture for testing purposes.",
  role: "Solo Developer",
  period: "2025",
  techStack: ["TypeScript"],
  problem: "A meaningful problem statement for this fixture.",
  approach: "A meaningful approach description for this fixture.",
  outcomes: ["Shipped the thing"],
  reflection: "A meaningful reflection on the work done here.",
  proofLinks: [{ label: "Repo", url: "https://github.com/example/repo" }],
  disclosure: {
    anonymizationLevel: "none" as const,
    allowedClaims: ["solo build"],
    forbiddenClaims: [],
    allowedAssetTypes: ["diagram"],
    requiresDisclaimer: false,
    proofLinks: [],
  },
};

// ---------------------------------------------------------------------------
// Site config schema
// ---------------------------------------------------------------------------
describe("Site config schema", () => {
  it("validates the live site config without throwing", () => {
    expect(() => validateSiteConfig(siteConfig)).not.toThrow();
  });

  it("returns a parsed object with all required fields present", () => {
    const result = siteConfigSchema.safeParse(siteConfig);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBeTruthy();
      expect(result.data.email).toBeTruthy();
      expect(result.data.socialLinks.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("rejects a config with a missing email field", () => {
    const { email: _email, ...withoutEmail } = siteConfig as Record<
      string,
      unknown
    >;
    const result = siteConfigSchema.safeParse(withoutEmail);
    expect(result.success).toBe(false);
  });

  it("rejects a config with an invalid url", () => {
    const result = siteConfigSchema.safeParse({
      ...siteConfig,
      url: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a config with an invalid socialLink platform", () => {
    const result = siteConfigSchema.safeParse({
      ...siteConfig,
      socialLinks: [{ platform: "twitter", url: "https://twitter.com", label: "TW" }],
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Case study schema — valid objects
// ---------------------------------------------------------------------------
describe("Case study schema — valid objects", () => {
  it("accepts a minimal valid case study fixture", () => {
    const result = caseStudySchema.safeParse(validCaseStudy);
    expect(result.success).toBe(true);
  });

  it("validateCaseStudy returns the parsed object without throwing", () => {
    expect(() => validateCaseStudy(validCaseStudy)).not.toThrow();
    const parsed = validateCaseStudy(validCaseStudy);
    expect(parsed.slug).toBe("form-factor");
  });

  it("accepts a case study with optional constraints and disclaimer", () => {
    const result = caseStudySchema.safeParse({
      ...validCaseStudy,
      constraints: ["must work offline"],
      disclaimer: "This is a disclaimer.",
    });
    expect(result.success).toBe(true);
  });

  it("defaults featured to false when not supplied", () => {
    const { featured: _featured, ...withoutFeatured } = validCaseStudy as Record<
      string,
      unknown
    >;
    const result = caseStudySchema.safeParse(withoutFeatured);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.featured).toBe(false);
    }
  });
});

// ---------------------------------------------------------------------------
// Case study schema — invalid objects
// ---------------------------------------------------------------------------
describe("Case study schema — invalid objects", () => {
  it("rejects a case study with a missing title field", () => {
    const { title: _title, ...withoutTitle } = validCaseStudy as Record<
      string,
      unknown
    >;
    const result = caseStudySchema.safeParse(withoutTitle);
    expect(result.success).toBe(false);
  });

  it("rejects a case study with a missing slug field", () => {
    const { slug: _slug, ...withoutSlug } = validCaseStudy as Record<
      string,
      unknown
    >;
    const result = caseStudySchema.safeParse(withoutSlug);
    expect(result.success).toBe(false);
  });

  it("rejects an unrecognised slug value", () => {
    const result = caseStudySchema.safeParse({
      ...validCaseStudy,
      slug: "not-a-valid-slug",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a case study where title is a number instead of a string", () => {
    const result = caseStudySchema.safeParse({ ...validCaseStudy, title: 42 });
    expect(result.success).toBe(false);
  });

  it("rejects a case study where techStack is a string instead of an array", () => {
    const result = caseStudySchema.safeParse({
      ...validCaseStudy,
      techStack: "TypeScript",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a case study with an empty outcomes array", () => {
    const result = caseStudySchema.safeParse({
      ...validCaseStudy,
      outcomes: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a case study with an empty proofLinks array", () => {
    const result = caseStudySchema.safeParse({
      ...validCaseStudy,
      proofLinks: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a case study with a malformed proofLink url", () => {
    const result = caseStudySchema.safeParse({
      ...validCaseStudy,
      proofLinks: [{ label: "Bad", url: "not-a-url" }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a case study where disclosure.anonymizationLevel is invalid", () => {
    const result = caseStudySchema.safeParse({
      ...validCaseStudy,
      disclosure: {
        ...validCaseStudy.disclosure,
        anonymizationLevel: "full",
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects a case study where disclosure.requiresDisclaimer is not a boolean", () => {
    const result = caseStudySchema.safeParse({
      ...validCaseStudy,
      disclosure: {
        ...validCaseStudy.disclosure,
        requiresDisclaimer: "yes",
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects a case study where summary is shorter than 10 characters", () => {
    const result = caseStudySchema.safeParse({
      ...validCaseStudy,
      summary: "short",
    });
    expect(result.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Live case study data integrity
// ---------------------------------------------------------------------------
describe("Live case studies — data integrity", () => {
  it("validates all case studies without throwing", () => {
    expect(() => validateCaseStudies(caseStudies)).not.toThrow();
  });

  it("each individual case study satisfies the schema", () => {
    for (const cs of caseStudies) {
      const result = caseStudySchema.safeParse(cs);
      expect(result.success).toBe(
        true,
        `Case study "${cs.slug}" failed schema validation`
      );
    }
  });

  it("contains all four expected slugs", () => {
    const slugs = caseStudies.map((cs) => cs.slug);
    expect(slugs).toContain("form-factor");
    expect(slugs).toContain("orwell-scraper");
    expect(slugs).toContain("palo-alto");
    expect(slugs).toContain("portus");
  });

  it("slug uniqueness — no two case studies share a slug", () => {
    const slugs = caseStudies.map((cs) => cs.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it("every case study has a non-empty techStack", () => {
    for (const cs of caseStudies) {
      expect(cs.techStack.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("every case study has at least one outcome", () => {
    for (const cs of caseStudies) {
      expect(cs.outcomes.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("every case study has at least one proofLink", () => {
    for (const cs of caseStudies) {
      expect(cs.proofLinks.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("palo-alto has requiresDisclaimer:true and a non-empty disclaimer", () => {
    const paloAlto = caseStudies.find((cs) => cs.slug === "palo-alto");
    expect(paloAlto).toBeDefined();
    expect(paloAlto!.disclosure.requiresDisclaimer).toBe(true);
    expect(paloAlto!.disclaimer).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// getCaseStudyBySlug helper
// ---------------------------------------------------------------------------
describe("getCaseStudyBySlug", () => {
  it("returns the correct case study for a known slug", () => {
    const cs = getCaseStudyBySlug("form-factor");
    expect(cs).toBeDefined();
    expect(cs!.slug).toBe("form-factor");
    expect(cs!.title).toBe("Form Factor");
  });

  it("returns the orwell-scraper case study for that slug", () => {
    const cs = getCaseStudyBySlug("orwell-scraper");
    expect(cs).toBeDefined();
    expect(cs!.slug).toBe("orwell-scraper");
  });

  it("returns the palo-alto case study for that slug", () => {
    const cs = getCaseStudyBySlug("palo-alto");
    expect(cs).toBeDefined();
    expect(cs!.slug).toBe("palo-alto");
  });

  it("returns the portus case study for that slug", () => {
    const cs = getCaseStudyBySlug("portus");
    expect(cs).toBeDefined();
    expect(cs!.slug).toBe("portus");
  });

  it("returns undefined for a nonexistent slug", () => {
    const cs = getCaseStudyBySlug("nonexistent-slug");
    expect(cs).toBeUndefined();
  });

  it("returns undefined for an empty string slug", () => {
    const cs = getCaseStudyBySlug("");
    expect(cs).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// getFeaturedCaseStudies helper
// ---------------------------------------------------------------------------
describe("getFeaturedCaseStudies", () => {
  it("returns only case studies where featured is true", () => {
    const featured = getFeaturedCaseStudies();
    for (const cs of featured) {
      expect(cs.featured).toBe(true);
    }
  });

  it("returns at least one featured case study", () => {
    expect(getFeaturedCaseStudies().length).toBeGreaterThanOrEqual(1);
  });

  it("all four current case studies are featured", () => {
    expect(getFeaturedCaseStudies()).toHaveLength(4);
  });
});

// ---------------------------------------------------------------------------
// getAllSlugs helper
// ---------------------------------------------------------------------------
describe("getAllSlugs", () => {
  it("returns an array of strings", () => {
    const slugs = getAllSlugs();
    expect(Array.isArray(slugs)).toBe(true);
    for (const s of slugs) {
      expect(typeof s).toBe("string");
    }
  });

  it("returns one slug per case study", () => {
    expect(getAllSlugs()).toHaveLength(caseStudies.length);
  });

  it("contains all four known slugs", () => {
    const slugs = getAllSlugs();
    expect(slugs).toContain("form-factor");
    expect(slugs).toContain("orwell-scraper");
    expect(slugs).toContain("palo-alto");
    expect(slugs).toContain("portus");
  });
});

// ---------------------------------------------------------------------------
// getAdjacentCaseStudies helper
// ---------------------------------------------------------------------------
describe("getAdjacentCaseStudies", () => {
  it("first case study has no previous and has a next", () => {
    const firstSlug = caseStudies[0].slug;
    const { previous, next } = getAdjacentCaseStudies(firstSlug);
    expect(previous).toBeNull();
    expect(next).not.toBeNull();
    expect(next!.slug).toBe(caseStudies[1].slug);
  });

  it("last case study has a previous and no next", () => {
    const lastSlug = caseStudies[caseStudies.length - 1].slug;
    const { previous, next } = getAdjacentCaseStudies(lastSlug);
    expect(next).toBeNull();
    expect(previous).not.toBeNull();
    expect(previous!.slug).toBe(caseStudies[caseStudies.length - 2].slug);
  });

  it("middle case study has both a previous and a next", () => {
    const middleSlug = caseStudies[1].slug;
    const { previous, next } = getAdjacentCaseStudies(middleSlug);
    expect(previous).not.toBeNull();
    expect(next).not.toBeNull();
  });

  it("returns both null for an unknown slug", () => {
    const { previous, next } = getAdjacentCaseStudies("does-not-exist");
    expect(previous).toBeNull();
    expect(next).toBeNull();
  });
});
