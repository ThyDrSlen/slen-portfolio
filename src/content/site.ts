import type { SiteConfig, ExperienceEntry } from "@/lib/content-schema";

export const siteConfig: SiteConfig = {
  name: "Fabrizio Corrales",
  title: "Slen Portfolio",
  description:
    "Portfolio of Fabrizio Corrales — backend-focused software engineer building scalable distributed systems, developer tooling, and platform capabilities.",
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
    company: "Palo Alto Networks",
    role: "Software Engineer (ADEM)",
    period: "Aug 2024 – Present",
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
      "Integrated Apple HealthKit to sync heart-rate, step, and body-composition data into workout logs",
      "Used ARKit body tracking to record joint/pose metrics for form analysis",
      "Designed backend schemas in Supabase/Postgres for health and pose data",
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
    "Backend-focused software engineer building scalable distributed systems, developer tooling, and platform capabilities. Currently at Palo Alto Networks.",
  cta: {
    label: "See the work",
    href: "/work",
  },
};

export const aboutContent = {
  intro:
    "I'm a backend-focused software engineer with a non-traditional path — from Hunter College to the Marcy Lab School fellowship to enterprise platform engineering at Palo Alto Networks. I build scalable distributed systems, developer tooling, and experimentation-friendly platform capabilities. I care about shipping things that work at scale and proving it with measurable outcomes.",
  currentFocus:
    "Currently building Go services, CI feedback acceleration, and operational analytics at Palo Alto Networks (ADEM), while shipping Form Factor — a mobile fitness app with real-time ARKit body tracking and Apple HealthKit integration.",
};

export const proofRailItems = [
  {
    label: "Palo Alto Networks",
    detail: "Software Engineer, enterprise platform engineering",
  },
  {
    label: "Form Factor",
    detail: "Shipped mobile product with real-time CV form analysis",
  },
  {
    label: "Marcy Lab School",
    detail: "Non-traditional path, board member, 2,000-hour fellowship",
  },
  {
    label: "Google SHPE Scholar",
    detail: "Conference scholarship recipient",
  },
];
