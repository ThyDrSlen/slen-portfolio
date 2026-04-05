import { describe, expect, it } from "vitest";
import {
  caseStudies,
  getAdjacentCaseStudies,
  getAllSlugs,
  getCaseStudyBySlug,
} from "@/content/case-studies";

describe("case study helpers", () => {
  it("getAllSlugs returns all case study slugs", () => {
    expect(getAllSlugs()).toEqual(caseStudies.map((study) => study.slug));
  });

  it("getCaseStudyBySlug returns correct study", () => {
    expect(getCaseStudyBySlug("form-factor")).toMatchObject({
      slug: "form-factor",
      title: "Form Factor",
    });
  });

  it("getCaseStudyBySlug returns undefined for unknown slug", () => {
    expect(getCaseStudyBySlug("nonexistent")).toBeUndefined();
  });

  it("getAdjacentCaseStudies returns null prev for first study", () => {
    const firstSlug = getAllSlugs()[0];

    expect(getAdjacentCaseStudies(firstSlug)).toMatchObject({ previous: null });
  });

  it("getAdjacentCaseStudies returns null next for last study", () => {
    const slugs = getAllSlugs();
    const lastSlug = slugs[slugs.length - 1];

    expect(getAdjacentCaseStudies(lastSlug)).toMatchObject({ next: null });
  });

  it("getAdjacentCaseStudies returns both for middle study", () => {
    const slugs = getAllSlugs();
    const middleSlug = slugs[1];
    const adjacent = getAdjacentCaseStudies(middleSlug);

    expect(adjacent.previous?.slug).toBe(slugs[0]);
    expect(adjacent.next?.slug).toBe(slugs[2]);
  });
});
