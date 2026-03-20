import { describe, it, expect } from "vitest";
import { getCaseStudyBySlug } from "@/content/case-studies";

describe("Orwell proof links", () => {
  it("has at least one public proof link", () => {
    const cs = getCaseStudyBySlug("orwell-scraper");
    expect(cs).toBeDefined();
    expect(cs!.proofLinks.length).toBeGreaterThanOrEqual(1);
    expect(cs!.proofLinks[0].url).toContain("github.com");
  });

  it("does not require a live demo to render", () => {
    const cs = getCaseStudyBySlug("orwell-scraper");
    // The page renders with proof links only - no live demo URL required
    expect(cs!.proofLinks.every((l) => l.label && l.url)).toBe(true);
  });
});
