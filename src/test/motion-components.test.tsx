import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Reveal } from "@/components/motion/Reveal";
import { TypeOnReveal } from "@/components/motion/TypeOnReveal";
import { CountUpMetric } from "@/components/motion/CountUpMetric";

// ---------------------------------------------------------------------------
// Module-level mock for usePrefersReducedMotion
// ---------------------------------------------------------------------------
vi.mock("@/hooks/usePrefersReducedMotion", () => ({
  usePrefersReducedMotion: vi.fn(() => false),
}));

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const mockUsePrefersReducedMotion = vi.mocked(usePrefersReducedMotion);

// ---------------------------------------------------------------------------
// IntersectionObserver helpers
// ---------------------------------------------------------------------------
type IOCallback = (entries: IntersectionObserverEntry[]) => void;

let ioCallback: IOCallback | null = null;
let ioDisconnect: ReturnType<typeof vi.fn> | null = null;

function setupIntersectionObserverMock() {
  ioCallback = null;
  ioDisconnect = null;

  const disconnect = vi.fn();
  ioDisconnect = disconnect;

  class MockIO {
    constructor(cb: IOCallback) {
      ioCallback = cb;
    }
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = disconnect;
  }

  vi.stubGlobal("IntersectionObserver", MockIO);
}

function triggerIntersection(isIntersecting: boolean) {
  if (!ioCallback) throw new Error("No IntersectionObserver callback registered");
  act(() => {
    ioCallback!([{ isIntersecting } as IntersectionObserverEntry]);
  });
}

