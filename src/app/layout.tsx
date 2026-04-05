import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { SkipLink } from "@/components/shell/SkipLink";
import { MatrixRain } from "@/components/shell/MatrixRain";
import { BootSequence } from "@/components/shell/BootSequence";
import { CursorTrail } from "@/components/shell/CursorTrail";
import { HitMarker } from "@/components/shell/HitMarker";
import { ClientErrorBoundary } from "@/components/shell/ClientErrorBoundary";
import { SubwayStatusBar } from "@/components/shell/SubwayStatusBar";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteConfig } from "@/content/site";
import "./globals.css";
import "./matrix-effects.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Software Engineer`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} | Software Engineer`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Software Engineer`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteConfig.url,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <ClientErrorBoundary>
          <BootSequence />
          <CursorTrail />
          <HitMarker />
          <MatrixRain />
        </ClientErrorBoundary>
        <div className="scanline" aria-hidden="true" />
        <SkipLink />
        <Header />
        <main id="main-content" className="site-main">
          {children}
        </main>
        <Footer />
        <SubwayStatusBar />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
