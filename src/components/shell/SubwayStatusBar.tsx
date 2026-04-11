"use client";

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import { useSessionFlag } from "@/hooks/useSessionFlag";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { subwayConfig } from "@/content/system";

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function getNycTime(): string {
  return timeFormatter.format(new Date());
}

function subscribeClock(callback: () => void) {
  const id = setInterval(callback, 1000);
  return () => clearInterval(id);
}

export function SubwayStatusBar() {
  const [dismissed, dismiss] = useSessionFlag("subway-dismissed");
  const prefersReducedMotion = usePrefersReducedMotion();
  const [messageIndex, setMessageIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const nycTime = useSyncExternalStore(subscribeClock, getNycTime, () => "");

  useEffect(() => {
    if (prefersReducedMotion) return;

    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setMessageIndex(
          (prev) => (prev + 1) % subwayConfig.statusMessages.length
        );
        setFading(false);
      }, 300);
    }, subwayConfig.cycleIntervalMs);

    return () => clearInterval(id);
  }, [prefersReducedMotion]);

  const dismissedRef = useRef(dismissed);
  dismissedRef.current = dismissed;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !dismissedRef.current) dismiss();
    },
    [dismiss]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (dismissed) return null;

  return (
    <output
      data-testid="subway-status-bar"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: 40,
        background: "var(--color-bg)",
        borderTop: "1px solid var(--color-border)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.75rem",
        padding: "0 var(--space-6)",
        display: "flex",
        alignItems: "center",
        gap: "var(--space-4)",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: subwayConfig.lineColor,
          color: "#fff",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 700,
          fontSize: "0.8rem",
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        {subwayConfig.lineName}
      </span>

      <span
        style={{
          flex: 1,
          color: "var(--color-text-secondary)",
          opacity: fading ? 0 : 1,
          transition: prefersReducedMotion ? "none" : "opacity 300ms ease",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {subwayConfig.statusMessages[messageIndex]}
      </span>

      <span
        style={{
          color: "var(--color-accent)",
          textShadow: "0 0 8px var(--color-accent-glow)",
          letterSpacing: "0.1em",
          flexShrink: 0,
        }}
      >
        {nycTime}
      </span>

      <button
        type="button"
        data-testid="subway-dismiss"
        onClick={dismiss}
        aria-label="Dismiss status bar"
        style={{
          background: "none",
          border: "none",
          color: "var(--color-text-secondary)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          cursor: "pointer",
          padding: "0 0 0 var(--space-3)",
          opacity: 0.5,
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        ✕
      </button>
    </output>
  );
}
