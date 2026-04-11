import { z } from "zod/v4";

export const socialLinkSchema = z.object({
  platform: z.enum(["github", "linkedin", "email"]),
  url: z.url(),
  label: z.string().min(1),
});

export const siteConfigSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(10),
  url: z.url(),
  email: z.email(),
  socialLinks: z.array(socialLinkSchema).min(1),
});

export const experienceEntrySchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  period: z.string().min(1),
  description: z.string().min(1),
  highlights: z.array(z.string()).optional(),
});

export const disclosureMatrixSchema = z.object({
  anonymizationLevel: z.enum(["none", "partial", "anonymized"]),
  allowedClaims: z.array(z.string()).min(1),
  forbiddenClaims: z.array(z.string()),
  allowedAssetTypes: z.array(z.string()),
  requiresDisclaimer: z.boolean(),
  proofLinks: z.array(z.url()),
});

const diagramNodeSchema = z
  .object({
    id: z.string(),
    type: z.string().optional(),
    position: z.object({
      x: z.number(),
      y: z.number(),
    }),
    data: z
      .object({
        label: z.string(),
      })
      .passthrough(),
  })
  .passthrough();

const diagramEdgeSchema = z
  .object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
    type: z.string().optional(),
    animated: z.boolean().optional(),
    label: z.string().optional(),
    style: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough();

export const caseStudySchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case"),
  title: z.string().min(1),
  summary: z.string().min(10),
  role: z.string().min(1),
  period: z.string().min(1),
  techStack: z.array(z.string()).min(1),
  problem: z.string().min(10),
  approach: z.string().min(10),
  constraints: z.array(z.string()).optional(),
  outcomes: z.array(z.string()).min(1),
  reflection: z.string().min(10),
  proofLinks: z.array(
    z.object({
      label: z.string().min(1),
      url: z.url(),
    })
  ).min(1),
  disclosure: disclosureMatrixSchema,
  disclaimer: z.string().optional(),
  featured: z.boolean().default(false),
  media: z
    .array(
      z.discriminatedUnion("type", [
        z.object({
          type: z.literal("diagram"),
          content: z.string(),
          caption: z.string().optional(),
          diagramNodes: z.array(diagramNodeSchema).optional(),
          diagramEdges: z.array(diagramEdgeSchema).optional(),
        }),
        z.object({
          type: z.literal("screenshot"),
          src: z.string(),
          alt: z.string().min(1),
          caption: z.string().optional(),
        }),
        z.object({
          type: z.literal("text-block"),
          content: z.string().min(1),
          caption: z.string().optional(),
        }),
      ])
    )
    .optional(),
});

export type SiteConfig = z.infer<typeof siteConfigSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type ExperienceEntry = z.infer<typeof experienceEntrySchema>;
export type CaseStudy = z.infer<typeof caseStudySchema>;
export type DisclosureMatrix = z.infer<typeof disclosureMatrixSchema>;

export function validateSiteConfig(data: unknown): SiteConfig {
  return siteConfigSchema.parse(data);
}

export function validateCaseStudy(data: unknown): CaseStudy {
  return caseStudySchema.parse(data);
}

export function validateCaseStudies(data: unknown[]): CaseStudy[] {
  return data.map((d) => caseStudySchema.parse(d));
}
