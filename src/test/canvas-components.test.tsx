/**
 * Unit tests for CursorTrail and MatrixRain canvas components.
 *
 * Canvas context is mocked at the prototype level so getContext("2d") never
 * returns null and the animation loops (requestAnimationFrame) are stubbed
 * with vi.useFakeTimers to prevent runaway async work.
 */

import { act, render } from "@testing-library/react";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from "vitest";
import { CursorTrail } from "@/components/shell/CursorTrail";
import { MatrixRain } from "@/components/shell/MatrixRain";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal matchMedia mock that returns the requested `matches` value. */
function makeMatchMedia(matches: boolean) {
  return (query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(() => false),
  });
}

/** Stub HTMLCanvasElement.prototype.getContext so canvas operations never throw. */
function mockCanvasContext() {
  const ctx: Partial<CanvasRenderingContext2D> = {
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    fillText: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    scale: vi.fn(),
    setTransform: vi.fn(),
    get shadowBlur() {
      return 0;
    },
    set shadowBlur(_v: number) {},
    get shadowColor() {
      return "";
    },
    set shadowColor(_v: string) {},
    get fillStyle() {
      return "";
    },
    set fillStyle(_v: string | CanvasGradient | CanvasPattern) {},
    get font() {
      return "";
    },
    set font(_v: string) {},
  };

  const spy = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(ctx as unknown as CanvasRenderingContext2D);

  return spy;
}

// ---------------------------------------------------------------------------
// CursorTrail
// ---------------------------------------------------------------------------

describe("CursorTrail", () => {
  let ctxSpy: MockInstance;

  beforeEach(() => {
    vi.useFakeTimers();
    ctxSpy = mockCanvasContext();
  });

  afterEach(() => {
    ctxSpy.mockRestore();
    vi.useRealTimers();
  });

  it("renders a canvas element when pointer:fine matches (desktop)", async () => {
    // Both matchMedia queries must resolve: pointer:fine=true, reduced-motion=false
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: query.includes("pointer: fine"),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(() => false),
      }),
    });

    await act(async () => {
      render(<CursorTrail />);
    });

    const canvas = document.querySelector("canvas");
    expect(canvas).not.toBeNull();
    expect(canvas?.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders nothing when pointer:coarse matches (touch/mobile device)", async () => {
    // pointer:fine does NOT match — component returns null
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: makeMatchMedia(false),
    });

    await act(async () => {
      render(<CursorTrail />);
    });

    expect(document.querySelector("canvas")).toBeNull();
  });

  it("renders nothing when prefers-reduced-motion is set", async () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        // pointer:fine=true but reduced-motion=true → component returns null
        matches: query.includes("pointer: fine") || query.includes("reduced-motion"),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(() => false),
      }),
    });

    await act(async () => {
      render(<CursorTrail />);
    });

    expect(document.querySelector("canvas")).toBeNull();
  });

  it("unmounts without error (cleans up animation frame and event listeners)", async () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: query.includes("pointer: fine"),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(() => false),
      }),
    });

    let unmount: () => void;

    await act(async () => {
      const result = render(<CursorTrail />);
      unmount = result.unmount;
    });

    expect(() => {
      act(() => {
        unmount();
      });
    }).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// MatrixRain
// ---------------------------------------------------------------------------

describe("MatrixRain", () => {
  let ctxSpy: MockInstance;

  beforeEach(() => {
    vi.useFakeTimers();
    ctxSpy = mockCanvasContext();
  });

  afterEach(() => {
    ctxSpy.mockRestore();
    vi.useRealTimers();
  });

  it("renders a canvas element", async () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: makeMatchMedia(false),
    });

    await act(async () => {
      render(<MatrixRain />);
    });

    const canvas = document.querySelector("canvas");
    expect(canvas).not.toBeNull();
    expect(canvas?.classList.contains("matrix-rain")).toBe(true);
    expect(canvas?.getAttribute("aria-hidden")).toBe("true");
  });

  it("canvas has aria-hidden set (decorative, not exposed to AT)", async () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: makeMatchMedia(false),
    });

    await act(async () => {
      render(<MatrixRain />);
    });

    const canvas = document.querySelector("canvas");
    expect(canvas?.getAttribute("aria-hidden")).toBe("true");
  });

  it("does not crash on mount and unmount", async () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: makeMatchMedia(false),
    });

    let unmount: () => void;

    expect(() => {
      act(() => {
        const result = render(<MatrixRain />);
        unmount = result.unmount;
      });
    }).not.toThrow();

    expect(() => {
      act(() => {
        unmount();
      });
    }).not.toThrow();
  });

  it("skips animation when prefers-reduced-motion is set", async () => {
    // When prefers-reduced-motion matches, the useEffect returns early without
    // calling requestAnimationFrame.
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: makeMatchMedia(true), // reduced-motion = true
    });

    const rafSpy = vi.spyOn(window, "requestAnimationFrame");

    await act(async () => {
      render(<MatrixRain />);
    });

    // rAF should never have been called — no animation loop started
    expect(rafSpy).not.toHaveBeenCalled();

    rafSpy.mockRestore();
  });

  it("canvas is sized to the viewport via inline style", async () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: makeMatchMedia(false),
    });

    // jsdom defaults innerWidth/innerHeight to 1024×768
    Object.defineProperty(window, "innerWidth", { writable: true, value: 1280 });
    Object.defineProperty(window, "innerHeight", { writable: true, value: 800 });

    await act(async () => {
      render(<MatrixRain />);
    });

    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    expect(canvas).not.toBeNull();
    // The resize() call inside useEffect sets inline style dimensions
    expect(canvas.style.width).toBe("1280px");
    expect(canvas.style.height).toBe("800px");
  });
});
