"use client";

import { useState, useMemo, useCallback, memo } from "react";
import { type GitHubEvent } from "@/lib/github";
import { PulseAnimation } from "./PulseAnimation";

type Range = 7 | 30 | 90;

const RANGES: { key: Range; label: string }[] = [
  { key: 7, label: "7d" },
  { key: 30, label: "1m" },
  { key: 90, label: "3m" },
];

// Static style objects extracted outside the component to avoid re-creation on every render
const CONTAINER_STYLE: React.CSSProperties = {
  padding: "var(--space-8)",
  background: "var(--color-bg-elevated)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-lg)",
  position: "relative",
  overflow: "hidden",
};

const ACCENT_LINE_STYLE: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: "1px",
  background:
    "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
  opacity: 0.5,
};

const HEADER_ROW_STYLE: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "var(--space-6)",
  flexWrap: "wrap",
  gap: "var(--space-2)",
};

const TITLE_GROUP_STYLE: React.CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  gap: "var(--space-3)",
};

const TITLE_ACCENT_STYLE: React.CSSProperties = {
  fontSize: "var(--text-xs)",
  color: "var(--color-accent)",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  textShadow: "0 0 10px var(--color-accent-glow)",
};

const TITLE_LABEL_STYLE: React.CSSProperties = {
  fontSize: "var(--text-xs)",
  color: "var(--color-text-muted)",
};

const RANGE_SELECTOR_STYLE: React.CSSProperties = {
  display: "flex",
  gap: "var(--space-1)",
};

const PULSE_WRAPPER_STYLE: React.CSSProperties = {
  marginBottom: "var(--space-6)",
};

const STATS_ROW_STYLE: React.CSSProperties = {
  display: "flex",
  gap: "var(--space-8)",
  borderTop: "1px solid var(--color-border)",
  paddingTop: "var(--space-4)",
  flexWrap: "wrap",
};

const STAT_VALUE_STYLE: React.CSSProperties = {
  fontSize: "var(--text-2xl)",
  fontWeight: 600,
  color: "var(--color-accent)",
  textShadow: "0 0 10px var(--color-accent-glow)",
};

const STAT_LABEL_STYLE: React.CSSProperties = {
  fontSize: "var(--text-xs)",
  color: "var(--color-text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
};

const GITHUB_LINK_WRAPPER_STYLE: React.CSSProperties = {
  marginLeft: "auto",
  display: "flex",
  alignItems: "center",
};

const GITHUB_LINK_STYLE: React.CSSProperties = {
  fontSize: "var(--text-sm)",
  color: "var(--color-text-secondary)",
  textDecoration: "none",
  padding: "var(--space-2) var(--space-4)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-md)",
};

const RANGE_BTN_BASE: React.CSSProperties = {
  padding: "var(--space-1) var(--space-2)",
  background: "transparent",
  border: "none",
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-xs)",
  cursor: "pointer",
};

const RANGE_BTN_ACTIVE: React.CSSProperties = {
  ...RANGE_BTN_BASE,
  color: "var(--color-accent)",
  fontWeight: 600,
  textDecoration: "underline",
  textUnderlineOffset: "3px",
};

const RANGE_BTN_INACTIVE: React.CSSProperties = {
  ...RANGE_BTN_BASE,
  color: "var(--color-text-muted)",
  fontWeight: 400,
  textDecoration: "none",
};

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

export const PulseDashboard = memo(function PulseDashboard({
  events,
  lastActive,
}: {
  events: GitHubEvent[];
  lastActive: string;
}) {
  const [range, setRange] = useState<Range>(7);

  const handleRangeClick = useCallback((key: Range) => setRange(key), []);

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
      style={CONTAINER_STYLE}
    >
      <div style={ACCENT_LINE_STYLE} />

      <div style={HEADER_ROW_STYLE}>
        <div style={TITLE_GROUP_STYLE}>
          <span
            className="mono"
            style={TITLE_ACCENT_STYLE}
          >
            ~/telemetry
          </span>
          <span
            className="mono"
            style={TITLE_LABEL_STYLE}
          >
            commit pulse
          </span>
        </div>

        <div
          data-testid="pulse-range-selector"
          style={RANGE_SELECTOR_STYLE}
        >
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              data-testid={`pulse-range-${r.key}`}
              aria-pressed={range === r.key}
              style={range === r.key ? RANGE_BTN_ACTIVE : RANGE_BTN_INACTIVE}
              onClick={() => handleRangeClick(r.key)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div style={PULSE_WRAPPER_STYLE}>
        <PulseAnimation commitsByDay={sampledDays} />
      </div>

      <div style={STATS_ROW_STYLE}>
        <div>
          <div
            className="mono"
            style={STAT_VALUE_STYLE}
          >
            {window.total}
          </div>
          <div
            className="mono"
            style={STAT_LABEL_STYLE}
          >
            {range}d commits
          </div>
        </div>
        <div>
          <div
            className="mono"
            style={STAT_VALUE_STYLE}
          >
            {window.streak}d
          </div>
          <div
            className="mono"
            style={STAT_LABEL_STYLE}
          >
            streak
          </div>
        </div>
        <div>
          <div
            className="mono"
            style={STAT_VALUE_STYLE}
          >
            {lastActive}
          </div>
          <div
            className="mono"
            style={STAT_LABEL_STYLE}
          >
            last push
          </div>
        </div>
        <div style={GITHUB_LINK_WRAPPER_STYLE}>
          <a
            href="https://github.com/ThyDrSlen"
            target="_blank"
            rel="noopener noreferrer"
            className="mono"
            style={GITHUB_LINK_STYLE}
          >
            github.com/ThyDrSlen &rarr;
          </a>
        </div>
      </div>
    </div>
  );
});
