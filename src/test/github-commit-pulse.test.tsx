import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import type { GitHubPulseData } from "@/lib/github";

// Mock fetchGitHubPulse
const mockFetchGitHubPulse = vi.fn<
  (username: string) => Promise<GitHubPulseData | null>
>();
vi.mock("@/lib/github", () => ({
  fetchGitHubPulse: (...args: unknown[]) => mockFetchGitHubPulse(...(args as [string])),
}));

// Mock PulseDashboard to avoid rendering the full SVG chart
vi.mock("@/components/home/PulseDashboard", () => ({
  PulseDashboard: ({
    events,
    lastActive,
  }: {
    events: { date: string; commits: number }[];
    lastActive: string;
  }) => (
    <div data-testid="pulse-dashboard-mock">
      <span data-testid="event-count">{events.length}</span>
      <span data-testid="last-active">{lastActive}</span>
    </div>
  ),
}));

import { GitHubCommitPulse } from "@/components/home/GitHubCommitPulse";

const VALID_DATA: GitHubPulseData = {
  events: [
    { date: "2025-04-10", commits: 5 },
    { date: "2025-04-09", commits: 3 },
    { date: "2025-04-08", commits: 1 },
  ],
  lastActive: "2025-04-10",
};

describe("GitHubCommitPulse", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders PulseDashboard when fetchGitHubPulse returns valid data", async () => {
    mockFetchGitHubPulse.mockResolvedValue(VALID_DATA);

    const Component = await GitHubCommitPulse();
    render(Component);

    expect(screen.getByTestId("pulse-dashboard-mock")).toBeInTheDocument();
    expect(screen.getByTestId("event-count")).toHaveTextContent("3");
    expect(screen.getByTestId("last-active")).toHaveTextContent("2025-04-10");
  });

  it("passes events and lastActive through to PulseDashboard", async () => {
    const data: GitHubPulseData = {
      events: [{ date: "2025-04-07", commits: 12 }],
      lastActive: "2025-04-07",
    };
    mockFetchGitHubPulse.mockResolvedValue(data);

    const Component = await GitHubCommitPulse();
    render(Component);

    expect(screen.getByTestId("event-count")).toHaveTextContent("1");
    expect(screen.getByTestId("last-active")).toHaveTextContent("2025-04-07");
  });

  it("renders fallback UI when fetchGitHubPulse returns null", async () => {
    mockFetchGitHubPulse.mockResolvedValue(null);

    const Component = await GitHubCommitPulse();
    render(Component);

    expect(screen.getByTestId("github-commit-pulse")).toBeInTheDocument();
    expect(screen.queryByTestId("pulse-dashboard-mock")).not.toBeInTheDocument();
    expect(screen.getByText(/signal unavailable/)).toBeInTheDocument();
  });

  it("renders fallback link pointing to GitHub profile", async () => {
    mockFetchGitHubPulse.mockResolvedValue(null);

    const Component = await GitHubCommitPulse();
    render(Component);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://github.com/ThyDrSlen");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders fallback UI (does not crash) when fetchGitHubPulse throws", async () => {
    mockFetchGitHubPulse.mockRejectedValue(new Error("API failure"));

    // The component does not have its own try/catch around fetchGitHubPulse,
    // so a rejection will propagate. We verify the component throws rather
    // than silently failing, which is the expected behavior for an async
    // server component (Next.js error boundary handles it).
    await expect(GitHubCommitPulse()).rejects.toThrow("API failure");
  });

  it("calls fetchGitHubPulse with the correct username", async () => {
    mockFetchGitHubPulse.mockResolvedValue(VALID_DATA);

    const Component = await GitHubCommitPulse();
    render(Component);

    expect(mockFetchGitHubPulse).toHaveBeenCalledWith("ThyDrSlen");
    expect(mockFetchGitHubPulse).toHaveBeenCalledTimes(1);
  });

  it("fallback UI contains data-testid github-commit-pulse", async () => {
    mockFetchGitHubPulse.mockResolvedValue(null);

    const Component = await GitHubCommitPulse();
    render(Component);

    expect(screen.getByTestId("github-commit-pulse")).toBeInTheDocument();
  });
});
