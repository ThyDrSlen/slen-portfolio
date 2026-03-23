/* ── Boot Sequence ── */
export const bootLines = [
  "SLEN OS v1.0.0",
  "POST check .......... OK",
  "Loading kernel modules",
  "Mounting /work .......... 3 case studies found",
  "Initializing matrix rain",
  "Connecting to NYC backbone",
  "Starting slen.win on port 443",
  "System ready.",
] as const;

/* ── Terminal ── */
export const terminalConfig = {
  prompt: "visitor@slen.win:~$ ",
  welcomeMessage: [
    "Welcome to slen.win -- Fabrizio Corrales' portfolio",
    'Type "help" to see available commands.',
    "",
  ],
  motd: "Last login: today from NYC",
} as const;

export const terminalHelp: Record<string, string> = {
  help: "Show this help message",
  ls: "List pages and sections",
  cd: "Navigate to a page (cd work, cd about)",
  cat: "Read content (cat about, cat work/form-factor)",
  pwd: "Print current directory",
  whoami: "Who am I?",
  neofetch: "System info",
  uptime: "Time spent on this page",
  history: "Command history",
  clear: "Clear the terminal",
  echo: "Echo text back",
};

export const neofetchOutput = [
  "        ████████       visitor@slen.win",
  "      ██░░░░░░░░██     ──────────────────",
  "    ██░░████████░░██   OS: SLEN OS v1.0.0",
  "    ██░░██    ██░░██   Host: slen.win",
  "    ██░░████████░░██   Kernel: Next.js 16",
  "    ██░░░░░░░░░░░░██   Shell: React 19",
  "    ██░░██████░░░░██   Lang: TypeScript",
  "      ██░░░░░░░░██     Stack: Go, gRPC, K8s",
  "        ████████       Theme: Matrix [dark]",
  "                        Location: NYC",
] as const;

export const virtualFs: Record<string, string | Record<string, string>> = {
  "~": "home",
  about: "Backend-focused software engineer building scalable distributed systems, developer tooling, and platform capabilities. Currently at Palo Alto Networks.",
  work: {
    "form-factor":
      "Form Factor — Mobile fitness app with ARKit body tracking and Apple HealthKit. React Native, Expo, TypeScript, Supabase.",
    "orwell-scraper":
      "Orwell Web Scraper — Async scraping pipeline, 26k labeled assets, ~90% access rate. Python, Playwright, aiohttp.",
    "palo-alto":
      "Enterprise Platform Engineering — Go services, CI feedback acceleration, agentic MCP platform at Palo Alto Networks.",
    "portus":
      "Portus — Rust daemon for port collision prevention. Lease-based IPC, MCP server for AI agents, TUI dashboard.",
  },
  resume: "Download at: /resume.pdf",
};

export const easterEggs: Record<string, string[]> = {
  sudo: ["Nice try. Permission denied."],
  rm: ["rm: refusing to remove '/'. No recursive destruction today."],
  "rm -rf /": ["rm: refusing to remove '/'. No recursive destruction today."],
  vim: ["You've entered vim. Good luck getting out. (jk, type :q)"],
  emacs: ["M-x butterfly"],
  exit: ["There is no escape. Try 'cd' to navigate instead."],
  ping: ["PING slen.win: 64 bytes, time=0.42ms — we're fast."],
  "apt-get install job": ["E: Package 'job' not found. Try sending an email instead."],
  matrix: ["You're already in the Matrix."],
  "hack pentagon": ["Access denied. NSA has been notified. (not really)"],
  coffee: ["Brewing... ☕ Here you go."],
  nyc: ["The city that never sleeps. Neither does this server."],
};

/* ── Subway Status Bar ── */
export const subwayConfig = {
  statusMessages: [
    "open to new opportunities",
    "building Form Factor",
    "shipping Go services @ PANW",
    "based in bay area",
  ],
  lineColor: "#FF6319",
  lineName: "F",
  cycleIntervalMs: 5000,
} as const;

/* ── Shared Motion Tokens ── */
export const motionConfig = {
  typewriterCharDelayMs: 30,
  staggerDelayMs: 80,
  countUpDurationMs: 1200,
  bootLineDelayMs: 350,
  bootTotalDurationMs: 4000,
} as const;
