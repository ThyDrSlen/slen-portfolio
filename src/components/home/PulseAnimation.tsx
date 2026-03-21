"use client";

import { useEffect, useRef, useState } from "react";
import { type GitHubPulseData } from "@/lib/github";

function buildPoints(
  commitsByDay: GitHubPulseData["commitsByDay"],
  width: number,
  height: number,
  padX: number,
  padY: number
): { x: number; y: number }[] {
  const maxCount = Math.max(...commitsByDay.map((d) => d.count), 1);
  const usableW = width - padX * 2;
  const usableH = height - padY * 2;

  return commitsByDay.map((d, i) => ({
    x: padX + (i / (commitsByDay.length - 1)) * usableW,
    y: padY + usableH - (d.count / maxCount) * usableH,
  }));
}

export function PulseAnimation({
  commitsByDay,
}: {
  commitsByDay: GitHubPulseData["commitsByDay"];
}) {
  const W = 400;
  const H = 120;
  const PAD_X = 20;
  const PAD_Y = 16;
  const [drawn, setDrawn] = useState(false);
  const lineRef = useRef<SVGPolylineElement>(null);

  const points = buildPoints(commitsByDay, W, H, PAD_X, PAD_Y);
  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");

  const totalLength = points.reduce((acc, p, i) => {
    if (i === 0) return 0;
    const prev = points[i - 1];
    return acc + Math.sqrt((p.x - prev.x) ** 2 + (p.y - prev.y) ** 2);
  }, 0);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      requestAnimationFrame(() => setDrawn(true));
      return;
    }
    const raf = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: "block" }}
      role="img"
      aria-label="GitHub commit activity over the last 7 days"
    >
      <defs>
        <filter id="pulse-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {points.map((p, i) => (
        <line
          key={`grid-${commitsByDay[i].date}`}
          x1={p.x}
          y1={PAD_Y}
          x2={p.x}
          y2={H - PAD_Y}
          stroke="var(--color-border)"
          strokeWidth="0.5"
          opacity="0.4"
        />
      ))}

      <line
        x1={PAD_X}
        y1={H - PAD_Y}
        x2={W - PAD_X}
        y2={H - PAD_Y}
        stroke="var(--color-border)"
        strokeWidth="0.5"
        opacity="0.4"
      />

      <polyline
        points={polyline}
        fill="none"
        stroke="#00ff41"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.15"
      />

      <polyline
        ref={lineRef}
        points={polyline}
        fill="none"
        stroke="#00ff41"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        filter="url(#pulse-glow)"
        style={{
          strokeDasharray: totalLength,
          strokeDashoffset: drawn ? 0 : totalLength,
          transition: "stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {points.map((p, i) => (
        <g key={`dot-${commitsByDay[i].date}`}>
          <circle
            cx={p.x}
            cy={p.y}
            r="6"
            fill="rgba(0,255,65,0.15)"
            style={{
              opacity: drawn ? 1 : 0,
              transform: drawn ? "scale(1)" : "scale(0)",
              transformOrigin: `${p.x}px ${p.y}px`,
              transition: `opacity 0.4s ${0.3 + i * 0.15}s, transform 0.4s ${0.3 + i * 0.15}s`,
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
          <circle
            cx={p.x}
            cy={p.y}
            r="3"
            fill="#00ff41"
            style={{
              opacity: drawn ? 1 : 0,
              transform: drawn ? "scale(1)" : "scale(0)",
              transformOrigin: `${p.x}px ${p.y}px`,
              transition: `opacity 0.4s ${0.3 + i * 0.15}s, transform 0.4s ${0.3 + i * 0.15}s`,
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        </g>
      ))}

      {points.map((p, i) => (
        <text
          key={`label-${commitsByDay[i].date}`}
          x={p.x}
          y={H - 2}
          textAnchor="middle"
          fill="var(--color-text-muted)"
          fontSize="8"
          fontFamily="var(--font-mono)"
          opacity="0.6"
        >
          {commitsByDay[i].date.slice(5)}
        </text>
      ))}
    </svg>
  );
}
