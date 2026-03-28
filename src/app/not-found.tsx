"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const LINE_DELAY_MS = 150;
const INITIAL_DELAY_MS = 300;

type TermLine = { id: string } & (
  | { kind: "command" }
  | { kind: "error"; text: string }
  | { kind: "blank" }
  | { kind: "heading"; text: string }
  | { kind: "text"; text: string }
  | { kind: "nav"; command: string; label: string; href: string }
  | { kind: "prompt" }
);

function buildLines(pathname: string): TermLine[] {
  return [
    { id: "cmd", kind: "command" },
    {
      id: "err",
      kind: "error",
      text: `bash: cd: ${pathname}: No such file or directory`,
    },
    { id: "gap-1", kind: "blank" },
    { id: "h1", kind: "heading", text: "404 \u2014 path not found" },
    { id: "gap-2", kind: "blank" },
    {
      id: "desc",
      kind: "text",
      text: "The route you requested doesn\u2019t resolve.",
    },
    { id: "hint", kind: "text", text: "Try one of these:" },
    { id: "gap-3", kind: "blank" },
    { id: "nav-home", kind: "nav", command: "cd ~", label: "return home", href: "/" },
    {
      id: "nav-work",
      kind: "nav",
      command: "ls /work",
      label: "view case studies",
      href: "/work",
    },
    {
      id: "nav-about",
      kind: "nav",
      command: "cat about",
      label: "read about me",
      href: "/about",
    },
    { id: "gap-4", kind: "blank" },
    { id: "prompt", kind: "prompt" },
  ];
}

export default function NotFound() {
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();
  const lines = buildLines(pathname);
  const total = lines.length;
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisible(total);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < total; i++) {
      timers.push(
        setTimeout(
          () => setVisible(i + 1),
          INITIAL_DELAY_MS + LINE_DELAY_MS * (i + 1),
        ),
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [prefersReducedMotion, total]);

  const mono: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "var(--text-sm)",
    lineHeight: 2,
  };

  return (
    <section
      aria-label="Page not found"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "48rem",
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
            opacity: 0.5,
          }}
        />

        <div
          aria-hidden="true"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            padding: "var(--space-3) var(--space-4)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <span style={chromeCircle("var(--color-error)")} />
          <span style={chromeCircle("var(--color-warning)")} />
          <span style={chromeCircle("var(--color-accent)")} />
          <span
            style={{
              marginLeft: "var(--space-2)",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--color-text-muted)",
            }}
          >
            {"bash \u2014 80\u00d724"}
          </span>
        </div>

        <div
          style={{
            padding: "var(--space-6) var(--space-8)",
            overflowWrap: "break-word",
          }}
        >
          {lines.slice(0, visible).map((line, idx) => {
            const animating = idx === visible - 1 && visible < total;
            return renderLine(line, animating, pathname, mono);
          })}
        </div>
      </div>

      <style>{`
        @keyframes nf-blink { 50% { opacity: 0 } }
        .nf-link {
          color: var(--color-accent);
          text-decoration: none;
          transition: text-shadow var(--duration-fast) var(--easing);
        }
        .nf-link:hover {
          text-shadow: 0 0 10px var(--color-accent-glow);
        }
      `}</style>
    </section>
  );
}

function renderLine(
  line: TermLine,
  animating: boolean,
  pathname: string,
  mono: React.CSSProperties,
): React.ReactNode {
  switch (line.kind) {
    case "blank":
      return <div key={line.id} style={{ height: "2em" }} />;

    case "command":
      return (
        <div key={line.id} style={{ ...mono, color: "var(--color-text)" }}>
          <span style={{ color: "var(--color-accent-dim)" }}>
            {"visitor@slen.win:~$ "}
          </span>
          {"cd "}
          {pathname}
          {animating && <Blink />}
        </div>
      );

    case "error":
      return (
        <div key={line.id} style={{ ...mono, color: "var(--color-error)" }}>
          {line.text}
          {animating && <Blink />}
        </div>
      );

    case "heading":
      return (
        <h1
          key={line.id}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-2xl)",
            fontWeight: 600,
            lineHeight: 2,
            color: "var(--color-accent)",
            textShadow:
              "0 0 20px var(--color-accent-glow-strong), 0 0 40px var(--color-accent-glow)",
            letterSpacing: "-0.02em",
          }}
        >
          {line.text}
          {animating && <Blink />}
        </h1>
      );

    case "text":
      return (
        <div
          key={line.id}
          style={{ ...mono, color: "var(--color-text-muted)" }}
        >
          {line.text}
          {animating && <Blink />}
        </div>
      );

    case "nav":
      return (
        <div
          key={line.id}
          style={{ ...mono, paddingLeft: "var(--space-4)" }}
        >
          <span
            style={{
              color: "var(--color-accent-dim)",
              marginRight: "var(--space-2)",
            }}
          >
            {">"}
          </span>
          <Link href={line.href} className="nf-link">
            {line.command}
          </Link>
          <span
            style={{
              color: "var(--color-text-muted)",
              marginLeft: "var(--space-4)",
            }}
          >
            {`\u2014 ${line.label}`}
          </span>
          {animating && <Blink />}
        </div>
      );

    case "prompt":
      return (
        <div key={line.id} style={{ ...mono, color: "var(--color-text)" }}>
          <span style={{ color: "var(--color-accent-dim)" }}>
            {"visitor@slen.win:~$ "}
          </span>
          <Blink />
        </div>
      );
  }
}

function Blink() {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: "0.55rem",
        height: "1em",
        background: "var(--color-accent)",
        marginLeft: "0.2rem",
        verticalAlign: "text-bottom",
        animation: "nf-blink 1s step-end infinite",
      }}
    />
  );
}

function chromeCircle(bg: string): React.CSSProperties {
  return {
    width: 12,
    height: 12,
    borderRadius: "50%",
    background: bg,
    opacity: 0.6,
  };
}
