"use client";

import { useState, useMemo } from "react";
import { type GitHubEvent } from "@/lib/github";
import { PulseAnimation } from "./PulseAnimation";

type Range = 7 | 30 | 90;

const RANGES: { key: Range; label: string }[] = [
  { key: 7, label: "7d" },
  { key: 30, label: "1m" },
  { key: 90, label: "3m" },
];

function computeWindow(events: GitHubEvent[], days: Range) {
  const now = new Date();
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const cutoffStr = cutoff.toISOString().split("T")[0];

  const dayMap = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    dayMap.set(d.toISOString().split("T")[0], 0);
  }

  let total = 0;
  for (const e of events) {
    if (e.date < cutoffStr) continue;
    total += e.commits;
    dayMap.set(e.date, (dayMap.get(e.date) ?? 0) + e.commits);
  }

  const commitsByDay = Array.from(dayMap.entries()).map(([date, count]) => ({
    date,
    count,
  }));

  let streak = 0;
  let foundActive = false;
  for (let i = commitsByDay.length - 1; i >= 0; i--) {
    if (commitsByDay[i].count > 0) {
      foundActive = true;
      streak++;
    } else if (foundActive) {
      break;
    }
  }

  return { commitsByDay, total, streak };
}

const rangeButtonStyle = (active: boolean): React.CSSProperties => ({
  padding: "var(--space-1) var(--space-2)",
  background: "transparent",
  color: active ? "var(--color-accent)" : "var(--color-text-muted)",
  border: "none",
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-xs)",
  cursor: "pointer",
  fontWeight: active ? 600 : 400,
  textDecoration: active ? "underline" : "none",
  textUnderlineOffset: "3px",
});

export function PulseDashboard({
  events,
  lastActive,
}: {
  events: GitHubEvent[];
  lastActive: string;
}) {
  const [range, setRange] = useState<Range>(7);

  const window = useMemo(() => computeWindow(events, range), [events, range]);

  const sampledDays = useMemo(() => {
    const days = window.commitsByDay;
    if (days.length <= 14) return days;
    const step = Math.ceil(days.length / 14);
    const sampled = days.filter((_, i) => i % step === 0);
    if (sampled[sampled.length - 1] !== days[days.length - 1]) {
      sampled.push(days[days.length - 1]);
    }
    return sampled;
  }, [window.commitsByDay]);

  return (
    <div
      data-testid="github-commit-pulse"
      style={{
        padding: "var(--space-8)",
        background: "var(--color-bg-elevated)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
          opacity: 0.5,
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--space-6)",
          flexWrap: "wrap",
          gap: "var(--space-2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "var(--space-3)" }}>
          <span
            className="mono"
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-accent)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              textShadow: "0 0 10px var(--color-accent-glow)",
            }}
          >
            ~/telemetry
          </span>
          <span
            className="mono"
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-text-muted)",
            }}
          >
            commit pulse
          </span>
        </div>

        <div
          data-testid="pulse-range-selector"
          style={{ display: "flex", gap: "var(--space-1)" }}
        >
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              data-testid={`pulse-range-${r.key}`}
              style={rangeButtonStyle(range === r.key)}
              onClick={() => setRange(r.key)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "var(--space-6)" }}>
        <PulseAnimation commitsByDay={sampledDays} />
      </div>

      <div
        style={{
          display: "flex",
          gap: "var(--space-8)",
          borderTop: "1px solid var(--color-border)",
          paddingTop: "var(--space-4)",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            className="mono"
            style={{
              fontSize: "var(--text-2xl)",
              fontWeight: 600,
              color: "var(--color-accent)",
              textShadow: "0 0 10px var(--color-accent-glow)",
            }}
          >
            {window.total}
          </div>
          <div
            className="mono"
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {range}d commits
          </div>
        </div>
        <div>
          <div
            className="mono"
            style={{
              fontSize: "var(--text-2xl)",
              fontWeight: 600,
              color: "var(--color-accent)",
              textShadow: "0 0 10px var(--color-accent-glow)",
            }}
          >
            {window.streak}d
          </div>
          <div
            className="mono"
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            streak
          </div>
        </div>
        <div>
          <div
            className="mono"
            style={{
              fontSize: "var(--text-2xl)",
              fontWeight: 600,
              color: "var(--color-accent)",
              textShadow: "0 0 10px var(--color-accent-glow)",
            }}
          >
            {lastActive}
          </div>
          <div
            className="mono"
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            last push
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
          <a
            href="https://github.com/ThyDrSlen"
            target="_blank"
            rel="noopener noreferrer"
            className="mono"
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-secondary)",
              textDecoration: "none",
              padding: "var(--space-2) var(--space-4)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
            }}
          >
            github.com/ThyDrSlen &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
