import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BootSequence } from "@/components/shell/BootSequence";
import { SubwayStatusBar } from "@/components/shell/SubwayStatusBar";
import { bootLines, subwayConfig } from "@/content/system";

// ── BootSequence ──────────────────────────────────────────────────────────────

describe("BootSequence", () => {
  beforeEach(() => {
    // Ensure the session flag is clear so the component renders
    sessionStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders without crashing", () => {
    render(<BootSequence />);
    expect(screen.getByTestId("boot-sequence")).toBeInTheDocument();
  });

  it("renders the 'Press any key to skip' button", () => {
    render(<BootSequence />);
    expect(
      screen.getByRole("button", { name: /press any key to skip/i })
    ).toBeInTheDocument();
  });

  it("shows boot lines as timers advance", async () => {
    render(<BootSequence />);

    // Advance past the first boot-line delay so at least one line is visible
    await act(async () => {
      vi.advanceTimersByTime(300);
      await Promise.resolve();
    });

    // The first boot line text should appear in the document
    expect(screen.getByText(bootLines[0])).toBeInTheDocument();
  });

  it("clicking the dismiss button sets the session flag and unmounts", async () => {
    render(<BootSequence />);

    const btn = screen.getByRole("button", { name: /press any key to skip/i });

    await act(async () => {
      fireEvent.click(btn);
      await Promise.resolve();
    });

    expect(sessionStorage.getItem("boot-seen")).toBe("1");
    expect(screen.queryByTestId("boot-sequence")).not.toBeInTheDocument();
  });

  it("pressing any key dismisses the boot sequence", async () => {
    render(<BootSequence />);

    await act(async () => {
      fireEvent.keyDown(window, { key: "Escape" });
      await Promise.resolve();
    });

    expect(sessionStorage.getItem("boot-seen")).toBe("1");
    expect(screen.queryByTestId("boot-sequence")).not.toBeInTheDocument();
  });

  it("does not render when boot-seen flag is already set", () => {
    sessionStorage.setItem("boot-seen", "1");
    render(<BootSequence />);
    expect(screen.queryByTestId("boot-sequence")).not.toBeInTheDocument();
  });
});

// ── SubwayStatusBar ───────────────────────────────────────────────────────────

describe("SubwayStatusBar", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.useFakeTimers({ now: new Date("2025-01-15T18:00:00Z").getTime() });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders with data-testid='subway-status-bar'", () => {
    render(<SubwayStatusBar />);
    expect(screen.getByTestId("subway-status-bar")).toBeInTheDocument();
  });

  it("shows the first status message from config", () => {
    render(<SubwayStatusBar />);
    expect(
      screen.getByText(subwayConfig.statusMessages[0])
    ).toBeInTheDocument();
  });

  it("renders the line name badge", () => {
    render(<SubwayStatusBar />);
    expect(screen.getByText(subwayConfig.lineName)).toBeInTheDocument();
  });

  it("renders the dismiss button with correct test id", () => {
    render(<SubwayStatusBar />);
    expect(screen.getByTestId("subway-dismiss")).toBeInTheDocument();
  });

  it("clicking dismiss removes the bar and sets the session flag", async () => {
    render(<SubwayStatusBar />);

    const btn = screen.getByTestId("subway-dismiss");

    await act(async () => {
      fireEvent.click(btn);
      await Promise.resolve();
    });

    expect(sessionStorage.getItem("subway-dismissed")).toBe("1");
    expect(screen.queryByTestId("subway-status-bar")).not.toBeInTheDocument();
  });

  it("pressing Escape dismisses the bar", async () => {
    render(<SubwayStatusBar />);

    await act(async () => {
      fireEvent.keyDown(window, { key: "Escape" });
      await Promise.resolve();
    });

    expect(sessionStorage.getItem("subway-dismissed")).toBe("1");
    expect(screen.queryByTestId("subway-status-bar")).not.toBeInTheDocument();
  });

  it("pressing a non-Escape key does not dismiss the bar", async () => {
    render(<SubwayStatusBar />);

    await act(async () => {
      fireEvent.keyDown(window, { key: "Enter" });
      await Promise.resolve();
    });

    expect(screen.getByTestId("subway-status-bar")).toBeInTheDocument();
  });

  it("displays a time string (the clock)", () => {
    render(<SubwayStatusBar />);
    // The clock uses LA time zone; just verify it renders a HH:MM:SS-style string
    const bar = screen.getByTestId("subway-status-bar");
    expect(bar.textContent).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  it("does not render when subway-dismissed flag is already set", () => {
    sessionStorage.setItem("subway-dismissed", "1");
    render(<SubwayStatusBar />);
    expect(screen.queryByTestId("subway-status-bar")).not.toBeInTheDocument();
  });
});
