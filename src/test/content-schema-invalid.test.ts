import { describe, it, expect } from "vitest";
import { caseStudySchema, siteConfigSchema } from "@/lib/content-schema";

describe("Schema rejects invalid data", () => {
  it("rejects case study missing slug", () => {
    const result = caseStudySchema.safeParse({
      title: "Test",
      summary: "A test case study for validation",
      role: "Dev",
      period: "2024",
      techStack: ["TS"],
      problem: "Some problem text here",
      approach: "Some approach text here",
      outcomes: ["outcome"],
      reflection: "Some reflection text here",
      proofLinks: [{ label: "Link", url: "https://example.com" }],
      disclosure: {
        anonymizationLevel: "none",
        allowedClaims: ["claim"],
        forbiddenClaims: [],
        allowedAssetTypes: [],
        requiresDisclaimer: false,
        proofLinks: [],
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects case study missing proofLinks", () => {
    const result = caseStudySchema.safeParse({
      slug: "form-factor",
      title: "Test",
      summary: "A test case study for validation",
      role: "Dev",
      period: "2024",
      techStack: ["TS"],
      problem: "Some problem text here",
      approach: "Some approach text here",
      outcomes: ["outcome"],
      reflection: "Some reflection text here",
      proofLinks: [],
      disclosure: {
        anonymizationLevel: "none",
        allowedClaims: ["claim"],
        forbiddenClaims: [],
        allowedAssetTypes: [],
        requiresDisclaimer: false,
        proofLinks: [],
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects case study missing outcomes", () => {
    const result = caseStudySchema.safeParse({
      slug: "form-factor",
      title: "Test",
      summary: "A test case study for validation",
      role: "Dev",
      period: "2024",
      techStack: ["TS"],
      problem: "Some problem text here",
      approach: "Some approach text here",
      outcomes: [],
      reflection: "Some reflection text here",
      proofLinks: [{ label: "Link", url: "https://example.com" }],
      disclosure: {
        anonymizationLevel: "none",
        allowedClaims: ["claim"],
        forbiddenClaims: [],
        allowedAssetTypes: [],
        requiresDisclaimer: false,
        proofLinks: [],
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects site config missing email", () => {
    const result = siteConfigSchema.safeParse({
      name: "Test",
      title: "Test",
      description: "A test description",
      url: "https://example.com",
      socialLinks: [
        { platform: "github", url: "https://github.com", label: "GH" },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid slug", () => {
    const result = caseStudySchema.safeParse({
      slug: "not-a-valid-slug",
      title: "Test",
      summary: "A test case study for validation",
      role: "Dev",
      period: "2024",
      techStack: ["TS"],
      problem: "Some problem text here",
      approach: "Some approach text here",
      outcomes: ["outcome"],
      reflection: "Some reflection text here",
      proofLinks: [{ label: "Link", url: "https://example.com" }],
      disclosure: {
        anonymizationLevel: "none",
        allowedClaims: ["claim"],
        forbiddenClaims: [],
        allowedAssetTypes: [],
        requiresDisclaimer: false,
        proofLinks: [],
      },
    });
    expect(result.success).toBe(false);
  });
});
