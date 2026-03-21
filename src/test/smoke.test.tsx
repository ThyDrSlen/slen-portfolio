import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/components/home/GitHubCommitPulse", () => ({
  GitHubCommitPulse: () => <div data-testid="github-commit-pulse" />,
}));

vi.mock("@/components/home/InteractiveTerminal", () => ({
  InteractiveTerminal: () => <div data-testid="interactive-terminal" />,
}));

import Home from "@/app/page";

describe("Home page", () => {
  it("renders the heading", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
