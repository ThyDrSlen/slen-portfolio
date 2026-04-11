import type { Metadata } from "next";
import Link from "next/link";
import { caseStudies } from "@/content/case-studies";
import { siteConfig } from "@/content/site";

const WORK_DESCRIPTION =
  "Selected projects spanning product engineering, systems automation, and enterprise platform work.";

export const metadata: Metadata = {
  title: "Work",
  description: WORK_DESCRIPTION,
  openGraph: {
    title: `Work | ${siteConfig.name}`,
    description: WORK_DESCRIPTION,
    url: `${siteConfig.url}/work`,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Work | ${siteConfig.name}`,
    description: WORK_DESCRIPTION,
  },
  alternates: { canonical: `${siteConfig.url}/work` },
};

export default function WorkIndex() {
  return (
    <div className="container">
      <h1 data-testid="work-page-title" style={{ marginBottom: "var(--space-4)" }}>
        Work
      </h1>
      <p
        style={{
          color: "var(--color-text-secondary)",
          marginBottom: "var(--space-12)",
          maxWidth: "40rem",
        }}
      >
        {WORK_DESCRIPTION}
      </p>

      <div
        data-testid="work-grid"
        style={{
          display: "grid",
          gap: "var(--space-6)",
        }}
      >
        {caseStudies.map((cs) => (
          <Link
            key={cs.slug}
            href={`/work/${cs.slug}`}
            data-testid={`case-study-card-${cs.slug}`}
            className="matrix-card"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
                marginBottom: "var(--space-3)",
                flexWrap: "wrap",
              }}
            >
              <h2 style={{ fontSize: "var(--text-xl)" }}>{cs.title}</h2>
              {cs.disclosure.anonymizationLevel === "anonymized" && (
                <span className="steel-badge">Anonymized</span>
              )}
              {cs.slug === "form-factor" && (
                <span className="accent-badge">Flagship</span>
              )}
            </div>

            <p
              className="mono"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-text-muted)",
                marginBottom: "var(--space-3)",
              }}
            >
              {cs.role} &middot; {cs.period}
            </p>

            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "var(--text-sm)",
                lineHeight: 1.6,
                marginBottom: "var(--space-4)",
              }}
            >
              {cs.summary}
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--space-2)",
              }}
            >
              {cs.techStack.map((tech) => (
                <span
                  key={tech}
                  className="mono"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    fontSize: "var(--text-xs)",
                    minHeight: 44,
                    padding: "0 var(--space-3)",
                    background: "var(--color-bg-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
