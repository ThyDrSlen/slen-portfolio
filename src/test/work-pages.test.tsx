import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock next/navigation so notFound() does not throw
vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

// Mock next/link to a plain anchor so we can assert hrefs
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import WorkIndex from "@/app/work/page";
import CaseStudyPage from "@/app/work/[slug]/page";
import { getCaseStudyBySlug } from "@/content/case-studies";

// ---------------------------------------------------------------------------
// Work listing page
// ---------------------------------------------------------------------------
describe("Work listing page", () => {
  beforeEach(() => {
    render(<WorkIndex />);
  });

  it("renders without crashing", () => {
    expect(screen.getByTestId("work-page-title")).toBeInTheDocument();
  });

  it("has a page heading with text 'Work'", () => {
    expect(
      screen.getByRole("heading", { level: 1, name: /work/i })
    ).toBeInTheDocument();
  });

  it("shows at least one case study title", () => {
    // Every card has an h2 with the case-study title
    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings.length).toBeGreaterThanOrEqual(1);
  });

  it("renders a card for every case study in the data file", () => {
    // The grid is rendered with data-testid="work-grid"
    const grid = screen.getByTestId("work-grid");
    expect(grid).toBeInTheDocument();

    // Spot-check: portus card exists
    expect(screen.getByTestId("case-study-card-portus")).toBeInTheDocument();
  });

  it("shows links to individual case study pages", () => {
    const links = screen
      .getAllByRole("link")
      .filter((el) => el.getAttribute("href")?.startsWith("/work/"));
    expect(links.length).toBeGreaterThanOrEqual(1);

    // Each link should point to /work/<slug>
    links.forEach((link) => {
      expect(link.getAttribute("href")).toMatch(/^\/work\/.+/);
    });
  });

  it("shows form-factor card flagged as Flagship", () => {
    expect(screen.getByText("Flagship")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Case study detail page — portus (no disclaimer, has proof links)
// ---------------------------------------------------------------------------
describe("Case study detail page — portus", () => {
  let container: HTMLElement;

  beforeEach(async () => {
    // CaseStudyPage is an async server component; call it like a function
    const element = await CaseStudyPage({
      params: Promise.resolve({ slug: "portus" }),
    });
    const result = render(element as React.ReactElement);
    container = result.container;
  });

  it("renders without crashing", () => {
    expect(screen.getByTestId("case-study-page")).toBeInTheDocument();
  });

  it("renders the case study title in the hero h1", () => {
    const cs = getCaseStudyBySlug("portus")!;
    expect(
      screen.getByRole("heading", { level: 1, name: cs.title })
    ).toBeInTheDocument();
  });

  it("renders the summary text", () => {
    const cs = getCaseStudyBySlug("portus")!;
    expect(screen.getByText(cs.summary)).toBeInTheDocument();
  });

  it("shows tech stack items", () => {
    const cs = getCaseStudyBySlug("portus")!;
    for (const tech of cs.techStack) {
      expect(screen.getAllByText(tech).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("shows outcomes section with all outcome items", () => {
    const cs = getCaseStudyBySlug("portus")!;
    expect(screen.getByTestId("case-study-outcomes")).toBeInTheDocument();
    for (const outcome of cs.outcomes) {
      expect(screen.getByText(outcome)).toBeInTheDocument();
    }
  });

  it("proof links section is present", () => {
    expect(
      screen.getByTestId("case-study-proof-links")
    ).toBeInTheDocument();
  });

  it("renders proof links as external anchors", () => {
    const cs = getCaseStudyBySlug("portus")!;
    for (const link of cs.proofLinks) {
      const anchor = screen.getByText(new RegExp(link.label));
      expect(anchor).toBeInTheDocument();
    }
  });

  it("does NOT render a disclaimer section (portus has no disclaimer)", () => {
    expect(
      screen.queryByTestId("case-study-disclaimer")
    ).not.toBeInTheDocument();
  });

  it("breadcrumb navigation is present", () => {
    expect(
      screen.getByTestId("case-study-breadcrumbs")
    ).toBeInTheDocument();
  });

  it("'All work' back-link points to /work", () => {
    const backLink = screen.getByTestId("case-study-back-link");
    expect(backLink).toHaveAttribute("href", "/work");
  });
});

// ---------------------------------------------------------------------------
// Case study detail page — palo-alto (has disclaimer)
// ---------------------------------------------------------------------------
describe("Case study detail page — palo-alto disclaimer", () => {
  it("renders the disclaimer section when requiresDisclaimer is true", async () => {
    const element = await CaseStudyPage({
      params: Promise.resolve({ slug: "palo-alto" }),
    });
    render(element as React.ReactElement);
    expect(
      screen.getByTestId("case-study-disclaimer")
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// generateMetadata helper
// ---------------------------------------------------------------------------
import { generateMetadata } from "@/app/work/[slug]/page";

describe("generateMetadata", () => {
  it("returns title and description for a known slug", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "portus" }),
    });
    expect(meta.title).toBe("Portus");
    expect(meta.description).toContain("Rust daemon");
  });

  it("returns an empty object for an unknown slug", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "does-not-exist" }),
    });
    expect(meta).toEqual({});
  });
});
