"use client";

import { useState, useEffect } from "react";
import { useSessionFlag } from "@/hooks/useSessionFlag";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { bootLines, motionConfig } from "@/content/system";

const FADE_DURATION_MS = 500;

export function BootSequence() {
  const [seen, setFlag] = useSessionFlag("boot-seen");
  const prefersReducedMotion = usePrefersReducedMotion();
  const [visibleCount, setVisibleCount] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);
  const [unmounted, setUnmounted] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setFlag();
    }
  }, [prefersReducedMotion, setFlag]);

  useEffect(() => {
    if (seen || prefersReducedMotion) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    bootLines.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleCount(i + 1);
        }, motionConfig.bootLineDelayMs * (i + 1))
      );
    });

    timers.push(
      setTimeout(() => {
        setFadingOut(true);
      }, motionConfig.bootTotalDurationMs)
    );

    timers.push(
      setTimeout(() => {
        setUnmounted(true);
        setFlag();
      }, motionConfig.bootTotalDurationMs + FADE_DURATION_MS)
    );

    return () => timers.forEach(clearTimeout);
  }, [seen, prefersReducedMotion, setFlag]);

  if (seen || prefersReducedMotion || unmounted) return null;

  return (
    <div
      data-testid="boot-sequence"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        background: "var(--color-bg)",
        fontFamily: "var(--font-mono)",
        color: "var(--color-accent)",
        fontSize: "0.875rem",
        padding: "2.5rem",
        opacity: fadingOut ? 0 : 1,
        transition: `opacity ${FADE_DURATION_MS}ms ease-out`,
        pointerEvents: fadingOut ? "none" : "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      aria-hidden="true"
    >
      {bootLines.slice(0, visibleCount).map((line, i) => {
        const isSystemReady = line === "System ready.";
        const isLastVisible = i === visibleCount - 1;

        return (
          <div
            key={line}
            style={{
              lineHeight: 1.8,
              color: isSystemReady ? "#fff" : "var(--color-accent)",
              textShadow: isSystemReady
                ? "0 0 12px var(--color-accent-glow-strong)"
                : "none",
            }}
          >
            <span style={{ color: "var(--color-accent-dim)", marginRight: "0.5rem" }}>
              {">"}
            </span>
            {line}
            {isLastVisible && (
              <span
                style={{
                  display: "inline-block",
                  width: "0.55rem",
                  height: "1em",
                  background: "var(--color-accent)",
                  marginLeft: "0.35rem",
                  verticalAlign: "text-bottom",
                  animation: "boot-blink 1s step-end infinite",
                }}
              />
            )}
          </div>
        );
      })}
      <style>{`@keyframes boot-blink { 50% { opacity: 0; } }`}</style>
    </div>
  );
}
