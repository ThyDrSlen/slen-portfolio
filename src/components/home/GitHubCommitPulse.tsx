import { fetchGitHubPulse } from "@/lib/github";
import { PulseDashboard } from "./PulseDashboard";

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

  return <PulseDashboard events={data.events} lastActive={data.lastActive} />;
}
