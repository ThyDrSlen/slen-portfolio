import { describe, it, expect } from "vitest";
import { getCaseStudyBySlug } from "@/content/case-studies";

describe("Palo Alto asset restrictions", () => {
  const cs = getCaseStudyBySlug("palo-alto")!;

  it("does not allow screenshots in asset types", () => {
    expect(cs.disclosure.allowedAssetTypes).not.toContain("screenshot");
  });

  it("has no media assets with screenshot type", () => {
    if (cs.media) {
      const screenshots = cs.media.filter((m) => m.type === "screenshot");
      expect(screenshots).toHaveLength(0);
    }
  });

  it("forbidden claims block customer names and internal screenshots", () => {
    const forbidden = cs.disclosure.forbiddenClaims.join(" ").toLowerCase();
    expect(forbidden).toContain("customer");
    expect(forbidden).toContain("screenshot");
  });
});
