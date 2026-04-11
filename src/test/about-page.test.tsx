import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

// Mock next/image to a plain <img> so jsdom doesn't choke on the Image component
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    ...rest
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => <img src={src} alt={alt} {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)} />,
}));

import About from "@/app/about/page";
import {
  siteConfig,
  aboutContent,
  skillCategories,
} from "@/content/site";

describe("About page", () => {
  beforeEach(() => {
    render(<About />);
  });

  // --------------------------------------------------------------------------
  // Basic render
  // --------------------------------------------------------------------------
  it("renders without crashing", () => {
    expect(screen.getByTestId("about-page-title")).toBeInTheDocument();
  });

  it("shows an 'About' h1 heading", () => {
    expect(
      screen.getByRole("heading", { level: 1, name: /about/i })
    ).toBeInTheDocument();
  });

  it("shows the developer's name in the headshot alt text", () => {
    const img = screen.getByAltText(/fabrizio corrales/i);
    expect(img).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // Bio / description text
  // --------------------------------------------------------------------------
  it("renders intro/bio paragraph text from site content", () => {
    // Each introSection paragraph should appear on the page
    for (const para of aboutContent.introSections) {
      expect(screen.getByText(para)).toBeInTheDocument();
    }
  });

  it("shows the current focus section", () => {
    expect(
      screen.getByRole("heading", { level: 2, name: /current focus/i })
    ).toBeInTheDocument();
    expect(screen.getByText(aboutContent.currentFocus)).toBeInTheDocument();
  });

  it("shows the 'What I'm Looking For' section", () => {
    expect(
      screen.getByRole("heading", { name: /what i.?m looking for/i })
    ).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // Tech stack / skills
  // --------------------------------------------------------------------------
  it("renders the Tech Stack section heading", () => {
    expect(
      screen.getByRole("heading", { level: 2, name: /tech stack/i })
    ).toBeInTheDocument();
  });

  it("renders every skill category label", () => {
    for (const cat of skillCategories) {
      // Labels may appear as both the h3 and inside a parent container; use
      // getAllByText and assert at least one match exists
      expect(
        screen.getAllByText(new RegExp(cat.label, "i")).length
      ).toBeGreaterThanOrEqual(1);
    }
  });

  it("renders at least one skill badge from each category", () => {
    for (const cat of skillCategories) {
      const firstSkill = cat.skills[0];
      expect(screen.getAllByText(firstSkill).length).toBeGreaterThanOrEqual(1);
    }
  });

  // --------------------------------------------------------------------------
  // Journey / timeline
  // --------------------------------------------------------------------------
  it("renders the Journey section", () => {
    expect(screen.getByTestId("journey-timeline")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /journey/i })
    ).toBeInTheDocument();
  });

  it("shows Palo Alto Networks in the experience timeline", () => {
    expect(screen.getByText("Palo Alto Networks")).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // Contact links
  // --------------------------------------------------------------------------
  it("renders the Get in Touch section", () => {
    expect(
      screen.getByRole("heading", { level: 2, name: /get in touch/i })
    ).toBeInTheDocument();
  });

  it("shows the email link with the correct mailto href", () => {
    const emailLink = screen.getByTestId("contact-email-link");
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute("href", `mailto:${siteConfig.email}`);
  });

  it("shows the GitHub social link", () => {
    const githubLink = screen.getByTestId("social-link-github");
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/ThyDrSlen"
    );
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("shows the LinkedIn social link", () => {
    const linkedinLink = screen.getByTestId("social-link-linkedin");
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/fabrizio-corrales/"
    );
    expect(linkedinLink).toHaveAttribute("target", "_blank");
  });

  // --------------------------------------------------------------------------
  // Resume download
  // --------------------------------------------------------------------------
  it("renders a resume download link pointing to /resume.pdf", () => {
    const resumeLink = screen.getByTestId("about-resume-download");
    expect(resumeLink).toBeInTheDocument();
    expect(resumeLink).toHaveAttribute("href", "/resume.pdf");
    expect(resumeLink).toHaveAttribute("target", "_blank");
    expect(resumeLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("resume download link has accessible text", () => {
    const resumeLink = screen.getByTestId("about-resume-download");
    expect(resumeLink.textContent).toMatch(/resume/i);
  });

  // --------------------------------------------------------------------------
  // Structured data (JSON-LD)
  // --------------------------------------------------------------------------
  it("embeds a JSON-LD script tag for Person schema", () => {
    const scripts = document.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    expect(scripts.length).toBeGreaterThanOrEqual(1);
    const jsonLd = JSON.parse(scripts[0].textContent ?? "{}");
    expect(jsonLd["@type"]).toBe("Person");
    expect(jsonLd.name).toBe(siteConfig.name);
  });
});
