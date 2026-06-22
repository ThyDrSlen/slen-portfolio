import type { SiteConfig, ExperienceEntry } from "@/lib/content-schema";

export const siteConfig: SiteConfig = {
  name: "Fabrizio Corrales",
  title: "Slen Portfolio",
  tagline: "Software Engineer",
  subtitle: "Backend-focused \u00b7 Distributed Systems \u00b7 Developer Tooling",
  description:
    "Portfolio of Fabrizio Corrales. Backend-focused software engineer building scalable distributed systems, developer tooling, and platform capabilities.",
  url: "https://slen.win",
  email: "drslen9@gmail.com",
  socialLinks: [
    {
      platform: "github",
      url: "https://github.com/ThyDrSlen",
      label: "GitHub",
    },
    {
      platform: "linkedin",
      url: "https://www.linkedin.com/in/fabrizio-corrales/",
      label: "LinkedIn",
    },
    {
      platform: "email",
      url: "mailto:drslen9@gmail.com",
      label: "Email",
    },
  ],
};

export const experienceEntries: ExperienceEntry[] = [
  {
    company: "???",
    role: "Incoming Senior SWE",
    period: "Starting July 2026",
    description:
      "Beginning a new Senior SWE role in NYC in July 2026; company details intentionally held as a placeholder until public.",
    highlights: [
      "Continuing to focus on backend systems, platform engineering, and developer tooling",
      "Keeping the company placeholder public as ??? until the role can be announced",
    ],
  },
  {
    company: "Palo Alto Networks",
    role: "Software Engineer",
    period: "Aug 2024 – Jun 2026",
    description:
      "Backend-focused platform engineering on scalable distributed systems, developer tooling, and experimentation-friendly platform capabilities.",
    highlights: [
      "Designed an agentic internal platform (MCP server) orchestrating PagerDuty, Grafana, BigQuery, GitLab, Jira, and Confluence for automated triage",
      "Built a production Go-based distributed agent simulator and end-to-end test harness, improving pre-merge issue detection by ~20%",
      "Designed deterministic validation pipelines reproducing ~85% of recent production incidents in CI",
      "Integrated automated validation checks into CI and release gates, reducing manual QA by ~40%",
    ],
  },
  {
    company: "Form Factor",
    role: "Founder & Lead Engineer",
    period: "Sept 2025 – Present",
    description:
      "Mobile fitness app with real-time form analysis using ARKit body tracking and Apple HealthKit integration.",
    highlights: [
      "Integrating Apple HealthKit to sync heart-rate, step, and body-composition data into workout logs",
      "Using ARKit body tracking to record joint/pose metrics for form analysis",
      "Designing backend schemas in Supabase/Postgres for health and pose data",
    ],
  },
  {
    company: "The Marcy Lab School",
    role: "Software Engineering Fellow",
    period: "Sept 2022 – Sept 2023",
    description:
      "Completed 2,000 hours of coursework in web applications development, CS fundamentals, and leadership development.",
  },
  {
    company: "Hunter College",
    role: "Computer Science",
    period: "Aug 2020 – May 2022",
    description:
      "Coursework in Discrete Structures and Software Analysis.",
  },
];

export const heroContent = {
  headline: "Fabrizio Corrales",
  subhead:
    "Backend-focused software engineer building scalable distributed systems, developer tooling, and platform capabilities. Incoming Senior SWE at ??? in NYC starting July 2026 after platform engineering work at Palo Alto Networks.",
  cta: {
    label: "See the work",
    href: "/work",
  },
};

export const aboutContent = {
  intro:
    "I'm a backend-focused software engineer with a non-traditional path: Hunter College to the Marcy Lab School fellowship to enterprise platform engineering at Palo Alto Networks, with a new Senior SWE role starting at ??? in NYC in July 2026. I build scalable distributed systems, developer tooling, and experimentation-friendly platform capabilities. I care about shipping things that work at scale and proving it with measurable outcomes.",
  introSections: [
    "I'm a backend-focused software engineer with a non-traditional path — Hunter College to the Marcy Lab School fellowship to enterprise platform engineering at Palo Alto Networks.",
    "I ended my Palo Alto Networks role in June 2026 and begin a new Senior SWE role at ??? in NYC in July 2026.",
    "I build scalable distributed systems, developer tooling, and experimentation-friendly platform capabilities. I care about shipping things that work at scale and proving it with measurable outcomes.",
  ],
  currentFocus:
    "Preparing to begin a new Senior SWE role at ??? in NYC in July 2026 while continuing to build Form Factor, a mobile fitness app with real-time ARKit body tracking and Apple HealthKit integration.",
};

export const proofRailItems = [
  {
    metric: { value: 20, suffix: "%" },
    label: "better pre-merge detection",
    detail:
      "Built CI validation at Palo Alto Networks that surfaced issues before release.",
  },
  {
    metric: { value: 85, suffix: "%" },
    label: "incident replay in CI",
    detail:
      "Designed deterministic validation pipelines that reproduced recent production failures.",
  },
  {
    metric: { value: 26, suffix: "k" },
    label: "labeled assets shipped",
    detail:
      "Built an async scraping pipeline with resilient access for downstream classification work.",
  },
  {
    metric: null,
    label: "Building Form Factor solo",
    detail:
      "Building a mobile product using ARKit body tracking and Apple HealthKit integration.",
  },
];

export const skillCategories = [
  {
    label: "Languages",
    skills: ["Go", "Python", "TypeScript", "Rust", "SQL"],
  },
  {
    label: "Infrastructure",
    skills: ["Kubernetes", "Docker", "gRPC", "Protobuf", "CI/CD"],
  },
  {
    label: "Data & Observability",
    skills: ["BigQuery", "Grafana", "Prometheus", "PostgreSQL"],
  },
  {
    label: "Frameworks",
    skills: [
      "React Native",
      "Expo",
      "Next.js",
      "Supabase",
      "Playwright",
    ],
  },
];

export const lookingFor =
  "I'm focused on backend and platform engineering work where I can build distributed systems, developer tooling, and infrastructure at scale. I thrive in environments that value ownership, measurable impact, and shipping things that work under pressure.";
