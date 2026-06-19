import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { GitHubCommitPulse } from "@/components/home/GitHubCommitPulse";
import { caseStudies } from "@/content/case-studies";
import { siteConfig } from "@/content/site";
import ArchitectureDiagramWrapper from "@/components/work/ArchitectureDiagramWrapper";
import styles from "./work.module.css";

type CaseStudyMedia = NonNullable<(typeof caseStudies)[number]["media"]>[number];
type StructuredDiagramMedia = CaseStudyMedia & {
  type: "diagram";
  diagramNodes: Record<string, unknown>[];
  diagramEdges: Record<string, unknown>[];
};

const WORK_DESCRIPTION =
  "Selected projects spanning product engineering, systems automation, and enterprise platform work.";

function GitHubCommitPulseSkeleton() {
  return (
    <>
      <style>{`
        .pulse-skeleton {
          background: var(--color-surface);
          animation: pulse-skeleton-fade 1.8s ease-in-out infinite;
        }

        @keyframes pulse-skeleton-fade {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 0.9; }
        }
      `}</style>
      <div
        className="pulse-skeleton"
        aria-hidden="true"
        style={{
          padding: "var(--space-8)",
          minHeight: "20rem",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
        }}
      />
    </>
  );
}

const KEY_OUTCOMES: Record<string, string> = {
  "form-factor":
    "Real-time form analysis via ARKit body tracking, built end-to-end solo",
  "orwell-scraper": "~90% access rate, 26k labeled assets",
  "palo-alto": "~20% better pre-merge detection, ~85% incident replay",
  portus: "5 MCP tools, TUI dashboard, signal-safe cleanup",
};

function hasStructuredDiagram(
  media: CaseStudyMedia
): media is StructuredDiagramMedia {
  return (
    media.type === "diagram" &&
    "diagramNodes" in media &&
    "diagramEdges" in media &&
    Array.isArray(media.diagramNodes) &&
    Array.isArray(media.diagramEdges)
  );
}

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
  const flagship = caseStudies.find((cs) => cs.slug === "form-factor");
  const secondary = caseStudies.filter((cs) => cs.slug !== "form-factor");

  const diagramMedia = flagship?.media?.find(hasStructuredDiagram);

  return (
    <section className="container" aria-label="Work">
      <div className={styles.pageHeader}>
        <h1 data-testid="work-page-title" className={styles.pageTitle}>
          Work
        </h1>
        <p className={styles.pageSubtitle}>{WORK_DESCRIPTION}</p>
      </div>

      <section
        aria-label="Project list"
        data-testid="work-grid"
        className={styles.workGrid}
      >
        {flagship && (
          <Link
            href={`/work/${flagship.slug}`}
            data-testid={`case-study-card-${flagship.slug}`}
            className={styles.featuredHero}
            aria-label={`View ${flagship.title} case study`}
          >
            <div className={styles.featuredInner}>
              <div className={styles.featuredContent}>
                <span className={styles.featuredLabel}>
                  <span className={styles.featuredLabelDot} />
                  Flagship Project
                </span>
                <h2 className={styles.featuredTitle}>{flagship.title}</h2>
                <p className={styles.featuredMeta}>
                  {flagship.role} &middot; {flagship.period}
                </p>
                <p className={styles.featuredSummary}>{flagship.summary}</p>
                <div className={styles.featuredMetric}>
                  <span className={styles.featuredMetricIcon}>&#x25C8;</span>
                  <span className={styles.featuredMetricText}>
                    {KEY_OUTCOMES[flagship.slug]}
                  </span>
                </div>
                <div className={styles.featuredTechStack}>
                  {flagship.techStack.map((tech) => (
                    <span key={tech} className={styles.featuredTechPill}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.featuredSide}>
                {diagramMedia?.diagramNodes && diagramMedia.diagramEdges && (
                  <div
                    className={styles.miniDiagramPreview}
                    data-testid="work-diagram-preview"
                  >
                    <p className={styles.miniDiagramLabel}>Architecture</p>
                    <div className={styles.miniDiagramFlow}>
                      <ArchitectureDiagramWrapper
                        nodes={diagramMedia.diagramNodes}
                        edges={diagramMedia.diagramEdges}
                        height={280}
                      />
                    </div>
                  </div>
                )}
                <span className={styles.cardArrow}>
                  Read case study &#8594;
                </span>
              </div>
            </div>
          </Link>
        )}

        <p className={styles.tierLabel}>More Projects</p>

        <div className={styles.secondaryGrid}>
          {secondary.map((cs) => (
            <Link
              key={cs.slug}
              href={`/work/${cs.slug}`}
              data-testid={`case-study-card-${cs.slug}`}
              className={`matrix-card ${styles.projectCard}`}
            >
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{cs.title}</h3>
                {cs.disclosure.anonymizationLevel === "anonymized" && (
                  <span className="steel-badge">Anonymized</span>
                )}
              </div>

              <p className={styles.cardMeta}>
                {cs.role} &middot; {cs.period}
              </p>

              <p className={styles.cardSummary}>{cs.summary}</p>

              <div className={styles.cardMetric}>
                <span className={styles.cardMetricIcon}>&#x25C8;</span>
                <span className={styles.cardMetricText}>
                  {KEY_OUTCOMES[cs.slug]}
                </span>
              </div>

              <div className={styles.techStack}>
                {cs.techStack.map((tech) => (
                  <span key={tech} className={styles.techPill}>
                    {tech}
                  </span>
                ))}
              </div>

              <span className={styles.cardArrow}>Read case study &#8594;</span>
            </Link>
          ))}
        </div>
      </section>

      <section
        className={styles.telemetrySection}
        aria-label="Commit telemetry"
        data-testid="work-telemetry"
      >
        <Suspense fallback={<GitHubCommitPulseSkeleton />}>
          <GitHubCommitPulse />
        </Suspense>
      </section>
    </section>
  );
}
