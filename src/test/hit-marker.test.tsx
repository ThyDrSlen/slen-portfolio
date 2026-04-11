import {
  act,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HitMarker } from "@/components/shell/HitMarker";

// ---------------------------------------------------------------------------
// Module-level mocks
// ---------------------------------------------------------------------------

// Mock usePrefersReducedMotion so individual tests can control the value.
const mockUsePrefersReducedMotion = vi.fn(() => false);

vi.mock("@/hooks/usePrefersReducedMotion", () => ({
  usePrefersReducedMotion: () => mockUsePrefersReducedMotion(),
}));

// ---------------------------------------------------------------------------
// Audio mock – installed globally so new Audio(...) is captured.
// ---------------------------------------------------------------------------

const mockPlay = vi.fn(() => Promise.resolve());
const mockPause = vi.fn();

class MockAudio {
  volume = 1;
  currentTime = 0;
  play = mockPlay;
  pause = mockPause;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_src?: string) {}
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Fire a document-level click at (x, y) targeting `element`. */
function clickAt(element: Element, x = 100, y = 200) {
  fireEvent.click(element, { clientX: x, clientY: y, bubbles: true });
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe("HitMarker", () => {
  beforeEach(() => {
    // Default: motion is allowed.
    mockUsePrefersReducedMotion.mockReturnValue(false);

    vi.useFakeTimers();

    mockPlay.mockClear();
    mockPause.mockClear();

    // Install fresh Audio mock before each test.
    vi.stubGlobal("Audio", MockAudio);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  // -------------------------------------------------------------------------
  // 1. Clicking an interactive element spawns a marker
  // -------------------------------------------------------------------------
  it("adds a marker to the DOM when a button is clicked", () => {
    render(
      <div>
        <HitMarker />
        <button>Action</button>
      </div>,
    );

    const btn = screen.getByRole("button", { name: "Action" });
    act(() => {
      clickAt(btn, 300, 400);
    });

    // The marker is rendered as a <div> with a fixed position style.
    const markers = document
      .querySelectorAll('div[style*="position: fixed"]');
    expect(markers.length).toBeGreaterThanOrEqual(1);
  });

  // -------------------------------------------------------------------------
  // 2. Marker is removed after the 250 ms timeout
  // -------------------------------------------------------------------------
  it("removes the marker after MARKER_DURATION_MS (250 ms)", () => {
    render(
      <div>
        <HitMarker />
        <button>Action</button>
      </div>,
    );

    const btn = screen.getByRole("button", { name: "Action" });
    act(() => {
      clickAt(btn);
    });

    // Marker should exist before the timeout fires.
    expect(
      document.querySelectorAll('div[style*="position: fixed"]').length,
    ).toBeGreaterThanOrEqual(1);

    // Advance past the 250 ms timeout.
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(
      document.querySelectorAll('div[style*="position: fixed"]').length,
    ).toBe(0);
  });

  // -------------------------------------------------------------------------
  // 3. Audio is NOT played when prefersReducedMotion is true
  // -------------------------------------------------------------------------
  it("does not play audio when prefersReducedMotion is true", () => {
    mockUsePrefersReducedMotion.mockReturnValue(true);

    render(
      <div>
        <HitMarker />
        <button>Action</button>
      </div>,
    );

    // With reduced-motion the component returns null, so there is no click
    // listener.  Fire anyway to confirm play is never called.
    const btn = screen.getByRole("button", { name: "Action" });
    act(() => {
      clickAt(btn);
    });

    expect(mockPlay).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // 4. Audio IS played when prefersReducedMotion is false
  // -------------------------------------------------------------------------
  it("plays audio on click when motion is allowed", () => {
    render(
      <div>
        <HitMarker />
        <button>Action</button>
      </div>,
    );

    act(() => {
      clickAt(screen.getByRole("button", { name: "Action" }));
    });

    expect(mockPlay).toHaveBeenCalledTimes(1);
  });

  // -------------------------------------------------------------------------
  // 5. Event delegation – <a> triggers a marker
  // -------------------------------------------------------------------------
  it("spawns a marker when an <a> element is clicked", () => {
    render(
      <div>
        <HitMarker />
        <a href="#test">Link</a>
      </div>,
    );

    act(() => {
      clickAt(screen.getByRole("link", { name: "Link" }));
    });

    expect(
      document.querySelectorAll('div[style*="position: fixed"]').length,
    ).toBeGreaterThanOrEqual(1);
  });

  // -------------------------------------------------------------------------
  // 6. Event delegation – <button> triggers a marker
  // -------------------------------------------------------------------------
  it("spawns a marker when a <button> element is clicked", () => {
    render(
      <div>
        <HitMarker />
        <button>Click me</button>
      </div>,
    );

    act(() => {
      clickAt(screen.getByRole("button", { name: "Click me" }));
    });

    expect(
      document.querySelectorAll('div[style*="position: fixed"]').length,
    ).toBeGreaterThanOrEqual(1);
  });

  // -------------------------------------------------------------------------
  // 7. Event delegation – [role="button"] triggers a marker
  // -------------------------------------------------------------------------
  it("spawns a marker when a [role='button'] element is clicked", () => {
    render(
      <div>
        <HitMarker />
        <div role="button">Custom button</div>
      </div>,
    );

    act(() => {
      clickAt(screen.getByRole("button", { name: "Custom button" }));
    });

    expect(
      document.querySelectorAll('div[style*="position: fixed"]').length,
    ).toBeGreaterThanOrEqual(1);
  });

  // -------------------------------------------------------------------------
  // 8. Clicks on non-interactive elements do NOT spawn a marker
  // -------------------------------------------------------------------------
  it("does not spawn a marker when a plain <div> is clicked", () => {
    render(
      <div>
        <HitMarker />
        <div data-testid="plain-div">Not interactive</div>
      </div>,
    );

    act(() => {
      clickAt(screen.getByTestId("plain-div"));
    });

    expect(
      document.querySelectorAll('div[style*="position: fixed"]').length,
    ).toBe(0);
  });

  // -------------------------------------------------------------------------
  // 9. Component renders null when prefersReducedMotion is true
  // -------------------------------------------------------------------------
  it("renders null (no SVG markers) when prefersReducedMotion is true", () => {
    mockUsePrefersReducedMotion.mockReturnValue(true);

    const { container } = render(<HitMarker />);

    // With reduced motion, HitMarker returns null so nothing is rendered.
    expect(container).toBeEmptyDOMElement();
  });
});
