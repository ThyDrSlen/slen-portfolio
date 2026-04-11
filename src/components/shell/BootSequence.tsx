"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  const overlayRef = useRef<HTMLDivElement>(null);

  const dismiss = useCallback(() => {
    setFadingOut(true);
    setUnmounted(true);
    setFlag();
  }, [setFlag]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setFlag();
    }
  }, [prefersReducedMotion, setFlag]);

  useEffect(() => {
    const active = !seen && !prefersReducedMotion && !unmounted;

    if (active) {
      overlayRef.current?.focus();
    }

    const handleKeyDown = () => {
      if (active) dismiss();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [prefersReducedMotion, seen, unmounted, dismiss]);

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
    <section
      data-testid="boot-sequence"
      ref={overlayRef}
      aria-label="Boot sequence overlay"
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
      <button
        type="button"
        onClick={dismiss}
        style={{
          position: "absolute",
          left: "50%",
          bottom: "1.5rem",
          transform: "translateX(-50%)",
          background: "transparent",
          border: 0,
          color: "var(--color-text-muted)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: "pointer",
          padding: 0,
        }}
      >
        Press any key to skip
      </button>
      <style>{`@keyframes boot-blink { 50% { opacity: 0; } }`}</style>
    </section>
  );
}
