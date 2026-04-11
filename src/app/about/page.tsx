import type { Metadata } from "next";
import Image from "next/image";
import {
  siteConfig,
  aboutContent,
  experienceEntries,
  lookingFor,
  skillCategories,
  heroContent,
} from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: aboutContent.intro.slice(0, 155),
  alternates: { canonical: "/about" },
};

export default function About() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    description: heroContent.subhead,
    jobTitle: experienceEntries[0].role,
    worksFor: {
      "@type": "Organization",
      name: experienceEntries[0].company,
    },
    knowsAbout: skillCategories.flatMap((cat) => cat.skills),
    sameAs: siteConfig.socialLinks
      .filter((l) => l.platform !== "email")
      .map((l) => l.url),
  };
  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-8)",
          marginBottom: "var(--space-12)",
          flexWrap: "wrap",
        }}
      >
        <Image
          src="/headshot.jpg"
          alt="Fabrizio Corrales"
          width={160}
          height={213}
          style={{
            borderRadius: "var(--radius-lg)",
            border: "2px solid var(--color-border)",
            objectFit: "cover",
            boxShadow: "0 0 20px var(--color-accent-glow)",
          }}
        />
        <div>
          <h1
            data-testid="about-page-title"
            style={{ marginBottom: "var(--space-3)" }}
          >
            About
          </h1>
          <p className="mono" style={{ color: "var(--color-accent)", fontSize: "var(--text-sm)" }}>
            {experienceEntries[0].role} @ {experienceEntries[0].company}
          </p>
        </div>
      </div>

      {/* Intro */}
      <div style={{ maxWidth: "40rem", marginBottom: "var(--space-12)" }}>
        {aboutContent.introSections.map((para) => (
          <p
            key={para.slice(0, 30)}
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "var(--text-lg)",
              lineHeight: 1.8,
              marginBottom: "var(--space-6)",
            }}
          >
            {para}
          </p>
        ))}
      </div>

      {/* Looking For */}
      <section style={{ marginBottom: "var(--space-16)" }}>
        <h2 style={{ marginBottom: "var(--space-4)" }}>What I&apos;m Looking For</h2>
        <p
          style={{
            color: "var(--color-text-secondary)",
            lineHeight: 1.7,
            maxWidth: "40rem",
            padding: "var(--space-6)",
            background: "var(--color-bg-surface)",
            border: "1px solid var(--color-border)",
            borderLeft: "3px solid var(--color-accent)",
            borderRadius: "var(--radius-md)",
          }}
        >
          {lookingFor}
        </p>
      </section>

      {/* Current Focus */}
      <section style={{ marginBottom: "var(--space-16)" }}>
        <h2 style={{ marginBottom: "var(--space-4)" }}>Current Focus</h2>
        <p
          style={{
            color: "var(--color-text-secondary)",
            lineHeight: 1.7,
            maxWidth: "40rem",
          }}
        >
          {aboutContent.currentFocus}
        </p>
      </section>

      {/* Tech Stack */}
      <section style={{ marginBottom: "var(--space-16)" }}>
        <h2 style={{ marginBottom: "var(--space-8)" }}>Tech Stack</h2>
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
      </section>

      {/* Timeline */}
      <section
        data-testid="journey-timeline"
        style={{ marginBottom: "var(--space-16)" }}
      >
        <h2 style={{ marginBottom: "var(--space-8)" }}>Journey</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-6)",
          }}
        >
          {experienceEntries.map((entry) => (
            <div
              key={`${entry.company}-${entry.period}`}
              style={{
                padding: "var(--space-6)",
                background: "var(--color-bg-surface)",
                border: "1px solid var(--color-border-light)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexWrap: "wrap",
                  gap: "var(--space-2)",
                  marginBottom: "var(--space-2)",
                }}
              >
                <h3 style={{ fontSize: "var(--text-lg)" }}>{entry.company}</h3>
                <span
                  className="mono"
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {entry.period}
                </span>
              </div>
              <p
                className="mono"
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-steel)",
                  marginBottom: "var(--space-3)",
                }}
              >
                {entry.role}
              </p>
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                {entry.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section style={{ marginBottom: "var(--space-16)" }}>
        <h2 style={{ marginBottom: "var(--space-6)" }}>Get in Touch</h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "var(--space-4)",
          }}
        >
          <a
            href={`mailto:${siteConfig.email}`}
            data-testid="contact-email-link"
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
            Email me
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="about-resume-download"
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
            Download Resume
          </a>
          {siteConfig.socialLinks
            .filter((l) => l.platform !== "email")
            .map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`social-link-${link.platform}`}
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
                {link.label}
              </a>
            ))}
        </div>
      </section>
    </div>
  );
}
