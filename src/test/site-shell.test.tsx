import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "@/components/shell/Header";
import { SkipLink } from "@/components/shell/SkipLink";

describe("Header", () => {
  it("renders with site-shell test id", () => {
    render(<Header />);
    expect(screen.getByTestId("site-shell")).toBeInTheDocument();
  });

  it("renders primary nav with work and about links", () => {
    render(<Header />);
    expect(screen.getByTestId("primary-nav")).toBeInTheDocument();
    expect(screen.getByTestId("nav-link-work")).toBeInTheDocument();
    expect(screen.getByTestId("nav-link-about")).toBeInTheDocument();
  });

  it("renders resume download link", () => {
    render(<Header />);
    const link = screen.getByTestId("resume-download-link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/resume");
  });
});

describe("SkipLink", () => {
  it("renders with skip-link test id", () => {
    render(<SkipLink />);
    const link = screen.getByTestId("skip-link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#main-content");
  });
});
