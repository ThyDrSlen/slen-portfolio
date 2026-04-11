import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/shell/Footer";
import { siteConfig } from "@/content/site";

// Re-implement getSocialAriaLabel logic here to test it in isolation.
// We drive assertions against the rendered aria-label attributes on the links.

describe("Footer", () => {
  it("renders the footer social links container", () => {
    render(<Footer />);
    expect(screen.getByTestId("footer-social-links")).toBeInTheDocument();
  });

  it("renders a link for every socialLink in siteConfig", () => {
    render(<Footer />);
    for (const link of siteConfig.socialLinks) {
      expect(
        screen.getByTestId(`social-link-${link.platform}`)
      ).toBeInTheDocument();
    }
  });

  it("renders social links with correct href values", () => {
    render(<Footer />);
    for (const link of siteConfig.socialLinks) {
      const el = screen.getByTestId(`social-link-${link.platform}`);
      expect(el).toHaveAttribute("href", link.url);
    }
  });

  it("displays the current year in the copyright line", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });

  it("displays the site owner name in the copyright line", () => {
    render(<Footer />);
    expect(
      screen.getByText(new RegExp(siteConfig.name))
    ).toBeInTheDocument();
  });
});

describe("getSocialAriaLabel (via rendered aria-label)", () => {
  it("returns the correct aria-label for the github link", () => {
    render(<Footer />);
    const githubLink = screen.getByTestId("social-link-github");
    expect(githubLink).toHaveAttribute(
      "aria-label",
      "Visit Fabrizio's GitHub profile (@ThyDrSlen)"
    );
  });

  it("returns the correct aria-label for the linkedin link", () => {
    render(<Footer />);
    const linkedinLink = screen.getByTestId("social-link-linkedin");
    expect(linkedinLink).toHaveAttribute(
      "aria-label",
      "Visit Fabrizio's LinkedIn profile"
    );
  });

  it("returns the correct aria-label for the email link", () => {
    render(<Footer />);
    const emailLink = screen.getByTestId("social-link-email");
    expect(emailLink).toHaveAttribute(
      "aria-label",
      "Email Fabrizio Corrales"
    );
  });
});

describe("Footer link attributes", () => {
  it("external social links have target='_blank'", () => {
    render(<Footer />);
    const externalPlatforms = siteConfig.socialLinks.filter(
      (l) => l.platform !== "email"
    );
    for (const link of externalPlatforms) {
      const el = screen.getByTestId(`social-link-${link.platform}`);
      expect(el).toHaveAttribute("target", "_blank");
    }
  });

  it("external social links have rel='noopener noreferrer'", () => {
    render(<Footer />);
    const externalPlatforms = siteConfig.socialLinks.filter(
      (l) => l.platform !== "email"
    );
    for (const link of externalPlatforms) {
      const el = screen.getByTestId(`social-link-${link.platform}`);
      expect(el).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("email link does NOT have target='_blank'", () => {
    render(<Footer />);
    const emailLink = screen.getByTestId("social-link-email");
    expect(emailLink).not.toHaveAttribute("target", "_blank");
  });

  it("email link does NOT have a rel attribute", () => {
    render(<Footer />);
    const emailLink = screen.getByTestId("social-link-email");
    expect(emailLink).not.toHaveAttribute("rel");
  });

  it("email link href uses mailto: scheme", () => {
    render(<Footer />);
    const emailLink = screen.getByTestId("social-link-email");
    expect(emailLink.getAttribute("href")).toMatch(/^mailto:/);
  });
});
