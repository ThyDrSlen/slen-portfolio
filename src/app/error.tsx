"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Log to an error reporting service if needed
    console.error(error);
  }, [error]);

  return (
    <section aria-label="Application error" className="nf-section">
      <div className="nf-window">
        <div aria-hidden="true" className="nf-window-glow" />

        <div aria-hidden="true" className="nf-window-chrome">
          <span className="nf-chrome-circle nf-chrome-circle-error" />
          <span className="nf-chrome-circle nf-chrome-circle-warning" />
          <span className="nf-chrome-circle nf-chrome-circle-accent" />
          <span className="nf-window-title">{"bash — 80×24"}</span>
        </div>

        <div className="nf-body">
          <div className="nf-line nf-line-command">
            <span className="nf-prompt-label">{"visitor@slen.win:~$ "}</span>
            {"[process]"}
            {!prefersReducedMotion && <span aria-hidden="true" className="nf-blink" />}
          </div>

          <div className="nf-line nf-line-error">
            {"Unhandled runtime error — process exited with code 1"}
          </div>

          {error.message && (
            <div className="nf-line nf-line-error">{error.message}</div>
          )}

          {error.digest && (
            <div className="nf-line" style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", lineHeight: 2 }}>
              {`digest: ${error.digest}`}
            </div>
          )}

          <div className="nf-blank" />

          <h1 className="nf-heading">{"500 — something went wrong"}</h1>

          <div className="nf-blank" />

          <div className="nf-line nf-line-text">
            {"An unexpected error occurred on this route."}
          </div>
          <div className="nf-line nf-line-text">{"You can try to recover:"}</div>

          <div className="nf-blank" />

          <div className="nf-line nf-line-nav">
            <span className="nf-nav-marker">{">"}</span>
            <button
              onClick={reset}
              className="nf-link"
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)" }}
            >
              {"retry"}
            </button>
            <span className="nf-nav-label">{"— try again"}</span>
          </div>

          <div className="nf-line nf-line-nav">
            <span className="nf-nav-marker">{">"}</span>
            <Link href="/" className="nf-link">
              {"cd ~"}
            </Link>
            <span className="nf-nav-label">{"— return home"}</span>
          </div>

          <div className="nf-blank" />

          <div className="nf-line nf-line-command">
            <span className="nf-prompt-label">{"visitor@slen.win:~$ "}</span>
            <span aria-hidden="true" className="nf-blink" />
          </div>
        </div>
      </div>
    </section>
  );
}
