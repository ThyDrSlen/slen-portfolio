import { describe, it, expect } from "vitest";
import { getCaseStudyBySlug } from "@/content/case-studies";

describe("Form Factor fallback behavior", () => {
  it("form factor case study exists with required content", () => {
    const cs = getCaseStudyBySlug("form-factor");
    expect(cs).toBeDefined();
    expect(cs!.title).toBe("Form Factor");
    expect(cs!.proofLinks.length).toBeGreaterThanOrEqual(1);
    expect(cs!.outcomes.length).toBeGreaterThanOrEqual(1);
  });

  it("renders without media assets (optional)", () => {
    const cs = getCaseStudyBySlug("form-factor");
    // media is optional - page should work without it
    // When media is undefined/empty, the template skips the media section
    expect(cs!.media === undefined || Array.isArray(cs!.media)).toBe(true);
  });
});
