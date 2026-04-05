import { siteConfig } from "@/content/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-social-links" data-testid="footer-social-links">
          {siteConfig.socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
               target={link.platform === "email" ? undefined : "_blank"}
               rel={link.platform === "email" ? undefined : "noopener noreferrer"}
               data-testid={`social-link-${link.platform}`}
               aria-label={`${link.label} profile`}
             >
              {link.label}
            </a>
          ))}
        </div>
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
