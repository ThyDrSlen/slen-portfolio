import { renderHook, act } from "@testing-library/react";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useSessionFlag } from "@/hooks/useSessionFlag";

describe("usePrefersReducedMotion", () => {
  it("returns false by default", () => {
    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(false);
  });

  it("returns the server snapshot during SSR", () => {
    function TestComponent() {
      const prefersReducedMotion = usePrefersReducedMotion();
      return createElement("span", null, String(prefersReducedMotion));
    }

    expect(renderToString(createElement(TestComponent))).toContain("false");
  });
});

describe("useSessionFlag", () => {
  it("returns false and a setter when the key is not set", () => {
    const { result } = renderHook(() => useSessionFlag("missing-flag"));

    expect(result.current[0]).toBe(false);
    expect(result.current[1]).toBeTypeOf("function");
  });

  it("updates sessionStorage and returns true after setting the flag", () => {
    const { result } = renderHook(() => useSessionFlag("visit-flag"));

    act(() => {
      result.current[1]();
    });

    expect(sessionStorage.getItem("visit-flag")).toBe("1");
    expect(result.current[0]).toBe(true);
  });

  it("keeps multiple hook keys independent", () => {
    const first = renderHook(() => useSessionFlag("first-flag"));
    const second = renderHook(() => useSessionFlag("second-flag"));

    act(() => {
      first.result.current[1]();
    });

    expect(first.result.current[0]).toBe(true);
    expect(second.result.current[0]).toBe(false);
    expect(sessionStorage.getItem("first-flag")).toBe("1");
    expect(sessionStorage.getItem("second-flag")).toBeNull();
  });

  it("handles sessionStorage read errors gracefully", () => {
    const getItemSpy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("sessionStorage unavailable");
    });

    const { result } = renderHook(() => useSessionFlag("error-flag"));

    expect(result.current[0]).toBe(false);

    getItemSpy.mockRestore();
  });
});
