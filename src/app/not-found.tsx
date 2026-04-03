"use client";

import { type ReactNode, useEffect, useState } from "react";
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
    { id: "h1", kind: "heading", text: "404 — path not found" },
    { id: "gap-2", kind: "blank" },
    {
      id: "desc",
      kind: "text",
      text: "The route you requested doesn’t resolve.",
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

  return (
    <section aria-label="Page not found" className="nf-section">
      <div className="nf-window">
        <div aria-hidden="true" className="nf-window-glow" />

        <div aria-hidden="true" className="nf-window-chrome">
          <span className="nf-chrome-circle nf-chrome-circle-error" />
          <span className="nf-chrome-circle nf-chrome-circle-warning" />
          <span className="nf-chrome-circle nf-chrome-circle-accent" />
          <span className="nf-window-title">{"bash — 80×24"}</span>
        </div>

        <div className="nf-body">
          {lines.slice(0, visible).map((line, idx) => {
            const animating = idx === visible - 1 && visible < total;
            return renderLine(line, animating, pathname);
          })}
        </div>
      </div>
    </section>
  );
}

function renderLine(
  line: TermLine,
  animating: boolean,
  pathname: string,
): ReactNode {
  switch (line.kind) {
    case "blank":
      return <div key={line.id} className="nf-blank" />;

    case "command":
      return (
        <div key={line.id} className="nf-line nf-line-command">
          <span className="nf-prompt-label">{"visitor@slen.win:~$ "}</span>
          {"cd "}
          {pathname}
          {animating && <Blink />}
        </div>
      );

    case "error":
      return (
        <div key={line.id} className="nf-line nf-line-error">
          {line.text}
          {animating && <Blink />}
        </div>
      );

    case "heading":
      return (
        <h1 key={line.id} className="nf-heading">
          {line.text}
          {animating && <Blink />}
        </h1>
      );

    case "text":
      return (
        <div key={line.id} className="nf-line nf-line-text">
          {line.text}
          {animating && <Blink />}
        </div>
      );

    case "nav":
      return (
        <div key={line.id} className="nf-line nf-line-nav">
          <span className="nf-nav-marker">{">"}</span>
          <Link href={line.href} className="nf-link">
            {line.command}
          </Link>
          <span className="nf-nav-label">{`— ${line.label}`}</span>
          {animating && <Blink />}
        </div>
      );

    case "prompt":
      return (
        <div key={line.id} className="nf-line nf-line-command">
          <span className="nf-prompt-label">{"visitor@slen.win:~$ "}</span>
          <Blink />
        </div>
      );
  }
}

function Blink() {
  return <span aria-hidden="true" className="nf-blink" />;
}
