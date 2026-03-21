import { fetchGitHubPulse } from "@/lib/github";
import { PulseAnimation } from "./PulseAnimation";

export async function GitHubCommitPulse() {
  const data = await fetchGitHubPulse("ThyDrSlen");

  if (!data) {
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
        <p
          className="mono"
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
            marginBottom: "var(--space-4)",
          }}
        >
          signal unavailable {"// "}check GitHub
        </p>
        <a
          href="https://github.com/ThyDrSlen"
          target="_blank"
          rel="noopener noreferrer"
          className="mono"
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-accent)",
            textDecoration: "none",
          }}
        >
          github.com/ThyDrSlen &rarr;
        </a>
      </div>
    );
  }

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
          alignItems: "baseline",
          gap: "var(--space-3)",
          marginBottom: "var(--space-6)",
        }}
      >
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

      <div style={{ marginBottom: "var(--space-6)" }}>
        <PulseAnimation commitsByDay={data.commitsByDay} />
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
            {data.totalCommits7d}
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
            7d commits
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
            {data.streak}d
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
            {data.lastActive}
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
