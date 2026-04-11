"use client";

import { useCallback, useEffect, useState, createElement } from "react";
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

  useEffect(() => {
    if (!started || prefersReducedMotion) return;

    if (charCount < text.length) {
      const timer = setTimeout(() => {
        setCharCount((c) => c + 1);
      }, motionConfig.typewriterCharDelayMs);
      return () => clearTimeout(timer);
    }

    const hideTimer = setTimeout(() => {
      setCursorVisible(false);
    }, 1000);
    return () => clearTimeout(hideTimer);
  // Use full text string (not .length) so the effect resets when content changes
  }, [started, charCount, text, prefersReducedMotion]);

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
