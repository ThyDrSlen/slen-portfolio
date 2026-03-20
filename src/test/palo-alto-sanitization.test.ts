import { describe, it, expect } from "vitest";
import { caseStudies } from "@/content/case-studies";

describe("Palo Alto sanitization rules", () => {
  const paloAlto = caseStudies.find((cs) => cs.slug === "palo-alto")!;

  it("has anonymized disclosure level", () => {
    expect(paloAlto.disclosure.anonymizationLevel).toBe("anonymized");
  });

  it("requires a disclaimer", () => {
    expect(paloAlto.disclosure.requiresDisclaimer).toBe(true);
    expect(paloAlto.disclaimer).toBeTruthy();
    expect(paloAlto.disclaimer!.length).toBeGreaterThan(20);
  });

  it("forbids screenshots in allowed asset types", () => {
    expect(paloAlto.disclosure.allowedAssetTypes).not.toContain("screenshot");
  });

  it("has forbidden claims list", () => {
    expect(paloAlto.disclosure.forbiddenClaims.length).toBeGreaterThan(0);
  });

  it("forbidden claims include customer names and internal screenshots", () => {
    const forbidden = paloAlto.disclosure.forbiddenClaims.join(" ").toLowerCase();
    expect(forbidden).toContain("customer");
    expect(forbidden).toContain("screenshot");
  });

  it("content does not contain obvious forbidden terms", () => {
    const allText = [
      paloAlto.title,
      paloAlto.summary,
      paloAlto.problem,
      paloAlto.approach,
      paloAlto.reflection,
      ...paloAlto.outcomes,
    ].join(" ");

    // Should not contain specific internal product names or customer details
    // The company name "Palo Alto Networks" is allowed per disclosure
    expect(allText).not.toMatch(/\b(Cortex XDR|Prisma Cloud|Unit 42)\b/i);
    expect(allText).not.toMatch(/\$\d+[MBK]\b/); // No revenue figures
  });
});
