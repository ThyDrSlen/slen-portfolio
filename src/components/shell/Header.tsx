import Link from "next/link";

export function Header() {
  return (
    <header className="site-header" data-testid="site-shell">
      <div className="site-header-inner">
        <Link href="/" className="site-logo">
          slen.win
        </Link>
        <nav className="site-nav" data-testid="primary-nav">
          <Link href="/work" data-testid="nav-link-work">
            Work
          </Link>
          <Link href="/about" data-testid="nav-link-about">
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
