"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

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
            aria-current={pathname === "/work" ? "page" : undefined}
          >
            Work
          </Link>
          <Link
            href="/about"
            data-testid="nav-link-about"
            aria-current={pathname === "/about" ? "page" : undefined}
          >
            About
          </Link>
          <a
            href="/resume.pdf"
            data-testid="resume-download-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-current={pathname === "/resume.pdf" ? "page" : undefined}
          >
            Resume
          </a>
        </nav>
      </div>
    </header>
  );
}
