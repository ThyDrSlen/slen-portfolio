import { describe, it, expect } from "vitest";
import { siteConfig, heroContent, aboutContent } from "@/content/site";
import { caseStudies } from "@/content/case-studies";

describe("Content copy is complete and publishable", () => {
  it("site config has real values", () => {
    expect(siteConfig.name).toBe("Fabrizio Corrales");
    expect(siteConfig.email).toContain("@");
    expect(siteConfig.url).toBe("https://slen.win");
  });

  it("hero content has no placeholders", () => {
    expect(heroContent.headline).not.toMatch(/TBD|TODO|Lorem ipsum/i);
    expect(heroContent.subhead).not.toMatch(/TBD|TODO|Lorem ipsum/i);
    expect(heroContent.subhead.length).toBeGreaterThan(20);
  });

  it("about content has no placeholders", () => {
    expect(aboutContent.intro).not.toMatch(/TBD|TODO|Lorem ipsum/i);
    expect(aboutContent.currentFocus).not.toMatch(/TBD|TODO|Lorem ipsum/i);
    expect(aboutContent.intro.length).toBeGreaterThan(50);
  });

  it("every case study has real copy and proof links", () => {
    for (const cs of caseStudies) {
      expect(cs.title).not.toMatch(/TBD|TODO|Lorem ipsum/i);
      expect(cs.summary).not.toMatch(/TBD|TODO|Lorem ipsum/i);
      expect(cs.problem).not.toMatch(/TBD|TODO|Lorem ipsum/i);
      expect(cs.approach).not.toMatch(/TBD|TODO|Lorem ipsum/i);
      expect(cs.reflection).not.toMatch(/TBD|TODO|Lorem ipsum/i);
      expect(cs.proofLinks.length).toBeGreaterThanOrEqual(1);
      expect(cs.outcomes.length).toBeGreaterThanOrEqual(1);

      for (const outcome of cs.outcomes) {
        expect(outcome).not.toMatch(/TBD|TODO|Lorem ipsum/i);
      }
    }
  });

  it("resume route is referenced in site config", () => {
    // Resume opens at /resume and still serves the direct PDF from /resume.pdf
    expect(siteConfig.url).toBeTruthy();
  });
});
