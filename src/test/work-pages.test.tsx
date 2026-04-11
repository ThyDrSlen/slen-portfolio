import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { caseStudies, getCaseStudyBySlug } from "@/content/case-studies";

// Mock next/link to render a plain anchor
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock next/navigation
const mockNotFound = vi.fn();
vi.mock("next/navigation", () => ({
  notFound: () => {
    mockNotFound();
    throw new Error("NEXT_NOT_FOUND");
  },
}));

import WorkIndex from "@/app/work/page";
import CaseStudyPage from "@/app/work/[slug]/page";

// ---------- Work listing page (/work) ----------

describe("Work listing page", () => {
  it("renders without crashing", () => {
    render(<WorkIndex />);
    expect(screen.getByTestId("work-page-title")).toBeInTheDocument();
  });

  it("has a page heading", () => {
    render(<WorkIndex />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Work");
  });

  it("shows at least one case study title", () => {
    render(<WorkIndex />);
    const firstTitle = caseStudies[0].title;
    expect(screen.getByText(firstTitle)).toBeInTheDocument();
  });

  it("renders a card for every case study", () => {
    render(<WorkIndex />);
    for (const cs of caseStudies) {
      expect(
        screen.getByTestId(`case-study-card-${cs.slug}`)
      ).toBeInTheDocument();
    }
  });

  it("shows links to individual case studies", () => {
    render(<WorkIndex />);
    for (const cs of caseStudies) {
      const card = screen.getByTestId(`case-study-card-${cs.slug}`);
      expect(card).toHaveAttribute("href", `/work/${cs.slug}`);
    }
  });

  it("displays tech stack tags for each case study", () => {
    render(<WorkIndex />);
    const grid = screen.getByTestId("work-grid");
    for (const cs of caseStudies) {
      for (const tech of cs.techStack) {
        expect(within(grid).getAllByText(tech).length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("displays the summary for each case study", () => {
    render(<WorkIndex />);
    for (const cs of caseStudies) {
      expect(screen.getByText(cs.summary)).toBeInTheDocument();
    }
  });

  it("shows an anonymized badge only for anonymized case studies", () => {
    render(<WorkIndex />);
    const anonymizedStudies = caseStudies.filter(
      (cs) => cs.disclosure.anonymizationLevel === "anonymized"
    );
    const badges = screen.queryAllByText("Anonymized");
    expect(badges.length).toBe(anonymizedStudies.length);
  });
});

// ---------- Case study detail page (/work/[slug]) ----------

async function renderCaseStudy(slug: string) {
  const params = Promise.resolve({ slug });
  const jsx = await CaseStudyPage({ params });
  return render(jsx);
}

describe("Case study detail page (portus)", () => {
  const slug = "portus";
  const cs = getCaseStudyBySlug(slug)!;

  it("renders the title", async () => {
    await renderCaseStudy(slug);
    expect(
      screen.getByRole("heading", { level: 1, name: cs.title })
    ).toBeInTheDocument();
  });

  it("renders the summary text", async () => {
    await renderCaseStudy(slug);
    expect(screen.getByText(cs.summary)).toBeInTheDocument();
  });

  it("shows tech stack items", async () => {
    await renderCaseStudy(slug);
    const hero = screen.getByTestId("case-study-hero");
    for (const tech of cs.techStack) {
      expect(within(hero).getByText(tech)).toBeInTheDocument();
    }
  });

  it("shows outcomes section with all outcomes", async () => {
    await renderCaseStudy(slug);
    const outcomes = screen.getByTestId("case-study-outcomes");
    expect(outcomes).toBeInTheDocument();
    for (const outcome of cs.outcomes) {
      expect(within(outcomes).getByText(outcome)).toBeInTheDocument();
    }
  });

  it("has a proof links section", async () => {
    await renderCaseStudy(slug);
    const proofSection = screen.getByTestId("case-study-proof-links");
    expect(proofSection).toBeInTheDocument();
    for (const link of cs.proofLinks) {
      const anchor = within(proofSection).getByText(
        new RegExp(link.label)
      );
      expect(anchor.closest("a")).toHaveAttribute("href", link.url);
    }
  });

  it("renders breadcrumb navigation", async () => {
    await renderCaseStudy(slug);
    const breadcrumbs = screen.getByTestId("case-study-breadcrumbs");
    expect(breadcrumbs).toBeInTheDocument();
    expect(within(breadcrumbs).getByText("home")).toBeInTheDocument();
    expect(within(breadcrumbs).getByText("work")).toBeInTheDocument();
    expect(within(breadcrumbs).getByText(cs.title)).toBeInTheDocument();
  });

  it("renders problem and approach sections", async () => {
    await renderCaseStudy(slug);
    expect(screen.getByTestId("case-study-problem")).toBeInTheDocument();
    expect(screen.getByTestId("case-study-system")).toBeInTheDocument();
  });

  it("renders a back link to the work listing", async () => {
    await renderCaseStudy(slug);
    const backLink = screen.getByTestId("case-study-back-link");
    expect(backLink).toHaveAttribute("href", "/work");
  });

  it("includes JSON-LD structured data", async () => {
    const { container } = await renderCaseStudy(slug);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const jsonLd = JSON.parse(script!.textContent!);
    expect(jsonLd.name).toBe(cs.title);
    expect(jsonLd.description).toBe(cs.summary);
  });
});

describe("Case study detail page (palo-alto with disclaimer)", () => {
  const slug = "palo-alto";
  const cs = getCaseStudyBySlug(slug)!;

  it("shows the disclaimer section when requiresDisclaimer is true", async () => {
    await renderCaseStudy(slug);
    const disclaimer = screen.getByTestId("case-study-disclaimer");
    expect(disclaimer).toBeInTheDocument();
    expect(within(disclaimer).getByText(cs.disclaimer!)).toBeInTheDocument();
  });

  it("shows constraints list when present", async () => {
    await renderCaseStudy(slug);
    const roleSection = screen.getByTestId("case-study-role");
    expect(roleSection).toBeInTheDocument();
    const constraints = screen.getByTestId("case-study-constraints");
    for (const constraint of cs.constraints!) {
      expect(within(constraints).getByText(constraint)).toBeInTheDocument();
    }
  });
});

describe("Case study detail page — pagination", () => {
  it("shows next link for the first case study", async () => {
    const firstSlug = caseStudies[0].slug;
    await renderCaseStudy(firstSlug);
    const pagination = screen.getByTestId("case-study-pagination");
    expect(
      within(pagination).getByTestId("case-study-next-link")
    ).toBeInTheDocument();
  });

  it("shows previous link for the last case study", async () => {
    const lastSlug = caseStudies[caseStudies.length - 1].slug;
    await renderCaseStudy(lastSlug);
    const pagination = screen.getByTestId("case-study-pagination");
    expect(
      within(pagination).getByTestId("case-study-prev-link")
    ).toBeInTheDocument();
  });
});

describe("Case study detail page — not found", () => {
  it("calls notFound for an invalid slug", async () => {
    mockNotFound.mockClear();
    await expect(renderCaseStudy("nonexistent-slug")).rejects.toThrow(
      "NEXT_NOT_FOUND"
    );
    expect(mockNotFound).toHaveBeenCalled();
  });
});
