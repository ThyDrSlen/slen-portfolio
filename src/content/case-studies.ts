import type { CaseStudy } from "@/lib/content-schema";

export const caseStudies: CaseStudy[] = [
  {
    slug: "form-factor",
    title: "Form Factor",
    summary:
      "A mobile fitness app that uses ARKit body tracking and Apple HealthKit to deliver real-time exercise form analysis — built from zero to shipped product.",
    role: "Founder & Lead Engineer",
    period: "Sept 2025 – Present",
    techStack: [
      "React Native",
      "Expo",
      "TypeScript",
      "Supabase",
      "Postgres",
      "ARKit",
      "Apple HealthKit",
    ],
    problem:
      "Most people working out alone have no reliable way to check their exercise form. Bad form leads to injury and stalled progress, but personal trainers are expensive and inaccessible. Existing fitness apps track reps and calories but ignore the quality of movement.",
    approach:
      "Built a mobile-first app using Expo and React Native that integrates Apple HealthKit to sync heart-rate, step, and body-composition data from Apple Watch into workout logs. Used ARKit body tracking to record joint and pose metrics for real-time form analysis. Designed backend schemas and structured logging in Supabase/Postgres to store health and pose data reliably and support debugging and future ML features.",
    constraints: [
      "Solo developer shipping across iOS client and backend",
      "Real-time CV processing on consumer mobile hardware",
      "Privacy-first approach to body/movement and health data",
      "Backend schema design for both current use and future ML pipeline",
    ],
    outcomes: [
      "Shipped a working product with real-time form analysis via ARKit body tracking",
      "Integrated Apple HealthKit to sync watch data into workout logs",
      "Built end-to-end: mobile client, backend schemas, health data pipeline",
      "Maintained a steady release cadence as a solo developer",
    ],
    reflection:
      "Form Factor proved I can take a product from concept to shipping code on my own. The hardest part wasn't any single technology — it was making architectural decisions across mobile, backend, and health data with no team to delegate to. Every tradeoff was mine to own, from schema design for future ML features to privacy constraints on body tracking data.",
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
        "ARKit body tracking for form analysis",
        "Apple HealthKit integration",
        "React Native/Expo/TypeScript/Supabase stack",
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
    title: "Orwell Web Scraper",
    summary:
      "An async scraping pipeline resilient to blocking and churn, maintaining access on ~90% of runs and producing 26k labeled assets for downstream classification.",
    role: "Solo Developer",
    period: "July 2023",
    techStack: ["Python", "Playwright", "aiohttp", "asyncio"],
    problem:
      "Collecting structured data from dynamic, JavaScript-heavy web pages at scale requires more than simple HTTP requests. Rate limiting, bot detection, and page rendering make naive approaches brittle. The goal was to produce a large, labeled dataset for downstream classification work.",
    approach:
      "Designed an async scraping pipeline using Playwright for browser automation and aiohttp for lightweight HTTP work. Built resilience against blocking and site churn through pacing controls, proxy rotation, and anti-detection patterns. Structured the output as labeled assets ready for downstream classification pipelines.",
    constraints: [
      "Must handle JavaScript-rendered content reliably",
      "Must maintain access despite blocking and site churn",
      "Must produce clean, labeled output for downstream ML use",
    ],
    outcomes: [
      "Built an async scraping pipeline maintaining access on ~90% of runs",
      "Produced 26,000 labeled assets for downstream classification",
      "Implemented proxy rotation and anti-detection without external services",
      "Demonstrated systems thinking applied to data collection infrastructure",
    ],
    reflection:
      "This project sits in the portfolio not because of scale, but because it demonstrates the kind of systems thinking I bring to every problem. Reliable data collection is an engineering challenge: concurrency, error recovery, resilience against churn, and producing clean output under adversarial conditions. The same discipline applies to production services.",
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
        "~90% access rate",
        "26k labeled assets",
        "Playwright + aiohttp",
        "Proxy rotation and anti-detection",
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
      "Backend-focused platform engineering on scalable distributed systems at Palo Alto Networks (ADEM) — building Go services, CI feedback acceleration, and operational analytics.",
    role: "Software Engineer (ADEM)",
    period: "Aug 2024 – Present",
    techStack: [
      "Go",
      "gRPC",
      "Protobuf",
      "Kubernetes",
      "BigQuery",
      "Grafana",
      "CI/CD",
      "Python",
    ],
    problem:
      "Enterprise cybersecurity platforms serve thousands of organizations and must balance velocity with reliability at every layer. Pre-merge testing was slow, production incidents were hard to reproduce in CI, and developer feedback loops needed acceleration without sacrificing release confidence.",
    approach:
      "Built a production Go-based distributed agent simulator and end-to-end test harness for microservices. Designed deterministic validation pipelines and golden test datasets to reproduce production incidents in CI. Replayed production-shaped traffic with randomized timing to surface latency regressions early. Designed an agentic internal platform (MCP server) orchestrating PagerDuty, Grafana, BigQuery, GitLab, Jira, and Confluence for automated incident triage.",
    constraints: [
      "Large-scale distributed systems with strict reliability requirements",
      "Cross-team coordination across multiple engineering organizations",
      "Security and compliance considerations in every change",
      "Must improve CI signal without increasing feedback time",
    ],
    outcomes: [
      "Improved pre-merge issue detection by ~20% and reduced feedback time from 4 min to 3 min",
      "Reproduced ~85% of recent production incidents in CI, reducing flaky failures by ~30%",
      "Surfaced p95/p99 latency regressions ~2 weeks earlier, catching ~10 performance regressions before release",
      "Reduced manual QA by ~40% and prevented ~5 post-merge regressions per quarter",
    ],
    reflection:
      "Working at this scale taught me that the hardest part of enterprise engineering isn't writing code — it's understanding the blast radius of every change, communicating across teams, and maintaining velocity without introducing risk. Building the agentic MCP platform for incident triage showed me how internal tooling can have outsized impact when it reduces cognitive load during high-pressure moments.",
    proofLinks: [
      {
        label: "LinkedIn Profile",
        url: "https://www.linkedin.com/in/fabrizio-corrales/",
      },
    ],
    disclosure: {
      anonymizationLevel: "anonymized",
      allowedClaims: [
        "Software Engineer at Palo Alto Networks (ADEM)",
        "Go-based distributed agent simulator",
        "CI feedback acceleration and deterministic validation",
        "Agentic MCP platform for incident triage",
        "Cross-team collaboration",
        "Approximate improvement percentages from resume",
      ],
      forbiddenClaims: [
        "Internal product UI screenshots",
        "Customer names or logos",
        "Specific revenue or ARR figures",
        "Proprietary architecture diagrams",
        "Internal tooling names beyond generic descriptions",
        "Confidential incident details",
      ],
      allowedAssetTypes: ["diagram", "text-block"],
      requiresDisclaimer: true,
      proofLinks: ["https://www.linkedin.com/in/fabrizio-corrales/"],
    },
    disclaimer:
      "This case study describes work at Palo Alto Networks using publicly available information from my resume and LinkedIn. Specific product UIs, customer details, internal metrics beyond what's on my resume, and proprietary architecture are omitted to respect confidentiality. The focus is on engineering challenges, approach, and measurable outcomes.",
    featured: true,
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}

export function getFeaturedCaseStudies(): CaseStudy[] {
  return caseStudies.filter((cs) => cs.featured);
}

export function getAllSlugs(): string[] {
  return caseStudies.map((cs) => cs.slug);
}
