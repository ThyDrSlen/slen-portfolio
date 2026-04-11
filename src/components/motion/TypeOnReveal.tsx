"use client";

import { useCallback, useEffect, useRef, useState, createElement } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motionConfig } from "@/content/system";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

interface TypeOnRevealProps {
  text: string;
  tag?: Tag;
  className?: string;
  style?: React.CSSProperties;
}

export function TypeOnReveal({
  text,
  tag = "span",
  className,
  style,
}: TypeOnRevealProps) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Fix #82: keep a ref so the timer callback always reads the latest delay
  // value without needing to re-create the effect (avoids stale closure on
  // hot updates or future prop-driven delay config).
  const delayRef = useRef(motionConfig.typewriterCharDelayMs);
  useEffect(() => {
    delayRef.current = motionConfig.typewriterCharDelayMs;
  });

  const callbackRef = useCallback((node: HTMLElement | null) => {
    setEl(node);
  }, []);

  useEffect(() => {
    if (!el || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [el, prefersReducedMotion]);

  // Fix #96: reset charCount and cursor whenever `text` itself changes (not
  // just its length) so that equal-length text swaps always restart the
  // animation from the beginning.
  useEffect(() => {
    setCharCount(0);
    setCursorVisible(true);
  }, [text]);

  useEffect(() => {
    if (!started || prefersReducedMotion) return;

    if (charCount < text.length) {
      // Fix #82: read delay from ref so we always use the latest value.
      const timer = setTimeout(() => {
        setCharCount((c) => c + 1);
      }, delayRef.current);
      return () => clearTimeout(timer);
    }

    const hideTimer = setTimeout(() => {
      setCursorVisible(false);
    }, 1000);
    return () => clearTimeout(hideTimer);
  }, [started, charCount, text.length, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return createElement(tag, { className, style }, text);
  }

  const cursor = cursorVisible
    ? createElement("span", {
        style: {
          borderLeft: "2px solid var(--color-accent)",
          animation: "blink 1s step-end infinite",
          marginLeft: "-1px",
          paddingLeft: "1px",
        },
      })
    : null;

  const srOnly = createElement("span", {
    style: {
      position: "absolute",
      width: "1px",
      height: "1px",
      padding: 0,
      margin: "-1px",
      overflow: "hidden",
      clip: "rect(0,0,0,0)",
      whiteSpace: "nowrap",
      border: 0,
    },
  }, text);

  return createElement(
    tag,
    { ref: callbackRef, className, style },
    srOnly,
    createElement("span", { "aria-hidden": "true" }, text.slice(0, charCount), cursor),
  );
}
