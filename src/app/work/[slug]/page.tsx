import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCaseStudyBySlug,
  getAllSlugs,
} from "@/content/case-studies";
import { siteConfig } from "@/content/site";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);
  if (!cs) return {};
  return {
    title: cs.title,
    description: cs.summary,
    alternates: { canonical: `/work/${cs.slug}` },
    openGraph: {
      title: `${cs.title} | ${siteConfig.name}`,
      description: cs.summary,
      type: "article",
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCaseStudyBySlug(slug);

  if (!cs) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: cs.title,
    description: cs.summary,
    author: {
      "@type": "Person",
      name: siteConfig.name,
    },
    url: `${siteConfig.url}/work/${cs.slug}`,
  };

  return (
    <article className="container" data-testid="case-study-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <section
        data-testid="case-study-hero"
        style={{ marginBottom: "var(--space-12)" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            marginBottom: "var(--space-4)",
            flexWrap: "wrap",
          }}
        >
          <h1>{cs.title}</h1>
          {cs.disclosure.anonymizationLevel === "anonymized" && (
            <span className="steel-badge">Anonymized</span>
          )}
        </div>
        <p
          className="mono"
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
            marginBottom: "var(--space-4)",
          }}
        >
          {cs.role} &middot; {cs.period}
        </p>
        <p
          style={{
            fontSize: "var(--text-lg)",
            color: "var(--color-text-secondary)",
            lineHeight: 1.7,
            maxWidth: "40rem",
          }}
        >
          {cs.summary}
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-2)",
            marginTop: "var(--space-6)",
          }}
        >
          {cs.techStack.map((tech) => (
            <span
              key={tech}
              className="mono"
              style={{
                fontSize: "var(--text-xs)",
                padding: "var(--space-1) var(--space-2)",
                background: "var(--color-bg-elevated)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
                color: "var(--color-text-muted)",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Disclaimer (if required) */}
      {cs.disclosure.requiresDisclaimer && cs.disclaimer && (
        <section
          data-testid="case-study-disclaimer"
          style={{
            padding: "var(--space-6)",
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            marginBottom: "var(--space-12)",
          }}
        >
          <p
            className="mono"
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: 600,
              color: "var(--color-steel)",
              marginBottom: "var(--space-2)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Disclosure
          </p>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-secondary)",
              lineHeight: 1.6,
            }}
          >
            {cs.disclaimer}
          </p>
        </section>
      )}

      {/* Problem */}
      <section
        data-testid="case-study-problem"
        style={{ marginBottom: "var(--space-12)" }}
      >
        <h2 style={{ marginBottom: "var(--space-4)" }}>The Problem</h2>
        <p
          style={{
            color: "var(--color-text-secondary)",
            lineHeight: 1.7,
            maxWidth: "40rem",
          }}
        >
          {cs.problem}
        </p>
      </section>

      {/* Role & Constraints */}
      <section
        data-testid="case-study-role"
        style={{ marginBottom: "var(--space-12)" }}
      >
        <h2 style={{ marginBottom: "var(--space-4)" }}>Role & Constraints</h2>
        <p
          className="mono"
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-steel)",
            marginBottom: "var(--space-4)",
          }}
        >
          {cs.role}
        </p>
        {cs.constraints && cs.constraints.length > 0 && (
          <ul
            data-testid="case-study-constraints"
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
            }}
          >
            {cs.constraints.map((constraint) => (
              <li
                key={constraint}
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-secondary)",
                  paddingLeft: "var(--space-4)",
                  borderLeft: "2px solid var(--color-accent)",
                }}
              >
                {constraint}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* System / Approach */}
      <section
        data-testid="case-study-system"
        style={{ marginBottom: "var(--space-12)" }}
      >
        <h2 style={{ marginBottom: "var(--space-4)" }}>Approach</h2>
        <p
          style={{
            color: "var(--color-text-secondary)",
            lineHeight: 1.7,
            maxWidth: "40rem",
          }}
        >
          {cs.approach}
        </p>
      </section>

      {/* Media (optional) */}
      {cs.media && cs.media.length > 0 && (
        <section style={{ marginBottom: "var(--space-12)" }}>
          {cs.media.map((m, i) => (
            <div
              key={i}
              style={{
                padding: "var(--space-6)",
                background: "var(--color-bg-elevated)",
                border: "1px solid var(--color-border-light)",
                borderRadius: "var(--radius-md)",
                marginBottom: "var(--space-4)",
              }}
            >
              {m.type === "text-block" && m.content && (
                <p
                  className="mono"
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {m.content}
                </p>
              )}
              {m.type === "diagram" && m.content && (
                <pre
                  className="mono"
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-secondary)",
                    overflow: "auto",
                  }}
                >
                  {m.content}
                </pre>
              )}
              {m.caption && (
                <p
                  className="mono"
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                    marginTop: "var(--space-2)",
                  }}
                >
                  {m.caption}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Outcomes */}
      <section
        data-testid="case-study-outcomes"
        style={{ marginBottom: "var(--space-12)" }}
      >
        <h2 style={{ marginBottom: "var(--space-4)" }}>Outcomes</h2>
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}
        >
          {cs.outcomes.map((outcome) => (
            <li
              key={outcome}
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-secondary)",
                paddingLeft: "var(--space-4)",
                borderLeft: "2px solid var(--color-accent)",
                lineHeight: 1.6,
              }}
            >
              {outcome}
            </li>
          ))}
        </ul>
      </section>

      {/* Proof Links */}
      <section
        data-testid="case-study-proof-links"
        style={{ marginBottom: "var(--space-12)" }}
      >
        <h2 style={{ marginBottom: "var(--space-4)" }}>Proof</h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-3)",
          }}
        >
          {cs.proofLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                padding: "var(--space-2) var(--space-4)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-sm)",
                color: "var(--color-text-secondary)",
                textDecoration: "none",
                transition:
                  "border-color var(--duration-fast) var(--easing)",
              }}
            >
              {link.label} &rarr;
            </a>
          ))}
        </div>
      </section>

      {/* Reflection */}
      <section style={{ marginBottom: "var(--space-12)" }}>
        <h2 style={{ marginBottom: "var(--space-4)" }}>Reflection</h2>
        <p
          style={{
            color: "var(--color-text-secondary)",
            lineHeight: 1.7,
            maxWidth: "40rem",
          }}
        >
          {cs.reflection}
        </p>
      </section>

      {/* Back to Work */}
      <div style={{ marginBottom: "var(--space-12)" }}>
        <Link
          href="/work"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-sm)",
            color: "var(--color-text-secondary)",
            textDecoration: "none",
          }}
        >
          &larr; All work
        </Link>
      </div>
    </article>
  );
}
