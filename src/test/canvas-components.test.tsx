import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { CursorTrail } from "@/components/shell/CursorTrail";
import { MatrixRain } from "@/components/shell/MatrixRain";

/* ---------- helpers ---------- */

/**
 * Override the default matchMedia mock from setup.ts to control
 * which media queries report `matches: true`.
 */
function mockMatchMedia(matchedQueries: string[]) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: matchedQueries.includes(query),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

/** Stub out HTMLCanvasElement.getContext so jsdom returns a fake 2d context. */
function mockCanvasContext() {
  const noop = () => {};
  const fakeCtx = {
    clearRect: noop,
    fillRect: noop,
    fillText: noop,
    beginPath: noop,
    arc: noop,
    fill: noop,
    scale: noop,
    setTransform: noop,
    shadowBlur: 0,
    shadowColor: "",
    fillStyle: "",
    font: "",
  };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    fakeCtx as unknown as CanvasRenderingContext2D,
  );
}

/* ==================== CursorTrail ==================== */

describe("CursorTrail", () => {
  beforeEach(() => {
    mockCanvasContext();
    vi.spyOn(window, "requestAnimationFrame").mockImplementation(() => 0);
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders a canvas when pointer: fine matches", () => {
    mockMatchMedia(["(pointer: fine)"]);
    const { container } = render(<CursorTrail />);
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("renders null when pointer: coarse (touch device)", () => {
    mockMatchMedia([]);
    const { container } = render(<CursorTrail />);
    expect(container.querySelector("canvas")).not.toBeInTheDocument();
  });

  it("renders null when prefers-reduced-motion is set", () => {
    mockMatchMedia(["(pointer: fine)", "(prefers-reduced-motion: reduce)"]);
    const { container } = render(<CursorTrail />);
    expect(container.querySelector("canvas")).not.toBeInTheDocument();
  });
});

/* ==================== MatrixRain ==================== */

describe("MatrixRain", () => {
  let rafSpy: ReturnType<typeof vi.spyOn>;
  let cafSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockCanvasContext();
    rafSpy = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation(() => 1);
    cafSpy = vi
      .spyOn(window, "cancelAnimationFrame")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders a canvas element without crashing", () => {
    mockMatchMedia([]);
    const { container } = render(<MatrixRain />);
    const canvas = container.querySelector("canvas.matrix-rain");
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute("aria-hidden", "true");
  });

  it("unmounts cleanly with no animation frame leaks", () => {
    mockMatchMedia([]);
    const { unmount } = render(<MatrixRain />);
    expect(rafSpy).toHaveBeenCalled();

    unmount();
    expect(cafSpy).toHaveBeenCalled();
  });

  it("skips animation when prefers-reduced-motion: reduce is set", () => {
    mockMatchMedia(["(prefers-reduced-motion: reduce)"]);
    rafSpy.mockClear();

    render(<MatrixRain />);
    // When reduced motion is detected, the effect returns early before
    // calling requestAnimationFrame for the draw loop.
    expect(rafSpy).not.toHaveBeenCalled();
  });
});
