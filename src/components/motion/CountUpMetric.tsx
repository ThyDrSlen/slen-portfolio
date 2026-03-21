"use client";

import { useRef, useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motionConfig } from "@/content/system";

interface CountUpMetricProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

function easeOutExpo(t: number): number {
  return 1 - Math.pow(2, -10 * t);
}

export function CountUpMetric({
  target,
  suffix = "",
  prefix = "",
  duration = motionConfig.countUpDurationMs,
  className,
  style,
}: CountUpMetricProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(0);
  const [started, setStarted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
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
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!started || prefersReducedMotion) return;

    let rafId: number;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedValue = Math.round(easeOutExpo(progress) * target);

      setCurrent(easedValue);

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [started, target, duration, prefersReducedMotion]);

  const displayValue = prefersReducedMotion ? target : current;

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
