import { validateCaseStudies, type CaseStudy } from "@/lib/content-schema";

export const caseStudies: CaseStudy[] = [
  {
    slug: "form-factor",
    title: "Form Factor",
    summary:
      "A mobile fitness app that uses ARKit body tracking and Apple HealthKit to deliver real-time exercise form analysis, built from zero to shipped product.",
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
      "Form Factor proved I can take a product from concept to shipping code on my own. The hardest part wasn't any single technology. It was making architectural decisions across mobile, backend, and health data with no team to delegate to. Every tradeoff was mine to own, from schema design for future ML features to privacy constraints on body tracking data.",
    proofLinks: [
      {
        label: "GitHub Repository",
        url: "https://github.com/ThyDrSlen/form-factor",
      },
    ],
    media: [
      {
        type: "diagram",
        content: [
          "┌──────────────────────────────────────────────┐",
          "│                 iOS Device                    │",
          "│  ┌────────────┐ ┌───────────┐ ┌───────────┐ │",
          "│  │ React      │ │ ARKit     │ │ Health    │ │",
          "│  │ Native UI  │ │ Body      │ │ Kit       │ │",
          "│  │ (Expo)     │ │ Tracking  │ │ Sync      │ │",
          "│  └─────┬──────┘ └─────┬─────┘ └─────┬─────┘ │",
          "│        └──────┬───────┘─────┬────────┘       │",
          "└───────────────┼─────────────┼────────────────┘",
          "          ┌─────▼─────┐ ┌─────▼─────┐",
          "          │ Supabase  │ │ Pose &    │",
          "          │ Auth +    │ │ Health    │",
          "          │ Realtime  │ │ Data      │",
          "          └─────┬─────┘ └─────┬─────┘",
          "          ┌─────▼─────────────▼─────┐",
          "          │   PostgreSQL             │",
          "          │   Workout · Pose · Health│",
          "          └─────────────────────────┘",
        ].join("\n"),
        caption: "Form Factor — mobile client to backend data flow",
        diagramNodes: [
          { id: "mobile", position: { x: 220, y: 20 }, data: { label: "iOS Device\nExpo + React Native" } },
          { id: "arkit", position: { x: 20, y: 150 }, data: { label: "ARKit\nBody tracking" } },
          { id: "healthkit", position: { x: 220, y: 150 }, data: { label: "HealthKit\nWatch sync" } },
          { id: "supabase", position: { x: 420, y: 150 }, data: { label: "Supabase\nAuth + Realtime" } },
          { id: "postgres", position: { x: 220, y: 280 }, data: { label: "Postgres\nWorkout · pose · health" } },
        ],
        diagramEdges: [
          { id: "mobile-arkit", source: "mobile", target: "arkit", animated: true, label: "pose" },
          { id: "mobile-healthkit", source: "mobile", target: "healthkit", animated: true, label: "metrics" },
          { id: "mobile-supabase", source: "mobile", target: "supabase", label: "sessions" },
          { id: "arkit-postgres", source: "arkit", target: "postgres", label: "joint data" },
          { id: "healthkit-postgres", source: "healthkit", target: "postgres", label: "health data" },
          { id: "supabase-postgres", source: "supabase", target: "postgres", label: "storage" },
        ],
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
    media: [
      {
        type: "diagram",
        content: [
          "┌─────────────┐   ┌──────────────┐   ┌────────────────┐",
          "│ Target URLs  │──▶│ Playwright   │──▶│ aiohttp        │",
          "│              │   │ Browser      │   │ Async Pool     │",
          "└─────────────┘   └──────┬───────┘   └───────┬────────┘",
          "                         │                    │",
          "                  ┌──────▼───────┐   ┌───────▼────────┐",
          "                  │ Anti-        │   │ Rate Limiting  │",
          "                  │ Detection    │   │ + Pacing       │",
          "                  └──────┬───────┘   └───────┬────────┘",
          "                         └────────┬──────────┘",
          "                                  │",
          "                         ┌────────▼────────┐",
          "                         │ Proxy Rotation  │",
          "                         │ (~90% success)  │",
          "                         └────────┬────────┘",
          "                                  │",
          "                         ┌────────▼────────┐",
          "                         │ 26k Labeled     │",
          "                         │ Assets          │",
          "                         └─────────────────┘",
        ].join("\n"),
        caption: "Orwell — async scraping pipeline with resilience layer",
        diagramNodes: [
          { id: "urls", position: { x: 20, y: 30 }, data: { label: "Target URLs\nSeed queue" } },
          { id: "browser", position: { x: 220, y: 30 }, data: { label: "Playwright\nBrowser" } },
          { id: "aiohttp", position: { x: 420, y: 30 }, data: { label: "aiohttp\nAsync pool" } },
          { id: "detection", position: { x: 120, y: 165 }, data: { label: "Anti-detection\nBrowser churn" } },
          { id: "pacing", position: { x: 330, y: 165 }, data: { label: "Rate limiting\nPacing" } },
          { id: "proxy", position: { x: 220, y: 290 }, data: { label: "Proxy rotation\n~90% access" } },
          { id: "assets", position: { x: 420, y: 290 }, data: { label: "26k assets\nLabeled output" } },
        ],
        diagramEdges: [
          { id: "urls-browser", source: "urls", target: "browser" },
          { id: "browser-aiohttp", source: "browser", target: "aiohttp", animated: true },
          { id: "browser-detection", source: "browser", target: "detection", label: "render" },
          { id: "aiohttp-pacing", source: "aiohttp", target: "pacing", label: "fetch" },
          { id: "detection-proxy", source: "detection", target: "proxy" },
          { id: "pacing-proxy", source: "pacing", target: "proxy" },
          { id: "proxy-assets", source: "proxy", target: "assets", label: "clean data" },
        ],
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
      "Backend-focused platform engineering on scalable distributed systems at Palo Alto Networks. Building Go services, CI feedback acceleration, and operational analytics.",
    role: "Software Engineer",
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
      "Working at this scale taught me that the hardest part of enterprise engineering isn't writing code. It's understanding the blast radius of every change, communicating across teams, and maintaining velocity without introducing risk. Building the agentic MCP platform for incident triage showed me how internal tooling can have outsized impact when it reduces cognitive load during high-pressure moments.",
    proofLinks: [
      {
        label: "LinkedIn Profile",
        url: "https://www.linkedin.com/in/fabrizio-corrales/",
      },
    ],
    media: [
      {
        type: "diagram",
        content: [
          "┌────────────┐   ┌─────────────┐   ┌──────────────────┐",
          "│ Developer   │──▶│ Git Push /  │──▶│ Agent Simulator  │",
          "│ Commit      │   │ CI Trigger  │   │ (Go, gRPC)       │",
          "└────────────┘   └─────────────┘   └────────┬─────────┘",
          "                                            │",
          "                  ┌─────────────┐   ┌───────▼─────────┐",
          "                  │ Release     │◀──│ Validation      │",
          "                  │ Gate        │   │ Pipeline        │",
          "                  └──────┬──────┘   └───────┬─────────┘",
          "                         │                  │",
          "                  ┌──────▼──────┐   ┌───────▼─────────┐",
          "                  │ Production  │   │ Golden Tests +  │",
          "                  │ Deploy      │   │ Traffic Replay  │",
          "                  └─────────────┘   └─────────────────┘",
          "",
          "┌──────────────────────────────────────────────────────┐",
          "│ MCP Agentic Platform                                 │",
          "│ PagerDuty · Grafana · BigQuery · GitLab · Jira      │",
          "└──────────────────────────────────────────────────────┘",
        ].join("\n"),
        caption: "CI feedback loop with agent simulator and agentic triage platform",
        diagramNodes: [
          { id: "commit", position: { x: 20, y: 35 }, data: { label: "Developer\nCommit" } },
          { id: "ci", position: { x: 220, y: 35 }, data: { label: "CI Trigger\nPre-merge" } },
          { id: "sim", position: { x: 420, y: 35 }, data: { label: "Agent Simulator\nGo + gRPC" } },
          { id: "validation", position: { x: 320, y: 175 }, data: { label: "Validation\nPipeline" } },
          { id: "golden", position: { x: 520, y: 175 }, data: { label: "Golden tests\nTraffic replay" } },
          { id: "gate", position: { x: 220, y: 305 }, data: { label: "Release gate\nSignal" } },
          { id: "mcp", position: { x: 420, y: 305 }, data: { label: "MCP platform\nPD · Grafana · BQ" } },
        ],
        diagramEdges: [
          { id: "commit-ci", source: "commit", target: "ci" },
          { id: "ci-sim", source: "ci", target: "sim", animated: true },
          { id: "sim-validation", source: "sim", target: "validation", label: "replay" },
          { id: "sim-golden", source: "sim", target: "golden", label: "fixtures" },
          { id: "validation-gate", source: "validation", target: "gate", label: "pass/fail" },
          { id: "golden-gate", source: "golden", target: "gate" },
          { id: "mcp-validation", source: "mcp", target: "validation", label: "triage" },
        ],
      },
    ],
    disclosure: {
      anonymizationLevel: "none",
      allowedClaims: [
        "Software Engineer at Palo Alto Networks",
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
  {
    slug: "portus",
    title: "Portus",
    summary:
      "A Rust daemon that brokers port allocations atomically, preventing collisions between dev servers and AI coding agents via lease-based IPC and an MCP server.",
    role: "Solo Developer",
    period: "2025",
    techStack: [
      "Rust",
      "Tokio",
      "Unix Sockets",
      "MCP",
      "TUI (ratatui)",
      "TOML",
    ],
    problem:
      "Every dev machine has the same fight: multiple services all want port 3000, and whoever starts last loses. It gets worse when AI coding agents like Claude Code and Cursor spin up parallel workspaces that each try to bind the same ports, causing cascading failures that are hard to diagnose and annoying to fix manually.",
    approach:
      "Built a background daemon that brokers port allocations atomically. Every service asks Portus for a port before binding. Portus checks availability, records a time-bounded lease, and hands back a guaranteed-unique port. Designed a length-prefixed JSON IPC protocol over Unix sockets for the CLI-to-daemon communication. Added an MCP server so AI agents get native port allocation without any manual coordination. Built a TUI dashboard for real-time monitoring of allocations and listeners.",
    constraints: [
      "Must be zero-config — daemon auto-starts on first CLI use",
      "Must handle concurrent allocation requests atomically",
      "Must recover gracefully from crashes via lease expiry",
      "Must work cross-platform (macOS, Linux, Windows)",
      "Must integrate with AI agents via MCP protocol",
    ],
    outcomes: [
      "Shipped a complete CLI with request, release, confirm, list, scan, kill, run, and dashboard commands",
      "Built an MCP server exposing 5 tools for native AI agent integration",
      "Implemented lease-based allocation with auto-expiry and crash recovery via persisted registry",
      "Built a TUI dashboard for real-time port allocation monitoring",
      "Designed signal-safe cleanup ensuring leases release on SIGTERM/SIGINT",
    ],
    reflection:
      "Portus came from a real pain point I hit while using AI coding agents. The problem is simple but the solution touches systems programming fundamentals: IPC design, concurrent state management, crash recovery, and cross-platform compatibility. Building the MCP server integration was particularly interesting because it required thinking about how AI agents interact with system resources differently from human developers.",
    proofLinks: [
      {
        label: "GitHub Repository",
        url: "https://github.com/ThyDrSlen/portus",
      },
    ],
    media: [
      {
        type: "diagram",
        content: [
          "┌────────────┐ ┌────────────┐ ┌────────────┐",
          "│ Dev Server │ │ AI Agent   │ │ TUI        │",
          "│ (portus    │ │ (MCP       │ │ Dashboard  │",
          "│  request)  │ │  client)   │ │            │",
          "└─────┬──────┘ └─────┬──────┘ └─────┬──────┘",
          "      │              │               │",
          "      └──────┬───────┘──────┬────────┘",
          "             │              │",
          "    ┌────────▼───────┐ ┌────▼──────────┐",
          "    │ Unix Socket   │ │ MCP Server    │",
          "    │ IPC (JSON)    │ │ (5 tools)     │",
          "    └────────┬──────┘ └────┬───────────┘",
          "             │             │",
          "        ┌────▼─────────────▼────┐",
          "        │   Portus Daemon       │",
          "        │   ┌────────────────┐  │",
          "        │   │ Port Registry  │  │",
          "        │   │ (Lease-based)  │  │",
          "        │   └────────────────┘  │",
          "        │   ┌────────────────┐  │",
          "        │   │ Crash Recovery │  │",
          "        │   │ (Persisted)    │  │",
          "        │   └────────────────┘  │",
          "        └───────────────────────┘",
        ].join("\n"),
        caption: "Portus — daemon architecture with IPC and MCP integration",
        diagramNodes: [
          { id: "dev", position: { x: 20, y: 35 }, data: { label: "Dev server\nportus request" } },
          { id: "agent", position: { x: 220, y: 35 }, data: { label: "AI agent\nMCP client" } },
          { id: "tui", position: { x: 420, y: 35 }, data: { label: "TUI\nDashboard" } },
          { id: "ipc", position: { x: 120, y: 175 }, data: { label: "Unix socket\nJSON IPC" } },
          { id: "mcp", position: { x: 330, y: 175 }, data: { label: "MCP server\n5 tools" } },
          { id: "daemon", position: { x: 220, y: 305 }, data: { label: "Portus daemon\nAtomic broker" } },
          { id: "registry", position: { x: 420, y: 305 }, data: { label: "Registry\nLeases + recovery" } },
        ],
        diagramEdges: [
          { id: "dev-ipc", source: "dev", target: "ipc", label: "request" },
          { id: "agent-mcp", source: "agent", target: "mcp", animated: true, label: "tools" },
          { id: "tui-mcp", source: "tui", target: "mcp", label: "observe" },
          { id: "ipc-daemon", source: "ipc", target: "daemon" },
          { id: "mcp-daemon", source: "mcp", target: "daemon" },
          { id: "daemon-registry", source: "daemon", target: "registry", label: "lease" },
        ],
      },
    ],
    disclosure: {
      anonymizationLevel: "none",
      allowedClaims: [
        "Rust daemon for port allocation",
        "MCP server for AI agent integration",
        "Lease-based IPC protocol",
        "TUI dashboard",
        "Cross-platform support",
        "Signal-safe cleanup",
      ],
      forbiddenClaims: [],
      allowedAssetTypes: ["diagram", "screenshot", "text-block"],
      requiresDisclaimer: false,
      proofLinks: ["https://github.com/ThyDrSlen/portus"],
    },
    featured: true,
  },
] satisfies CaseStudy[];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}

export function getFeaturedCaseStudies(): CaseStudy[] {
  return caseStudies.filter((cs) => cs.featured);
}

export function getAllSlugs(): string[] {
  return caseStudies.map((cs) => cs.slug);
}

export function getAdjacentCaseStudies(slug: string): {
  previous: CaseStudy | null;
  next: CaseStudy | null;
} {
  const index = caseStudies.findIndex((cs) => cs.slug === slug);

  if (index === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: caseStudies[index - 1] ?? null,
    next: caseStudies[index + 1] ?? null,
  };
}

if (process.env.NODE_ENV !== "production") {
  validateCaseStudies(caseStudies);
}
