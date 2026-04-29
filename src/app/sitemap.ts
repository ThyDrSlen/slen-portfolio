import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/content/case-studies";
import { siteConfig } from "@/content/site";

const CONTENT_LAST_MODIFIED = new Date("2026-04-01");

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: CONTENT_LAST_MODIFIED,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: CONTENT_LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: CONTENT_LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: CONTENT_LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];

  const caseStudyRoutes = getAllSlugs().map((slug) => ({
    url: `${baseUrl}/work/${slug}`,
    lastModified: CONTENT_LAST_MODIFIED,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...caseStudyRoutes];
}
