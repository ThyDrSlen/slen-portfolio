import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PulseDashboard } from "@/components/home/PulseDashboard";
import { Reveal } from "@/components/motion/Reveal";
import type { GitHubEvent } from "@/lib/github";

const mockEvents: GitHubEvent[] = [
  { date: "2026-04-01", commits: 5 },
  { date: "2026-04-02", commits: 3 },
  { date: "2026-04-03", commits: 7 },
];

type IntersectionCallback = ConstructorParameters<typeof IntersectionObserver>[0];

describe("Reveal and PulseDashboard", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date", "requestAnimationFrame", "cancelAnimationFrame"] });
    vi.setSystemTime(new Date("2026-04-05T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("starts invisible and becomes visible on intersection", async () => {
    let observerCallback: IntersectionCallback | undefined;
    const originalIntersectionObserver = window.IntersectionObserver;

    class MockIntersectionObserver implements IntersectionObserver {
      readonly root = null;
      readonly rootMargin = "";
      readonly thresholds = [];

      constructor(callback: IntersectionCallback) {
        observerCallback = callback;
      }

      disconnect() {}
      observe() {}
      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
      unobserve() {}
    }

    window.IntersectionObserver = MockIntersectionObserver;

    render(<Reveal>visible content</Reveal>);

    const reveal = screen.getByTestId("reveal");
    expect(reveal).toHaveStyle({ opacity: "0" });

    await act(async () => {
      observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });

    expect(reveal).toHaveStyle({ opacity: "1" });
    window.IntersectionObserver = originalIntersectionObserver;
  });

  it("skips animation when reduced motion preferred", () => {
    window.matchMedia = vi.fn((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }));

    render(<Reveal>visible content</Reveal>);

    expect(screen.getByTestId("reveal")).not.toHaveStyle({ opacity: "0" });
    expect(screen.getByText("visible content")).toBeInTheDocument();
  });

  it("renders commit stats and range buttons", () => {
    render(<PulseDashboard events={mockEvents} lastActive="2026-04-03" />);

    expect(screen.getByTestId("github-commit-pulse")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("3d")).toBeInTheDocument();
    expect(screen.getByText("2026-04-03")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "7d" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1m" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3m" })).toBeInTheDocument();
  });
});
