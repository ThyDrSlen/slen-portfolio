import type { CaseStudy } from "@/lib/content-schema";

export const caseStudies: CaseStudy[] = [
  {
    slug: "form-factor",
    title: "Form Factor",
    summary:
      "A mobile fitness app that uses computer vision to deliver real-time exercise form feedback — built from zero to shipped product.",
    role: "Founder & Lead Engineer",
    period: "2024 – Present",
    techStack: [
      "React Native",
      "Expo",
      "TypeScript",
      "Supabase",
      "ARKit",
      "OpenAI",
    ],
    problem:
      "Most people working out alone have no reliable way to check their exercise form. Bad form leads to injury and stalled progress, but personal trainers are expensive and inaccessible.",
    approach:
      "Built a mobile-first app using Expo and React Native that captures real-time body pose data through ARKit, processes it against biomechanical models, and delivers instant corrective feedback. Integrated Supabase for auth, data persistence, and real-time sync. Used OpenAI for natural language coaching cues.",
    constraints: [
      "Solo developer shipping across iOS and backend",
      "Real-time CV processing on consumer hardware",
      "Privacy-first approach to body/movement data",
    ],
    outcomes: [
      "Shipped a working product with real-time form analysis",
      "Built end-to-end: mobile client, backend services, ML pipeline integration",
      "Maintained a steady release cadence as a solo developer",
    ],
    reflection:
      "Form Factor proved I can take a product from concept to shipping code on my own. The hardest part wasn't any single technology — it was making architectural decisions across mobile, backend, and ML with no team to delegate to. Every tradeoff was mine to own.",
    proofLinks: [
      {
        label: "GitHub Repository",
        url: "https://github.com/ThyDrSlen/form-factor",
      },
    ],
    disclosure: {
      anonymizationLevel: "none",
      allowedClaims: [
        "Solo-built mobile app",
        "Real-time form feedback",
        "Expo/React Native/TypeScript/Supabase stack",
        "Shipped product with release cadence",
      ],
      forbiddenClaims: [],
      allowedAssetTypes: ["diagram", "screenshot", "text-block"],
      requiresDisclaimer: false,
      proofLinks: ["https://github.com/ThyDrSlen/form-factor"],
    },
    featured: true,
  },
  {
    slug: "orwell-scraper",
    title: "Orwell Scraper",
    summary:
      "An async web scraper built with Playwright and aiohttp that handles pacing, proxy rotation, and anti-detection for reliable large-scale data collection.",
    role: "Solo Developer",
    period: "2024",
    techStack: ["Python", "Playwright", "aiohttp", "asyncio"],
    problem:
      "Collecting structured data from dynamic, JavaScript-heavy web pages at scale requires more than simple HTTP requests. Rate limiting, bot detection, and page rendering make naive approaches brittle and unreliable.",
    approach:
      "Designed an async scraping pipeline using Playwright for browser automation and aiohttp for lightweight HTTP work. Implemented pacing controls, proxy rotation, and anti-detection patterns to maintain reliability without overwhelming target servers. Structured the output for downstream consumption.",
    constraints: [
      "Must handle JavaScript-rendered content",
      "Must respect rate limits and avoid detection",
      "Must produce clean, structured output",
    ],
    outcomes: [
      "Built a reliable async scraping pipeline with configurable pacing",
      "Implemented proxy rotation and anti-detection without external services",
      "Demonstrated systems thinking applied to infrastructure-level automation",
    ],
    reflection:
      "This project sits in the portfolio not because of scale, but because it demonstrates the kind of systems thinking I bring to every problem. Scraping well is an engineering challenge: concurrency, error recovery, and respecting constraints. The same discipline applies to production services.",
    proofLinks: [
      {
        label: "GitHub Repository",
        url: "https://github.com/ThyDrSlen/orwell-scraper",
      },
    ],
    disclosure: {
      anonymizationLevel: "none",
      allowedClaims: [
        "Async scraping pipeline",
        "Playwright + aiohttp",
        "Proxy rotation and anti-detection",
        "Structured output",
      ],
      forbiddenClaims: [],
      allowedAssetTypes: ["diagram", "text-block"],
      requiresDisclaimer: false,
      proofLinks: ["https://github.com/ThyDrSlen/orwell-scraper"],
    },
    featured: true,
  },
  {
    slug: "palo-alto",
    title: "Enterprise Platform Engineering",
    summary:
      "Platform engineering on large-scale cybersecurity systems at a leading enterprise security company — anonymized to protect proprietary details.",
    role: "Software Engineer",
    period: "2024 – Present",
    techStack: ["TypeScript", "Python", "Cloud Infrastructure", "CI/CD"],
    problem:
      "Enterprise cybersecurity platforms serve thousands of organizations and must balance velocity with reliability, security, and compliance at every layer. Contributing meaningfully requires understanding complex, interconnected systems and making changes that don't break what's already working.",
    approach:
      "Contributed to platform-level engineering across frontend and backend systems. Worked within established architectural patterns while identifying opportunities to improve developer experience, test coverage, and deployment confidence. Collaborated across teams to ship features that served both internal engineering needs and external customer requirements.",
    constraints: [
      "Large-scale distributed systems with strict reliability requirements",
      "Cross-team coordination across multiple engineering organizations",
      "Security and compliance considerations in every change",
    ],
    outcomes: [
      "Contributed to platform improvements serving enterprise customers",
      "Worked across the stack in a large, complex codebase",
      "Demonstrated ability to operate effectively in a high-stakes enterprise environment",
    ],
    reflection:
      "Working at this scale taught me that the hardest part of enterprise engineering isn't writing code — it's understanding the blast radius of every change, communicating across teams, and maintaining velocity without introducing risk. This experience is deliberately anonymized because the value is in what I learned, not what I can screenshot.",
    proofLinks: [
      {
        label: "LinkedIn Profile",
        url: "https://www.linkedin.com/in/fabrizio-corrales/",
      },
    ],
    disclosure: {
      anonymizationLevel: "anonymized",
      allowedClaims: [
        "Software engineer at Palo Alto Networks",
        "Platform engineering on large-scale systems",
        "Cross-team collaboration",
        "Enterprise cybersecurity domain",
      ],
      forbiddenClaims: [
        "Internal product names or codenames",
        "Customer names or logos",
        "Internal UI screenshots",
        "Specific metrics or revenue figures",
        "Proprietary architecture details",
        "Internal tooling names",
      ],
      allowedAssetTypes: ["diagram", "text-block"],
      requiresDisclaimer: true,
      proofLinks: [
        "https://www.linkedin.com/in/fabrizio-corrales/",
      ],
    },
    disclaimer:
      "This case study is intentionally anonymized. Specific product names, customer details, internal metrics, and proprietary architecture are omitted to respect confidentiality. The focus is on the engineering challenges, approach, and professional growth — not on exposing protected information.",
    featured: true,
  },
];

export function getCaseStudyBySlug(
  slug: string
): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}

export function getFeaturedCaseStudies(): CaseStudy[] {
  return caseStudies.filter((cs) => cs.featured);
}

export function getAllSlugs(): string[] {
  return caseStudies.map((cs) => cs.slug);
}
