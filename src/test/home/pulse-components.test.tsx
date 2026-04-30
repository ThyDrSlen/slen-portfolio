import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PulseAnimation } from "@/components/home/PulseAnimation";
import { PulseDashboard } from "@/components/home/PulseDashboard";
import type { GitHubEvent } from "@/lib/github";

/* ---------- helpers ---------- */

function makeDayData(counts: number[]) {
  return counts.map((count, i) => ({
    date: `2025-01-${String(i + 1).padStart(2, "0")}`,
    count,
  }));
}

function makeEvents(pairs: [string, number][]): GitHubEvent[] {
  return pairs.map(([date, commits]) => ({ date, commits }));
}

/* ========== PulseAnimation ========== */

describe("PulseAnimation", () => {
  it("renders an SVG with the correct aria-label", () => {
    const data = makeDayData([3, 0, 5, 2, 1, 4, 6]);

    render(<PulseAnimation commitsByDay={data} />);

    const svg = screen.getByRole("img", {
      name: "GitHub commit activity over the last 7 days",
    });
    expect(svg).toBeInTheDocument();
    expect(svg.tagName.toLowerCase()).toBe("svg");
  });

  it("renders a polyline and dots for every data point", () => {
    const data = makeDayData([3, 0, 5, 2, 1, 4, 6]);

    const { container } = render(<PulseAnimation commitsByDay={data} />);

    const polylines = container.querySelectorAll("polyline");
    expect(polylines.length).toBe(2);

    const dotGroups = container.querySelectorAll("g");
    expect(dotGroups.length).toBe(data.length);
  });

  it("renders date labels for each data point", () => {
    const data = makeDayData([3, 0, 5]);

    const { container } = render(<PulseAnimation commitsByDay={data} />);

    const labels = container.querySelectorAll("text");
    expect(labels.length).toBe(data.length);
    expect(labels[0].textContent).toBe("01-01");
    expect(labels[2].textContent).toBe("01-03");
  });

  it("handles a single data point without crashing", () => {
    const data = makeDayData([5]);

    const { container } = render(<PulseAnimation commitsByDay={data} />);

    const svg = screen.getByRole("img");
    expect(svg).toBeInTheDocument();

    const polylines = container.querySelectorAll("polyline");
    expect(polylines.length).toBe(2);
  });

  it("handles all-zero data", () => {
    const data = makeDayData([0, 0, 0, 0, 0, 0, 0]);

    const { container } = render(<PulseAnimation commitsByDay={data} />);

    const svg = screen.getByRole("img");
    expect(svg).toBeInTheDocument();

    const dotGroups = container.querySelectorAll("g");
    expect(dotGroups.length).toBe(7);
  });

  it("renders grid lines for each data point", () => {
    const data = makeDayData([1, 2, 3]);

    const { container } = render(<PulseAnimation commitsByDay={data} />);

    // grid lines + baseline axis line
    const lines = container.querySelectorAll("line");
    expect(lines.length).toBe(data.length + 1);
  });
});

/* ========== PulseDashboard ========== */

describe("PulseDashboard", () => {
  const today = new Date();
  function dateStr(daysAgo: number) {
    const d = new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return d.toISOString().split("T")[0];
  }

  const events: GitHubEvent[] = makeEvents([
    [dateStr(0), 3],
    [dateStr(1), 5],
    [dateStr(2), 0],
    [dateStr(3), 2],
  ]);

  it("renders the dashboard container", () => {
    render(<PulseDashboard events={events} lastActive={dateStr(0)} />);

    expect(screen.getByTestId("github-commit-pulse")).toBeInTheDocument();
  });

  it("displays the commit count for the default 7-day range", () => {
    render(<PulseDashboard events={events} lastActive={dateStr(0)} />);

    // total = 3 + 5 + 0 + 2 = 10
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("7d commits")).toBeInTheDocument();
  });

  it("displays the streak count", () => {
    render(<PulseDashboard events={events} lastActive={dateStr(0)} />);

    expect(screen.getByText(/streak/)).toBeInTheDocument();
    // streak calculated from the end: today (3) + yesterday (5) = 2 days,
    // then 2 days ago has 0, so streak = 2
    expect(screen.getByText("2d")).toBeInTheDocument();
  });

  it("displays the last active date", () => {
    const lastActive = dateStr(0);
    render(<PulseDashboard events={events} lastActive={lastActive} />);

    expect(screen.getByText(lastActive)).toBeInTheDocument();
    expect(screen.getByText("last push")).toBeInTheDocument();
  });

  it("renders all three range buttons (7d, 1m, 3m)", () => {
    render(<PulseDashboard events={events} lastActive={dateStr(0)} />);

    expect(screen.getByTestId("pulse-range-7")).toBeInTheDocument();
    expect(screen.getByTestId("pulse-range-30")).toBeInTheDocument();
    expect(screen.getByTestId("pulse-range-90")).toBeInTheDocument();

    expect(screen.getByTestId("pulse-range-7")).toHaveTextContent("7d");
    expect(screen.getByTestId("pulse-range-30")).toHaveTextContent("1m");
    expect(screen.getByTestId("pulse-range-90")).toHaveTextContent("3m");
  });

  it("clicking a range button changes the displayed range label", () => {
    render(<PulseDashboard events={events} lastActive={dateStr(0)} />);

    expect(screen.getByText("7d commits")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("pulse-range-30"));
    expect(screen.getByText("30d commits")).toBeInTheDocument();
    expect(screen.queryByText("7d commits")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("pulse-range-90"));
    expect(screen.getByText("90d commits")).toBeInTheDocument();
    expect(screen.queryByText("30d commits")).not.toBeInTheDocument();
  });

  it("renders the GitHub profile link", () => {
    render(<PulseDashboard events={events} lastActive={dateStr(0)} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://github.com/ThyDrSlen");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders the PulseAnimation SVG inside the dashboard", () => {
    render(<PulseDashboard events={events} lastActive={dateStr(0)} />);

    const svg = screen.getByRole("img", {
      name: "GitHub commit activity over the last 7 days",
    });
    expect(svg).toBeInTheDocument();
  });
});
