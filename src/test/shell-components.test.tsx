import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BootSequence } from "@/components/shell/BootSequence";
import { CursorTrail } from "@/components/shell/CursorTrail";
import { MatrixRain } from "@/components/shell/MatrixRain";
import { HitMarker } from "@/components/shell/HitMarker";

interface MatchMediaOptions {
  reducedMotion?: boolean;
  pointerFine?: boolean;
}

function setMatchMedia({ reducedMotion = false, pointerFine = true }: MatchMediaOptions = {}) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches:
        query === "(prefers-reduced-motion: reduce)"
          ? reducedMotion
          : query === "(pointer: fine)"
            ? pointerFine
            : false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })),
  });
}

function installCanvasMocks() {
  const context = {
    scale: vi.fn(),
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    fillRect: vi.fn(),
    fillText: vi.fn(),
    shadowBlur: 0,
    shadowColor: "transparent",
    fillStyle: "#000",
    font: "",
  };

  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    configurable: true,
    value: vi.fn(() => context),
  });
}

class MockAudio {
  volume = 1;

  cloneNode() {
    return new MockAudio();
  }

  play() {
    return Promise.resolve();
  }
}

beforeEach(() => {
  installCanvasMocks();
  setMatchMedia();
  vi.stubGlobal("requestAnimationFrame", vi.fn(() => 1));
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  vi.stubGlobal("Audio", MockAudio);
});

describe("BootSequence", () => {
  it("renders on first visit when the session flag is not set", () => {
    render(<BootSequence />);

    expect(screen.getByTestId("boot-sequence")).toBeInTheDocument();
  });

  it("does not render when the session flag is already set", () => {
    sessionStorage.setItem("boot-seen", "1");

    render(<BootSequence />);

    expect(screen.queryByTestId("boot-sequence")).not.toBeInTheDocument();
  });

  it("skips the animation when reduced motion is preferred", async () => {
    setMatchMedia({ reducedMotion: true });

    render(<BootSequence />);

    expect(screen.queryByTestId("boot-sequence")).not.toBeInTheDocument();
    await waitFor(() => expect(sessionStorage.getItem("boot-seen")).toBe("1"));
  });
});

describe("CursorTrail", () => {
  it("returns null when reduced motion is preferred", () => {
    setMatchMedia({ reducedMotion: true });
    const { container } = render(<CursorTrail />);

    expect(container.firstChild).toBeNull();
  });

  it("returns null on non-desktop pointers", () => {
    setMatchMedia({ pointerFine: false });
    const { container } = render(<CursorTrail />);

    expect(container.firstChild).toBeNull();
  });
});

describe("MatrixRain", () => {
  it("renders a canvas element", () => {
    const { container } = render(<MatrixRain />);

    expect(container.querySelector("canvas.matrix-rain")).toBeInTheDocument();
  });

  it("skips animation work when reduced motion is preferred", () => {
    setMatchMedia({ reducedMotion: true });
    const requestAnimationFrameSpy = vi.fn(() => 1);
    vi.stubGlobal("requestAnimationFrame", requestAnimationFrameSpy);

    const { container } = render(<MatrixRain />);

    expect(container.querySelector("canvas.matrix-rain")).toBeInTheDocument();
    expect(requestAnimationFrameSpy).not.toHaveBeenCalled();
  });
});

describe("HitMarker", () => {
  it("returns null when reduced motion is preferred", () => {
    setMatchMedia({ reducedMotion: true });
    const { container } = render(<HitMarker />);

    expect(container.firstChild).toBeNull();
  });

  it("renders nothing initially before any clicks occur", () => {
    const { container } = render(<HitMarker />);

    expect(container.querySelector("svg")).toBeNull();
  });
});
