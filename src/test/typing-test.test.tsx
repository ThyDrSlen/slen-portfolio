import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TypingTest } from "@/components/TypingTest";

function getCurrentChar(container: HTMLElement): string {
  const current = container.querySelector(".typing-test-words .current");
  if (!(current instanceof HTMLElement) || !current.textContent) {
    throw new Error("Current typing cursor was not found");
  }
  return current.textContent;
}

function getRenderedWords(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll(".typing-test-words > span"), (word) => word.textContent ?? "");
}

async function renderAndInit() {
  const result = render(<TypingTest />);
  await act(async () => {
    vi.runAllTimers();
    await Promise.resolve();
  });
  await act(async () => {
    vi.advanceTimersByTime(100);
    await Promise.resolve();
  });
  return result;
}

describe("TypingTest", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "setInterval", "clearInterval", "Date", "requestAnimationFrame", "cancelAnimationFrame"] });
    vi.setSystemTime(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the stored personal best before a run starts", async () => {
    localStorage.setItem("typing-test-pb-code", "87");

    await renderAndInit();

    expect(screen.getByTestId("typing-test-pb")).toHaveTextContent("pb: 87 wpm");
  });

  it("resets an active run back to the idle state", async () => {
    const { container } = await renderAndInit();
    const input = screen.getByLabelText("Typing test input");

    act(() => {
      fireEvent.keyDown(input, { key: getCurrentChar(container) });
    });

    expect(screen.getByTestId("typing-test-live-wpm")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "reset" }));
      vi.advanceTimersByTime(20);
      await Promise.resolve();
    });

    expect(screen.queryByTestId("typing-test-live-wpm")).not.toBeInTheDocument();
    expect(screen.getByText(/click here and start typing/i)).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("stores a new personal best after a completed run", async () => {
    const { container } = await renderAndInit();
    const input = screen.getByLabelText("Typing test input");

    act(() => {
      fireEvent.keyDown(input, { key: getCurrentChar(container) });
      fireEvent.keyDown(input, { key: getCurrentChar(container) });
    });

    await act(async () => {
      vi.advanceTimersByTime(30100);
      await Promise.resolve();
    });

    expect(screen.getByTestId("typing-test-results")).toBeInTheDocument();

    const pbVal = localStorage.getItem("typing-test-pb-code");
    expect(pbVal).not.toBeNull();
  });

  it("switches mode and regenerates words", async () => {
    const { container } = await renderAndInit();
    const snippetsButton = screen.getByRole("button", { name: "snippets" });

    const before = getRenderedWords(container);
    expect(before.length).toBeGreaterThan(0);

    act(() => {
      fireEvent.click(snippetsButton);
    });

    await act(async () => {
      vi.runAllTimers();
      vi.advanceTimersByTime(100);
      await Promise.resolve();
    });

    const after = getRenderedWords(container);
    expect(after.length).toBeGreaterThan(0);
    expect(snippetsButton).toHaveStyle({ background: "var(--color-accent)" });
    expect(after).not.toEqual(before);
  });

  it("switches time limit", async () => {
    const { container } = await renderAndInit();
    const timer = container.querySelector(".mono.glow");

    expect(timer).toHaveTextContent("30s");

    act(() => {
      fireEvent.click(screen.getByTestId("typing-time-60"));
    });

    expect(timer).toHaveTextContent("60s");
  });

  it("tracks accuracy with errors", async () => {
    const { container } = await renderAndInit();
    const input = screen.getByLabelText("Typing test input");

    act(() => {
      fireEvent.keyDown(input, { key: getCurrentChar(container) === "x" ? "z" : "x" });
    });

    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(screen.getByText("accuracy")).toBeInTheDocument();
  });

  it("handles backspace to correct errors", async () => {
    const { container } = await renderAndInit();
    const input = screen.getByLabelText("Typing test input");
    const initialChar = getCurrentChar(container);

    act(() => {
      fireEvent.keyDown(input, { key: initialChar === "x" ? "z" : "x" });
    });

    expect(getCurrentChar(container)).not.toBe(initialChar);

    act(() => {
      fireEvent.keyDown(input, { key: "Backspace" });
    });

    expect(getCurrentChar(container)).toBe(initialChar);
  });

  it("blocks mode change during active run", async () => {
    const { container } = await renderAndInit();
    const input = screen.getByLabelText("Typing test input");
    const before = getRenderedWords(container);

    act(() => {
      fireEvent.keyDown(input, { key: getCurrentChar(container) });
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("typing-mode-snippets"));
      vi.runAllTimers();
      await Promise.resolve();
    });

    expect(getRenderedWords(container)).toEqual(before);
    expect(screen.getByTestId("typing-mode-code")).toHaveStyle({ background: "var(--color-accent)" });
  });

  it("Tab key resets test during active run", async () => {
    const { container } = await renderAndInit();
    const input = screen.getByLabelText("Typing test input");

    act(() => {
      fireEvent.keyDown(input, { key: getCurrentChar(container) });
    });

    expect(screen.getByTestId("typing-test-live-wpm")).toBeInTheDocument();

    await act(async () => {
      fireEvent.keyDown(input, { key: "Tab" });
      vi.runAllTimers();
      await Promise.resolve();
    });

    expect(screen.queryByTestId("typing-test-live-wpm")).not.toBeInTheDocument();
    expect(screen.getByText(/click here and start typing/i)).toBeInTheDocument();
    expect(input).toHaveValue("");
  });
});
