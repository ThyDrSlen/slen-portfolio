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
});
