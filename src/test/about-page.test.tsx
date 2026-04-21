import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

/* ------------------------------------------------------------------ */
/*  Mock next/image – render a plain <img> so we can assert attributes */
/* ------------------------------------------------------------------ */
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

import About from "@/app/about/page";
import {
  siteConfig,
  aboutContent,
  experienceEntries,
  lookingFor,
  skillCategories,
} from "@/content/site";

/* ================================================================== */
/*  About page                                                        */
/* ================================================================== */
describe("About page", () => {
  /* ── Rendering ────────────────────────────────────────────────── */

  it("renders without crashing", () => {
    render(<About />);
  });

  it("renders the page heading", () => {
    render(<About />);
    const heading = screen.getByTestId("about-page-title");
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("H1");
    expect(heading).toHaveTextContent("About");
  });

  /* ── Headshot image ──────────────────────────────────────────── */

  it("renders the headshot image with correct alt text", () => {
    render(<About />);
    const img = screen.getByAltText("Fabrizio Corrales");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/headshot.jpg");
  });

  /* ── Current role subtitle ───────────────────────────────────── */

  it("displays the current role and company", () => {
    render(<About />);
    const entry = experienceEntries[0];
    expect(
      screen.getByText(`${entry.role} @ ${entry.company}`)
    ).toBeInTheDocument();
  });

  /* ── Intro / bio text ────────────────────────────────────────── */

  it("renders every intro paragraph", () => {
    render(<About />);
    for (const para of aboutContent.introSections) {
      expect(screen.getByText(para)).toBeInTheDocument();
    }
  });

  /* ── "What I'm Looking For" section ──────────────────────────── */

  it("renders the 'What I'm Looking For' section", () => {
    render(<About />);
    expect(
      screen.getByRole("heading", { name: /what i.m looking for/i })
    ).toBeInTheDocument();
    expect(screen.getByText(lookingFor)).toBeInTheDocument();
  });

  /* ── Current Focus section ───────────────────────────────────── */

  it("renders the Current Focus section", () => {
    render(<About />);
    expect(
      screen.getByRole("heading", { name: /current focus/i })
    ).toBeInTheDocument();
    expect(screen.getByText(aboutContent.currentFocus)).toBeInTheDocument();
  });

  /* ── Tech Stack / Skills ─────────────────────────────────────── */

  describe("Tech Stack", () => {
    it("renders the Tech Stack heading", () => {
      render(<About />);
      expect(
        screen.getByRole("heading", { name: /tech stack/i })
      ).toBeInTheDocument();
    });

    it("renders every skill category label", () => {
      render(<About />);
      for (const cat of skillCategories) {
        expect(
          screen.getByRole("heading", { name: new RegExp(cat.label, "i") })
        ).toBeInTheDocument();
      }
    });

    it("renders every individual skill", () => {
      render(<About />);
      for (const cat of skillCategories) {
        for (const skill of cat.skills) {
          expect(screen.getByText(skill)).toBeInTheDocument();
        }
      }
    });
  });

  /* ── Journey / Timeline ──────────────────────────────────────── */

  describe("Journey timeline", () => {
    it("renders the Journey heading", () => {
      render(<About />);
      expect(
        screen.getByRole("heading", { name: /journey/i })
      ).toBeInTheDocument();
    });

    it("renders an entry for every experience", () => {
      render(<About />);
      const timeline = screen.getByTestId("journey-timeline");
      for (const entry of experienceEntries) {
        expect(
          within(timeline).getByText(entry.company)
        ).toBeInTheDocument();
        expect(within(timeline).getByText(entry.period)).toBeInTheDocument();
        expect(within(timeline).getByText(entry.role)).toBeInTheDocument();
        expect(
          within(timeline).getByText(entry.description)
        ).toBeInTheDocument();
      }
    });
  });

  /* ── Contact links ───────────────────────────────────────────── */

  describe("Get in Touch", () => {
    it("renders the section heading", () => {
      render(<About />);
      expect(
        screen.getByRole("heading", { name: /get in touch/i })
      ).toBeInTheDocument();
    });

    it("renders the email link with correct mailto href", () => {
      render(<About />);
      const emailLink = screen.getByTestId("contact-email-link");
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute(
        "href",
        `mailto:${siteConfig.email}`
      );
      expect(emailLink).toHaveTextContent("Email me");
    });

    it("renders the resume download link", () => {
      render(<About />);
      const resumeLink = screen.getByTestId("about-resume-download");
      expect(resumeLink).toBeInTheDocument();
      expect(resumeLink).toHaveAttribute("href", "/resume.pdf");
      expect(resumeLink).toHaveAttribute("target", "_blank");
      expect(resumeLink).toHaveAttribute("rel", "noopener noreferrer");
      expect(resumeLink).toHaveTextContent("Download Resume");
    });

    it("renders social links for every non-email platform", () => {
      render(<About />);
      const nonEmailLinks = siteConfig.socialLinks.filter(
        (l) => l.platform !== "email"
      );
      for (const link of nonEmailLinks) {
        const el = screen.getByTestId(`social-link-${link.platform}`);
        expect(el).toBeInTheDocument();
        expect(el).toHaveAttribute("href", link.url);
        expect(el).toHaveAttribute("target", "_blank");
        expect(el).toHaveAttribute("rel", "noopener noreferrer");
        expect(el).toHaveTextContent(link.label);
      }
    });

    it("does not render a social link for the email platform", () => {
      render(<About />);
      expect(
        screen.queryByTestId("social-link-email")
      ).not.toBeInTheDocument();
    });
  });

  /* ── JSON-LD structured data ─────────────────────────────────── */

  it("embeds Person JSON-LD structured data", () => {
    const { container } = render(<About />);
    const script = container.querySelector(
      'script[type="application/ld+json"]'
    );
    expect(script).not.toBeNull();
    const jsonLd = JSON.parse(script!.textContent!);
    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("Person");
    expect(jsonLd.name).toBe(siteConfig.name);
    expect(jsonLd.url).toBe(siteConfig.url);
    expect(jsonLd.jobTitle).toBe("Software Engineer");
    // sameAs should include non-email social links
    const expectedSameAs = siteConfig.socialLinks
      .filter((l) => l.platform !== "email")
      .map((l) => l.url);
    expect(jsonLd.sameAs).toEqual(expectedSameAs);
  });
});
