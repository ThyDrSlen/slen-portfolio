"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const currentPath = usePathname();

  const getAriaCurrent = (href: string) => {
    if (!currentPath) return undefined;
    if (href === "/") {
      return currentPath === "/" ? "page" : undefined;
    }
    return currentPath.startsWith(href) ? "page" : undefined;
  };

  return (
    <header className="site-header" data-testid="site-shell">
      <div className="site-header-inner">
        <Link href="/" className="site-logo">
          slen.win
        </Link>
        <nav className="site-nav" data-testid="primary-nav">
          <Link
            href="/work"
            data-testid="nav-link-work"
            aria-current={getAriaCurrent("/work")}
          >
            Work
          </Link>
          <Link
            href="/about"
            data-testid="nav-link-about"
            aria-current={getAriaCurrent("/about")}
          >
            About
          </Link>
          <a
            href="/resume.pdf"
            data-testid="resume-download-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </a>
        </nav>
      </div>
    </header>
  );
}
