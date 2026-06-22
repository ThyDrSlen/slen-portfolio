import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume",
  description: "View Fabrizio Corrales' resume in a dedicated tab with site metadata intact.",
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <div
      className="container"
      style={{
        display: "grid",
        gap: "var(--space-6)",
        minHeight: "calc(100vh - 16rem)",
        paddingBottom: "var(--space-12)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "var(--space-4)",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            className="mono"
            style={{
              color: "var(--color-accent)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: "var(--space-2)",
            }}
          >
            Resume
          </p>
          <h1 style={{ marginBottom: "var(--space-2)" }}>Fabrizio Corrales</h1>
          <p style={{ color: "var(--color-text-secondary)", maxWidth: "42rem" }}>
            Resume access from a real site page, keeping the portfolio favicon,
            title, and metadata available alongside direct PDF access.
          </p>
        </div>

        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="steel-button"
          aria-label="Open resume PDF directly in a new tab"
        >
          Open PDF directly
        </a>
      </div>

      <iframe
        src="/resume.pdf"
        title="Fabrizio Corrales resume"
        style={{
          width: "100%",
          minHeight: "75vh",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          background: "var(--color-surface)",
          boxShadow: "0 0 20px var(--color-accent-glow)",
        }}
      />
    </div>
  );
}
