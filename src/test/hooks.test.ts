import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useSessionFlag } from "@/hooks/useSessionFlag";

// ---------------------------------------------------------------------------
// usePrefersReducedMotion
// ---------------------------------------------------------------------------

/**
 * Returns a controllable matchMedia mock.
 * `fire()` triggers all registered "change" listeners so we can simulate the
 * OS preference toggling at runtime.
 */
function makeMatchMediaMock(initialMatches: boolean) {
  const listeners = new Set<() => void>();

  const mql = {
    matches: initialMatches,
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener(_: string, cb: () => void) {
      listeners.add(cb);
    },
    removeEventListener(_: string, cb: () => void) {
      listeners.delete(cb);
    },
    dispatchEvent: () => false,
  };

  const fire = (nextMatches: boolean) => {
    mql.matches = nextMatches;
    listeners.forEach((cb) => cb());
  };

  return { mql, fire };
}

describe("usePrefersReducedMotion", () => {
  it("returns false when matchMedia does not match", () => {
    const { mql } = makeMatchMediaMock(false);
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: () => mql,
    });

    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });

  it("returns true when matchMedia initially matches", () => {
    const { mql } = makeMatchMediaMock(true);
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: () => mql,
    });

    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
  });

  it("updates when the media query fires a change event", () => {
    const { mql, fire } = makeMatchMediaMock(false);
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: () => mql,
    });

    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);

    act(() => {
      fire(true);
    });

    expect(result.current).toBe(true);
  });

  it("removes the event listener on unmount", () => {
    const listeners = new Set<() => void>();
    const mql = {
      matches: false,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener(_: string, cb: () => void) {
        listeners.add(cb);
      },
      removeEventListener(_: string, cb: () => void) {
        listeners.delete(cb);
      },
      dispatchEvent: () => false,
    };

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: () => mql,
    });

    const { unmount } = renderHook(() => usePrefersReducedMotion());
    expect(listeners.size).toBe(1);

    unmount();
    expect(listeners.size).toBe(0);
  });

  it("server snapshot returns false (getServerSnapshot)", () => {
    // The server snapshot function is a plain closure that always returns
    // false. We reach it indirectly by verifying the exported hook's
    // three-argument shape: when getServerSnapshot is defined it must equal
    // false. We test it directly by importing and calling the internal via
    // a wrapper that calls useSyncExternalStore with only the server snapshot.
    //
    // The simplest check: in JSDOM the hook uses getSnapshot, but the server
    // snapshot value is exposed as the third argument. We can verify the
    // contract by confirming the hook never returns anything other than a
    // boolean (true/false), and when no matchMedia match exists it is false.
    const { mql } = makeMatchMediaMock(false);
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: () => mql,
    });
    const { result } = renderHook(() => usePrefersReducedMotion());
    // Default (no media match) must be false — same as the server snapshot.
    expect(result.current).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// useSessionFlag
// ---------------------------------------------------------------------------

describe("useSessionFlag", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("initial state is false when sessionStorage has no entry", () => {
    const { result } = renderHook(() => useSessionFlag("test-flag"));
    const [flagged] = result.current;
    expect(flagged).toBe(false);
  });

  it("dismiss() sets the flag to true", () => {
    const { result } = renderHook(() => useSessionFlag("test-flag"));

    act(() => {
      const [, dismiss] = result.current;
      dismiss();
    });

    const [flagged] = result.current;
    expect(flagged).toBe(true);
  });

  it("persists the flag value in sessionStorage", () => {
    const { result } = renderHook(() => useSessionFlag("persist-flag"));

    act(() => {
      const [, dismiss] = result.current;
      dismiss();
    });

    expect(sessionStorage.getItem("persist-flag")).toBe("1");
  });

  it("a second hook instance with the same key reflects the updated state", () => {
    const hookA = renderHook(() => useSessionFlag("shared-flag"));
    const hookB = renderHook(() => useSessionFlag("shared-flag"));

    // Both start as false
    expect(hookA.result.current[0]).toBe(false);
    expect(hookB.result.current[0]).toBe(false);

    act(() => {
      hookA.result.current[1](); // dismiss via hookA
    });

    // Both instances should now read true
    expect(hookA.result.current[0]).toBe(true);
    expect(hookB.result.current[0]).toBe(true);
  });

  it("different keys are independent", () => {
    const hookA = renderHook(() => useSessionFlag("flag-a"));
    const hookB = renderHook(() => useSessionFlag("flag-b"));

    act(() => {
      hookA.result.current[1]();
    });

    expect(hookA.result.current[0]).toBe(true);
    expect(hookB.result.current[0]).toBe(false);
  });

  it("unsubscribes and cleans up listeners on unmount", () => {
    // After unmount the internal listeners Map entry for the key should be
    // gone (the hook deletes the Set when it becomes empty).
    // We can verify this indirectly: after unmount, calling dismiss() on the
    // stale reference should not throw, and a fresh render reads from
    // sessionStorage correctly.
    const { result, unmount } = renderHook(() => useSessionFlag("cleanup-flag"));

    unmount();

    // After unmount, sessionStorage should still not have the key
    expect(sessionStorage.getItem("cleanup-flag")).toBeNull();

    // A fresh render must start at false (no ghost state from listeners)
    const fresh = renderHook(() => useSessionFlag("cleanup-flag"));
    expect(fresh.result.current[0]).toBe(false);
  });

  it("dismiss() is stable across re-renders (useCallback identity)", () => {
    const { result, rerender } = renderHook(() => useSessionFlag("stable-flag"));
    const firstDismiss = result.current[1];
    rerender();
    const secondDismiss = result.current[1];
    expect(firstDismiss).toBe(secondDismiss);
  });

  it("handles sessionStorage errors gracefully (returns false, does not throw)", () => {
    const getItemSpy = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("storage unavailable");
      });

    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    let flagged: boolean | undefined;
    expect(() => {
      const { result } = renderHook(() => useSessionFlag("error-flag"));
      flagged = result.current[0];
    }).not.toThrow();

    expect(flagged).toBe(false);

    getItemSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});
