import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Footer } from "@/components/shell/Footer";
import { siteConfig } from "@/content/site";

describe("Footer", () => {
  it("renders without crashing", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders the social links container", () => {
    render(<Footer />);
    expect(screen.getByTestId("footer-social-links")).toBeInTheDocument();
  });

  it("renders all social links from siteConfig", () => {
    render(<Footer />);
    for (const link of siteConfig.socialLinks) {
      expect(
        screen.getByTestId(`social-link-${link.platform}`)
      ).toBeInTheDocument();
    }
  });

  it("renders GitHub link with correct href", () => {
    render(<Footer />);
    const githubLink = screen.getByTestId("social-link-github");
    expect(githubLink).toHaveAttribute(
      "href",
      "https://github.com/ThyDrSlen"
    );
  });

  it("renders LinkedIn link with correct href", () => {
    render(<Footer />);
    const linkedinLink = screen.getByTestId("social-link-linkedin");
    expect(linkedinLink).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/fabrizio-corrales/"
    );
  });

  it("renders email link with correct href", () => {
    render(<Footer />);
    const emailLink = screen.getByTestId("social-link-email");
    expect(emailLink).toHaveAttribute("href", "mailto:drslen9@gmail.com");
  });

  it("all non-email links open in a new tab", () => {
    render(<Footer />);
    const container = screen.getByTestId("footer-social-links");
    const links = within(container).getAllByRole("link");
    for (const link of links) {
      const href = link.getAttribute("href") ?? "";
      if (!href.startsWith("mailto:")) {
        expect(link).toHaveAttribute("target", "_blank");
      }
    }
  });

  it("all non-email links have rel=noopener noreferrer", () => {
    render(<Footer />);
    const container = screen.getByTestId("footer-social-links");
    const links = within(container).getAllByRole("link");
    for (const link of links) {
      const href = link.getAttribute("href") ?? "";
      if (!href.startsWith("mailto:")) {
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      }
    }
  });

  it("email link does not open in a new tab", () => {
    render(<Footer />);
    const emailLink = screen.getByTestId("social-link-email");
    expect(emailLink).not.toHaveAttribute("target");
    expect(emailLink).not.toHaveAttribute("rel");
  });

  it("all links have an href attribute", () => {
    render(<Footer />);
    const container = screen.getByTestId("footer-social-links");
    const links = within(container).getAllByRole("link");
    for (const link of links) {
      expect(link).toHaveAttribute("href");
      expect(link.getAttribute("href")).not.toBe("");
    }
  });

  it("GitHub link has a descriptive aria-label", () => {
    render(<Footer />);
    const githubLink = screen.getByTestId("social-link-github");
    expect(githubLink).toHaveAttribute(
      "aria-label",
      "Visit Fabrizio's GitHub profile (@ThyDrSlen)"
    );
  });

  it("LinkedIn link has a descriptive aria-label", () => {
    render(<Footer />);
    const linkedinLink = screen.getByTestId("social-link-linkedin");
    expect(linkedinLink).toHaveAttribute(
      "aria-label",
      "Visit Fabrizio's LinkedIn profile"
    );
  });

  it("email link has a descriptive aria-label", () => {
    render(<Footer />);
    const emailLink = screen.getByTestId("social-link-email");
    expect(emailLink).toHaveAttribute(
      "aria-label",
      "Email Fabrizio Corrales"
    );
  });

  it("renders copyright text with the site owner's name", () => {
    render(<Footer />);
    const copy = screen.getByText(
      (content) =>
        content.includes(siteConfig.name) && content.includes("©")
    );
    expect(copy).toBeInTheDocument();
  });

  it("copyright text includes the current year", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear().toString();
    const copy = screen.getByText(
      (content) => content.includes(currentYear)
    );
    expect(copy).toBeInTheDocument();
  });
});
