import { siteConfig } from "@/content/site";

export function Footer() {
  const getSocialLabel = (link: (typeof siteConfig.socialLinks)[number]) => {
    if (link.platform === "email") return "Email Fabrizio";
    return `${link.label} profile, opens in a new tab`;
  };

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
              aria-label={getSocialLabel(link)}
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
