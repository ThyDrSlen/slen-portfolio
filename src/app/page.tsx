import { Suspense } from "react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import {
  heroContent,
  proofRailItems,
  siteConfig,
  skillCategories,
  lookingFor,
  experienceEntries,
} from "@/content/site";
import { TypingTest } from "@/components/TypingTest";
import { InteractiveTerminal } from "@/components/home/InteractiveTerminal";
import { GitHubCommitPulse } from "@/components/home/GitHubCommitPulse";
import { Reveal } from "@/components/motion/Reveal";
import { CountUpMetric } from "@/components/motion/CountUpMetric";
import { TypeOnReveal } from "@/components/motion/TypeOnReveal";

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

export default async function Home() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: "Software Engineer",
    sameAs: siteConfig.socialLinks
      .filter((l) => l.platform !== "email")
      .map((l) => l.url),
  };

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section style={{ paddingTop: "var(--space-16)", marginBottom: "var(--space-8)" }}>
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-12)",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "1 1 24rem" }}>
            <p
              className="mono"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-accent)",
                marginBottom: "var(--space-4)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textShadow: "0 0 10px var(--color-accent-glow)",
              }}
            >
              &gt; portfolio.init()
            </p>
            <h1
              data-testid="hero-headline"
              style={{ color: "var(--color-text)" }}
            >
              {heroContent.headline}
            </h1>
            <p
              className="mono"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-accent)",
                marginTop: "var(--space-2)",
                textShadow: "0 0 10px var(--color-accent-glow)",
              }}
            >
              {experienceEntries[0].role} @ {experienceEntries[0].company}
            </p>
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
                flexWrap: "wrap",
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
                  background: "var(--color-accent)",
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
              {siteConfig.socialLinks
                .filter((l) => l.platform === "linkedin")
                .map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
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
                    {link.label}
                  </a>
                ))}
            </div>
          </div>
          <div style={{ flex: "0 0 auto" }}>
            <Image
              src="/headshot.webp"
              alt="Fabrizio Corrales"
              width={240}
              height={320}
              quality={80}
              sizes="240px"
              priority
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA8ADwAAD/2wBDAFA3PEY8MlBGQUZaVVBfeMiCeG5uePWvuZHI////////////////////////////////////////////////////2wBDAVVaWnhpeOuCguv/////////////////////////////////////////////////////////////////////////wAARCAAOAAgDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAP/xAAaEAACAgMAAAAAAAAAAAAAAAAAEQESITGh/8QAFAEBAAAAAAAAAAAAAAAAAAAAAf/EABURAQEAAAAAAAAAAAAAAAAAAAAR/9oADAMBAAIRAxEAPwCalbyCdpS6Bgr/2Q=="
              style={{
                borderRadius: "var(--radius-lg)",
                border: "2px solid var(--color-border)",
                objectFit: "cover",
                boxShadow: "0 0 30px var(--color-accent-glow)",
              }}
            />
          </div>
        </div>
      </section>

      <InteractiveTerminal />

      <Reveal>
        <section style={{ marginBottom: "var(--space-12)" }}>
          <div className="container">
            <div
              data-testid="proof-rail"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "var(--space-6)",
                padding: "var(--space-8) 0",
                borderTop: "1px solid var(--color-border)",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              {proofRailItems.map((item) => (
                <div key={item.label}>
                  {item.metric && (
                    <p
                      className="mono"
                      style={{
                        fontSize: "2.5rem",
                        fontWeight: 600,
                        marginBottom: "var(--space-1)",
                        color: "var(--color-accent)",
                        textShadow: "0 0 10px var(--color-accent-glow)",
                      }}
                    >
                      <CountUpMetric
                        target={item.metric.value}
                        suffix={item.metric.suffix}
                      />
                    </p>
                  )}
                  <p
                    className="mono"
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: 600,
                      marginBottom: "var(--space-1)",
                  color: "var(--color-text-secondary)",
                  ...(item.metric
                    ? {}
                    : {
                        color: "var(--color-accent)",
                        fontSize: "var(--text-lg)",
                        textShadow: "0 0 10px var(--color-accent-glow)",
                      }),
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
      </Reveal>

      <Reveal delay={100}>
        <section style={{ marginBottom: "var(--space-16)" }}>
          <div className="container">
            <h2 style={{ marginBottom: "var(--space-8)" }}>
              <span
                className="mono glow"
                style={{ fontSize: "var(--text-sm)", fontWeight: 400 }}
              >
                ~/skills
              </span>
              <br />
              <TypeOnReveal text="Tech Stack" tag="span" />
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "var(--space-6)",
              }}
            >
              {skillCategories.map((cat) => (
                <div key={cat.label}>
                  <h3
                    className="mono"
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--color-accent)",
                      marginBottom: "var(--space-3)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      fontWeight: 600,
                    }}
                  >
                    {cat.label}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "var(--space-2)",
                    }}
                  >
                    {cat.skills.map((skill) => (
                      <span
                        key={skill}
                        className="mono"
                        style={{
                          fontSize: "var(--text-xs)",
                          padding: "var(--space-1) var(--space-2)",
                          background: "var(--color-bg-surface)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "var(--radius-sm)",
                          color: "var(--color-text-muted)",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <div
        className="container"
        style={{
          textAlign: "center",
          padding: "var(--space-8) 0 var(--space-12)",
        }}
      >
        <Link
          href="/work"
          className="mono"
          style={{
            color: "var(--color-accent)",
            fontSize: "var(--text-sm)",
            textDecoration: "none",
            borderBottom: "1px solid var(--color-accent-dim)",
            paddingBottom: "var(--space-1)",
          }}
        >
          ~/work &rarr; See the case studies
        </Link>
      </div>

      <section style={{ marginBottom: "var(--space-12)" }}>
        <div className="container">
          <TypingTest />
        </div>
      </section>

      <Reveal>
        <section style={{ marginBottom: "var(--space-12)" }}>
          <div className="container">
            <Suspense fallback={<GitHubCommitPulseSkeleton />}>
              <GitHubCommitPulse />
            </Suspense>
          </div>
        </section>
      </Reveal>

      <Reveal delay={100}>
        <section style={{ padding: "var(--space-16) 0" }}>
          <div
            className="container"
            style={{ textAlign: "center" }}
          >
            <h2 style={{ marginBottom: "var(--space-4)" }}>
              <TypeOnReveal text="Want to work together?" tag="span" />
            </h2>
            <p
              style={{
                color: "var(--color-text-secondary)",
                maxWidth: "36rem",
                margin: "0 auto var(--space-8)",
                lineHeight: 1.7,
              }}
            >
              {lookingFor}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "var(--space-4)",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/work"
                style={{
                  display: "inline-flex",
                  padding: "var(--space-3) var(--space-6)",
                  background: "var(--color-accent)",
                  color: "var(--color-bg)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                  borderRadius: "var(--radius-md)",
                  textDecoration: "none",
                }}
              >
                ls ./work
              </Link>
              <a
                href="/resume"
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
                cat resume.pdf
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
                mail -s &quot;hey&quot;
              </a>
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
