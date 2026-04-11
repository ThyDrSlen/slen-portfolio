/**
 * Comprehensive home-page tests.
 *
 * The home page (`src/app/page.tsx`) is a pure Server Component that renders
 * inline — no data-fetching boundaries here — but it imports two heavy
 * client components that we mock so the test suite stays fast and hermetic.
 *
 * Layout landmarks (Header, Footer, SkipLink, SubwayStatusBar, BootSequence)
 * live in `src/app/layout.tsx` and are NOT composed into `<Home />` itself.
 * They are tested in their own dedicated suites (site-shell.test.tsx and
 * shell-components.test.tsx).  This file focuses on the page body.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// ── Mocks ─────────────────────────────────────────────────────────────────────
// Mock heavy async / browser-only components before importing the page.

vi.mock("@/components/home/GitHubCommitPulse", () => ({
  GitHubCommitPulse: () => <div data-testid="github-commit-pulse">pulse</div>,
}));

vi.mock("@/components/home/InteractiveTerminal", () => ({
  InteractiveTerminal: () => (
    <div data-testid="interactive-terminal">terminal</div>
  ),
}));

vi.mock("@/components/TypingTest", () => ({
  TypingTest: () => <div data-testid="typing-test">typing</div>,
}));

// Reveal is an animation wrapper — render children immediately in tests.
vi.mock("@/components/motion/Reveal", () => ({
  Reveal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// CountUpMetric renders animated numbers — return the raw target value.
vi.mock("@/components/motion/CountUpMetric", () => ({
  CountUpMetric: ({
    target,
    suffix,
  }: {
    target: number;
    suffix?: string;
  }) => (
    <span>
      {target}
      {suffix}
    </span>
  ),
}));

// TypeOnReveal is a typewriter — render the text immediately.
vi.mock("@/components/motion/TypeOnReveal", () => ({
  TypeOnReveal: ({
    text,
    tag: Tag = "span",
  }: {
    text: string;
    tag?: React.ElementType;
  }) => <Tag>{text}</Tag>,
}));

// ── Subject under test ────────────────────────────────────────────────────────
import Home from "@/app/page";

// ── Test suite ────────────────────────────────────────────────────────────────

describe("Home page", () => {
  // ------------------------------------------------------------------
  // Basic render
  // ------------------------------------------------------------------

  it("renders without crashing", () => {
    const { container } = render(<Home />);
    expect(container).not.toBeEmptyDOMElement();
  });

  // ------------------------------------------------------------------
  // Headings
  // ------------------------------------------------------------------

  it("has an <h1> heading", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("has at least one <h2> heading", () => {
    render(<Home />);
    const h2s = screen.getAllByRole("heading", { level: 2 });
    expect(h2s.length).toBeGreaterThanOrEqual(1);
  });

  // ------------------------------------------------------------------
  // Hero / intro section
  // ------------------------------------------------------------------

  it("hero headline contains the owner's name", () => {
    render(<Home />);
    const headline = screen.getByTestId("hero-headline");
    expect(headline).toBeInTheDocument();
    // heroContent.headline is "Fabrizio Corrales"
    expect(headline.textContent).toMatch(/fabrizio/i);
  });

  it("hero subhead is present and non-empty", () => {
    render(<Home />);
    const subhead = screen.getByTestId("hero-subhead");
    expect(subhead).toBeInTheDocument();
    expect(subhead.textContent!.trim().length).toBeGreaterThan(0);
  });

  it("renders the job title text", () => {
    render(<Home />);
    expect(
      screen.getByText(/Software Engineer @ Palo Alto Networks/i)
    ).toBeInTheDocument();
  });

  it("renders the 'portfolio.init()' tagline", () => {
    render(<Home />);
    expect(screen.getByText(/portfolio\.init\(\)/i)).toBeInTheDocument();
  });

  // ------------------------------------------------------------------
  // Primary CTA / navigation links to /work
  // ------------------------------------------------------------------

  it("renders the primary CTA link pointing to /work (or #)", () => {
    render(<Home />);
    const cta = screen.getByTestId("primary-cta");
    expect(cta).toBeInTheDocument();
    // The href comes from heroContent.cta.href — should navigate somewhere
    expect(cta).toHaveAttribute("href");
  });

  it("has at least one link to the /work page", () => {
    render(<Home />);
    const workLinks = screen
      .getAllByRole("link")
      .filter((el) => el.getAttribute("href") === "/work");
    expect(workLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the '~/work' text link", () => {
    render(<Home />);
    expect(screen.getByText(/~\/work/i)).toBeInTheDocument();
  });

  // ------------------------------------------------------------------
  // LinkedIn / external links
  // ------------------------------------------------------------------

  it("renders a LinkedIn link", () => {
    render(<Home />);
    const linkedIn = screen
      .getAllByRole("link")
      .find((el) => /linkedin\.com/i.test(el.getAttribute("href") ?? ""));
    expect(linkedIn).toBeDefined();
  });

  it("LinkedIn link opens in a new tab with rel=noopener", () => {
    render(<Home />);
    const linkedIn = screen
      .getAllByRole("link")
      .find((el) => /linkedin\.com/i.test(el.getAttribute("href") ?? ""))!;
    expect(linkedIn).toHaveAttribute("target", "_blank");
    expect(linkedIn).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  // ------------------------------------------------------------------
  // Proof-rail / metrics section
  // ------------------------------------------------------------------

  it("renders the proof-rail metrics section", () => {
    render(<Home />);
    expect(screen.getByTestId("proof-rail")).toBeInTheDocument();
  });

  // ------------------------------------------------------------------
  // Tech-stack section
  // ------------------------------------------------------------------

  it("renders the Tech Stack heading", () => {
    render(<Home />);
    expect(screen.getByText(/tech stack/i)).toBeInTheDocument();
  });

  it("renders at least one <h3> skill-category heading", () => {
    render(<Home />);
    const h3s = screen.getAllByRole("heading", { level: 3 });
    expect(h3s.length).toBeGreaterThanOrEqual(1);
  });

  // ------------------------------------------------------------------
  // GitHub commit pulse (mocked)
  // ------------------------------------------------------------------

  it("renders the GitHub commit pulse widget (or its mock)", () => {
    render(<Home />);
    expect(screen.getByTestId("github-commit-pulse")).toBeInTheDocument();
  });

  // ------------------------------------------------------------------
  // Interactive terminal (mocked)
  // ------------------------------------------------------------------

  it("renders the interactive terminal (or its mock)", () => {
    render(<Home />);
    expect(screen.getByTestId("interactive-terminal")).toBeInTheDocument();
  });

  // ------------------------------------------------------------------
  // Typing test (mocked)
  // ------------------------------------------------------------------

  it("renders the typing test widget (or its mock)", () => {
    render(<Home />);
    expect(screen.getByTestId("typing-test")).toBeInTheDocument();
  });

  // ------------------------------------------------------------------
  // CTA / contact section
  // ------------------------------------------------------------------

  it("renders the 'Want to work together?' heading", () => {
    render(<Home />);
    expect(screen.getByText(/want to work together/i)).toBeInTheDocument();
  });

  it("renders the resume PDF link", () => {
    render(<Home />);
    const resumeLink = screen
      .getAllByRole("link")
      .find((el) => el.getAttribute("href") === "/resume.pdf");
    expect(resumeLink).toBeDefined();
  });

  it("renders a mailto link for contact", () => {
    render(<Home />);
    const mailLink = screen
      .getAllByRole("link")
      .find((el) => /^mailto:/i.test(el.getAttribute("href") ?? ""));
    expect(mailLink).toBeDefined();
  });

  // ------------------------------------------------------------------
  // JSON-LD structured data
  // ------------------------------------------------------------------

  it("injects a JSON-LD script tag", () => {
    const { container } = render(<Home />);
    const script = container.querySelector(
      'script[type="application/ld+json"]'
    );
    expect(script).not.toBeNull();
    const parsed = JSON.parse(script!.textContent ?? "{}");
    expect(parsed["@type"]).toBe("Person");
    expect(parsed.name).toMatch(/fabrizio/i);
  });

  // ------------------------------------------------------------------
  // Profile image
  // ------------------------------------------------------------------

  it("renders a profile headshot image", () => {
    render(<Home />);
    const img = screen.getByAltText(/fabrizio corrales/i);
    expect(img).toBeInTheDocument();
  });
});