// ---------------------------------------------------------------------------
// Reveal
// ---------------------------------------------------------------------------
describe("Reveal", () => {
  beforeEach(() => {
    setupIntersectionObserverMock();
    mockUsePrefersReducedMotion.mockReturnValue(false);
  });

  it("with prefersReducedMotion=true: renders children without animation styles", () => {
    mockUsePrefersReducedMotion.mockReturnValue(true);
    render(<Reveal data-testid="r">hello</Reveal>);
    const el = screen.getByTestId("r");
    expect(el).toHaveTextContent("hello");
    // No opacity/transform in the inline style (reduced-motion path omits them)
    expect(el).not.toHaveStyle({ opacity: "0" });
    expect(el).not.toHaveStyle({ transform: "translateY(20px)" });
  });

  it("with prefersReducedMotion=false: element starts hidden (opacity 0)", () => {
    render(<Reveal data-testid="r">hello</Reveal>);
    const el = screen.getByTestId("r");
    expect(el).toHaveStyle({ opacity: "0" });
    expect(el).toHaveStyle({ transform: "translateY(20px)" });
  });

  it("when IntersectionObserver fires isIntersecting=true: element becomes visible", () => {
    render(<Reveal data-testid="r">hello</Reveal>);
    triggerIntersection(true);
    const el = screen.getByTestId("r");
    expect(el).toHaveStyle({ opacity: "1" });
    expect(el).toHaveStyle({ transform: "translateY(0)" });
  });

  it("observer does NOT fire visible when isIntersecting=false", () => {
    render(<Reveal data-testid="r">hello</Reveal>);
    triggerIntersection(false);
    const el = screen.getByTestId("r");
    expect(el).toHaveStyle({ opacity: "0" });
  });

  it("observer disconnects on unmount", () => {
    const { unmount } = render(<Reveal data-testid="r">hello</Reveal>);
    expect(ioDisconnect).not.toBeNull();
    unmount();
    expect(ioDisconnect).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// TypeOnReveal
// ---------------------------------------------------------------------------
describe("TypeOnReveal", () => {
  beforeEach(() => {
    setupIntersectionObserverMock();
    mockUsePrefersReducedMotion.mockReturnValue(false);
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("with prefersReducedMotion=true: shows full text immediately", () => {
    mockUsePrefersReducedMotion.mockReturnValue(true);
    render(<TypeOnReveal text="Hello world" tag="p" />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("with prefersReducedMotion=false: starts with no visible typed characters before intersection", () => {
    render(<TypeOnReveal text="Hello" tag="span" />);
    // The aria-hidden span renders typed chars; before intersection charCount=0
    const ariaHidden = document.querySelector("[aria-hidden='true']");
    expect(ariaHidden).not.toBeNull();
    // Only the cursor child, no text characters typed yet
    const textNode = ariaHidden!.childNodes[0];
    // text content of aria-hidden span before intersection: empty string (charCount=0)
    // The text slice is "" and a cursor span follows
    expect(textNode?.textContent ?? "").toBe("");
  });

  it("sr-only span always contains full text", () => {
    render(<TypeOnReveal text="Accessible" tag="span" />);
    // The sr-only span uses absolute positioning with 1px dimensions
    const allSpans = document.querySelectorAll("span");
    const srSpan = Array.from(allSpans).find(
      (s) => s.style.position === "absolute" && s.style.width === "1px",
    );
    expect(srSpan).toBeDefined();
    expect(srSpan!.textContent).toBe("Accessible");
  });

  it("after intersection charCount advances with timers", async () => {
    render(<TypeOnReveal text="Hi" tag="span" />);

    // Trigger intersection to start animation
    triggerIntersection(true);

    // charCount starts at 0; each tick (30ms) adds one character
    const ariaHidden = document.querySelector("[aria-hidden='true']");
    expect(ariaHidden).not.toBeNull();

    // After 0ms: still 0 chars typed
    expect(ariaHidden!.textContent?.replace("|", "").length ?? 0).toBe(0);

    // Advance past first character delay (30ms per char from motionConfig)
    await act(async () => {
      vi.advanceTimersByTime(35);
    });
    // After 35ms: 1 character should have been typed
    const textAfterFirst = ariaHidden!.childNodes[0]?.textContent ?? "";
    expect(textAfterFirst.length).toBeGreaterThanOrEqual(1);

    // Advance to complete the text ("Hi" = 2 chars: 2 * 30ms = 60ms total)
    await act(async () => {
      vi.advanceTimersByTime(35);
    });
    const textAfterSecond = ariaHidden!.childNodes[0]?.textContent ?? "";
    expect(textAfterSecond).toBe("Hi");
  });
});

// ---------------------------------------------------------------------------
// CountUpMetric
// ---------------------------------------------------------------------------
describe("CountUpMetric", () => {
  beforeEach(() => {
    setupIntersectionObserverMock();
    mockUsePrefersReducedMotion.mockReturnValue(false);
    vi.useFakeTimers({
      toFake: ["setTimeout", "clearTimeout", "requestAnimationFrame", "cancelAnimationFrame"],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("with prefersReducedMotion=true: shows target value immediately", () => {
    mockUsePrefersReducedMotion.mockReturnValue(true);
    render(<CountUpMetric target={42} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("with prefersReducedMotion=false: starts at 0 before intersection", () => {
    render(<CountUpMetric target={100} />);
    // Before intersection, current stays at 0, displayed value is 0
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("prefix prop wraps the number", () => {
    mockUsePrefersReducedMotion.mockReturnValue(true);
    const { container } = render(<CountUpMetric target={5} prefix="$" />);
    expect(container.textContent).toContain("$");
    expect(container.textContent).toContain("5");
  });

  it("suffix prop wraps the number", () => {
    mockUsePrefersReducedMotion.mockReturnValue(true);
    const { container } = render(<CountUpMetric target={99} suffix="%" />);
    expect(container.textContent).toContain("99");
    expect(container.textContent).toContain("%");
  });

  it("prefix and suffix together wrap the number", () => {
    mockUsePrefersReducedMotion.mockReturnValue(true);
    const { container } = render(<CountUpMetric target={10} prefix="~" suffix="x" />);
    expect(container.textContent).toContain("~");
    expect(container.textContent).toContain("10");
    expect(container.textContent).toContain("x");
  });

  it("after intersection, count animates above 0 with RAF", async () => {
    render(<CountUpMetric target={200} />);

    // Before intersection: still 0
    expect(screen.getByText("0")).toBeInTheDocument();

    // Fire intersection to start animation
    triggerIntersection(true);

    // Advance RAF frames significantly (countUpDurationMs = 1200ms)
    await act(async () => {
      vi.advanceTimersByTime(600);
    });

    const span = document.querySelector("span");
    const displayedValue = parseInt(span?.textContent ?? "0", 10);
    expect(displayedValue).toBeGreaterThan(0);
  });
});
