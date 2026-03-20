import Link from "next/link";
import { heroContent, proofRailItems, siteConfig } from "@/content/site";
import { getFeaturedCaseStudies } from "@/content/case-studies";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    jobTitle: "Software Engineer",
    sameAs: siteConfig.socialLinks
      .filter((l) => l.platform !== "email")
      .map((l) => l.url),
  };
  const featured = getFeaturedCaseStudies();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <section className="section" style={{ paddingTop: "var(--space-16)" }}>
        <div className="container">
          <p
            className="mono"
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-muted)",
              marginBottom: "var(--space-4)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Portfolio
          </p>
          <h1 data-testid="hero-headline">{heroContent.headline}</h1>
          <p
            data-testid="hero-subhead"
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--color-text-secondary)",
              maxWidth: "40rem",
              marginTop: "var(--space-6)",
              lineHeight: 1.7,
            }}
          >
            {heroContent.subhead}
          </p>
          <div
            style={{
              display: "flex",
              gap: "var(--space-4)",
              marginTop: "var(--space-8)",
            }}
          >
            <Link
              href={heroContent.cta.href}
              data-testid="primary-cta"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-3) var(--space-6)",
                background: "var(--color-text)",
                color: "var(--color-bg)",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-sm)",
                fontWeight: 600,
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
              }}
            >
              {heroContent.cta.label} &rarr;
            </Link>
            <a
              href={`mailto:${siteConfig.email}`}
              data-testid="contact-email-link"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "var(--space-3) var(--space-6)",
                border: "1px solid var(--color-border)",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-sm)",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                color: "var(--color-text-secondary)",
              }}
            >
              Get in touch
            </a>
          </div>
        </div>
      </section>

      {/* Proof Rail */}
      <section className="section">
        <div className="container">
          <div
            data-testid="proof-rail"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "var(--space-6)",
              padding: "var(--space-8) 0",
              borderTop: "1px solid var(--color-border-light)",
              borderBottom: "1px solid var(--color-border-light)",
            }}
          >
            {proofRailItems.map((item) => (
              <div key={item.label}>
                <p
                  className="mono"
                  style={{
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    marginBottom: "var(--space-1)",
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Case Studies */}
      <section className="section">
        <div className="container">
          <h2 style={{ marginBottom: "var(--space-8)" }}>Selected Work</h2>
          <div
            data-testid="featured-case-studies"
            style={{
              display: "grid",
              gap: "var(--space-6)",
            }}
          >
            {featured.map((cs) => (
              <Link
                key={cs.slug}
                href={`/work/${cs.slug}`}
                data-testid={`case-study-card-${cs.slug}`}
                style={{
                  display: "block",
                  padding: "var(--space-8)",
                  background: "var(--color-bg-elevated)",
                  border: "1px solid var(--color-border-light)",
                  borderRadius: "var(--radius-lg)",
                  textDecoration: "none",
                  transition: "border-color var(--duration-fast) var(--easing)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  <h3>{cs.title}</h3>
                  {cs.disclosure.anonymizationLevel === "anonymized" && (
                    <span className="steel-badge">Anonymized</span>
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
                  }}
                >
                  {cs.summary}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "var(--space-2)",
                    marginTop: "var(--space-4)",
                  }}
                >
                  {cs.techStack.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="mono"
                      style={{
                        fontSize: "var(--text-xs)",
                        padding: "var(--space-1) var(--space-2)",
                        background: "var(--color-bg)",
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
      </section>

      {/* CTA */}
      <section className="section">
        <div
          className="container"
          style={{ textAlign: "center", padding: "var(--space-16) 0" }}
        >
          <h2 style={{ marginBottom: "var(--space-4)" }}>
            Want to work together?
          </h2>
          <p
            style={{
              color: "var(--color-text-secondary)",
              marginBottom: "var(--space-8)",
              maxWidth: "32rem",
              margin: "0 auto var(--space-8)",
            }}
          >
            I&apos;m open to new opportunities. Check out my work, download my
            resume, or reach out directly.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "var(--space-4)",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/work"
              style={{
                display: "inline-flex",
                padding: "var(--space-3) var(--space-6)",
                background: "var(--color-text)",
                color: "var(--color-bg)",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-sm)",
                fontWeight: 600,
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
              }}
            >
              View all work
            </Link>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                padding: "var(--space-3) var(--space-6)",
                border: "1px solid var(--color-border)",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-sm)",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                color: "var(--color-text-secondary)",
              }}
            >
              Resume
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              style={{
                display: "inline-flex",
                padding: "var(--space-3) var(--space-6)",
                border: "1px solid var(--color-border)",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-sm)",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                color: "var(--color-text-secondary)",
              }}
            >
              Email me
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
