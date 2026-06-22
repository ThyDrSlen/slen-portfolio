import type { Node } from "@xyflow/react";

export interface ArchDiagramNodeData {
  label: string;
  description?: string;
  [key: string]: unknown;
}

export interface DiagramConfig {
  nodes: Node<ArchDiagramNodeData>[];
  edges: ArchDiagramEdge[];
}

export interface ArchDiagramEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  label?: string;
  [key: string]: unknown;
}

export const formFactorDiagram: DiagramConfig = {
  nodes: [
    {
      id: "ios-device",
      type: "group",
      position: { x: 0, y: 0 },
      data: { label: "iOS Device" },
      style: { width: 520, height: 160 },
    },
    {
      id: "react-native",
      type: "archNode",
      position: { x: 20, y: 40 },
      data: { label: "React Native UI", description: "Expo" },
      parentId: "ios-device",
      extent: "parent" as const,
    },
    {
      id: "arkit",
      type: "archNode",
      position: { x: 190, y: 40 },
      data: { label: "ARKit", description: "Body Tracking" },
      parentId: "ios-device",
      extent: "parent" as const,
    },
    {
      id: "healthkit",
      type: "archNode",
      position: { x: 360, y: 40 },
      data: { label: "HealthKit", description: "Sync" },
      parentId: "ios-device",
      extent: "parent" as const,
    },
    {
      id: "supabase",
      type: "archNode",
      position: { x: 60, y: 220 },
      data: { label: "Supabase", description: "Auth + Realtime" },
    },
    {
      id: "pose-data",
      type: "archNode",
      position: { x: 300, y: 220 },
      data: { label: "Pose & Health", description: "Data" },
    },
    {
      id: "postgres",
      type: "archNode",
      position: { x: 150, y: 360 },
      data: { label: "PostgreSQL", description: "Workout · Pose · Health" },
    },
  ],
  edges: [
    { id: "e-rn-supa", source: "react-native", target: "supabase", animated: true, type: "smoothstep" },
    { id: "e-arkit-pose", source: "arkit", target: "pose-data", animated: true, type: "smoothstep" },
    { id: "e-hk-pose", source: "healthkit", target: "pose-data", animated: true, type: "smoothstep" },
    { id: "e-supa-pg", source: "supabase", target: "postgres", animated: true, type: "smoothstep" },
    { id: "e-pose-pg", source: "pose-data", target: "postgres", animated: true, type: "smoothstep" },
  ],
};

export const orwellDiagram: DiagramConfig = {
  nodes: [
    { id: "target-urls", type: "archNode", position: { x: 0, y: 0 }, data: { label: "Target URLs" } },
    { id: "playwright", type: "archNode", position: { x: 200, y: 0 }, data: { label: "Playwright", description: "Browser" } },
    { id: "aiohttp", type: "archNode", position: { x: 400, y: 0 }, data: { label: "aiohttp", description: "Async Pool" } },
    { id: "anti-detection", type: "archNode", position: { x: 120, y: 140 }, data: { label: "Anti-Detection" } },
    { id: "rate-limiting", type: "archNode", position: { x: 340, y: 140 }, data: { label: "Rate Limiting" } },
    { id: "proxy-rotation", type: "archNode", position: { x: 200, y: 270 }, data: { label: "Proxy Rotation", description: "~90% success" } },
    { id: "labeled-assets", type: "archNode", position: { x: 200, y: 390 }, data: { label: "26k Labeled", description: "Assets" } },
  ],
  edges: [
    { id: "e-urls-pw", source: "target-urls", target: "playwright", animated: true, type: "smoothstep" },
    { id: "e-pw-aio", source: "playwright", target: "aiohttp", animated: true, type: "smoothstep" },
    { id: "e-pw-ad", source: "playwright", target: "anti-detection", animated: true, type: "smoothstep" },
    { id: "e-aio-rl", source: "aiohttp", target: "rate-limiting", animated: true, type: "smoothstep" },
    { id: "e-ad-proxy", source: "anti-detection", target: "proxy-rotation", animated: true, type: "smoothstep" },
    { id: "e-rl-proxy", source: "rate-limiting", target: "proxy-rotation", animated: true, type: "smoothstep" },
    { id: "e-proxy-assets", source: "proxy-rotation", target: "labeled-assets", animated: true, type: "smoothstep" },
  ],
};

export const paloAltoDiagram: DiagramConfig = {
  nodes: [
    { id: "dev-commit", type: "archNode", position: { x: 0, y: 0 }, data: { label: "Developer", description: "Commit" } },
    { id: "ci-trigger", type: "archNode", position: { x: 200, y: 0 }, data: { label: "Git Push", description: "CI Trigger" } },
    { id: "agent-sim", type: "archNode", position: { x: 420, y: 0 }, data: { label: "Agent Simulator", description: "Go" } },
    { id: "validation", type: "archNode", position: { x: 340, y: 140 }, data: { label: "Validation", description: "Pipeline" } },
    { id: "release-gate", type: "archNode", position: { x: 120, y: 140 }, data: { label: "Release Gate" } },
    { id: "prod-deploy", type: "archNode", position: { x: 80, y: 270 }, data: { label: "Production", description: "Deploy" } },
    { id: "golden-tests", type: "archNode", position: { x: 310, y: 270 }, data: { label: "Golden Tests", description: "+ Replay" } },
    { id: "mcp-group", type: "group", position: { x: 0, y: 390 }, data: { label: "MCP Agentic Platform" }, style: { width: 560, height: 80 } },
    {
      id: "mcp-services",
      type: "archNode",
      position: { x: 20, y: 30 },
      data: { label: "PagerDuty · Grafana · BigQuery · GitLab · Jira" },
      parentId: "mcp-group",
      extent: "parent" as const,
    },
  ],
  edges: [
    { id: "e-dev-ci", source: "dev-commit", target: "ci-trigger", animated: true, type: "smoothstep" },
    { id: "e-ci-agent", source: "ci-trigger", target: "agent-sim", animated: true, type: "smoothstep" },
    { id: "e-agent-val", source: "agent-sim", target: "validation", animated: true, type: "smoothstep" },
    { id: "e-val-gate", source: "validation", target: "release-gate", animated: true, type: "smoothstep" },
    { id: "e-gate-prod", source: "release-gate", target: "prod-deploy", animated: true, type: "smoothstep" },
    { id: "e-val-golden", source: "validation", target: "golden-tests", animated: true, type: "smoothstep" },
  ],
};

export const portusDiagram: DiagramConfig = {
  nodes: [
    { id: "dev-server", type: "archNode", position: { x: 0, y: 0 }, data: { label: "Dev Server", description: "portus" } },
    { id: "ai-agent", type: "archNode", position: { x: 200, y: 0 }, data: { label: "AI Agent", description: "MCP" } },
    { id: "tui", type: "archNode", position: { x: 400, y: 0 }, data: { label: "TUI", description: "Dashboard" } },
    { id: "unix-socket", type: "archNode", position: { x: 60, y: 140 }, data: { label: "Unix Socket IPC", description: "JSON" } },
    { id: "mcp-server", type: "archNode", position: { x: 310, y: 140 }, data: { label: "MCP Server", description: "5 tools" } },
    { id: "daemon-group", type: "group", position: { x: 70, y: 280 }, data: { label: "Portus Daemon" }, style: { width: 400, height: 160 } },
    {
      id: "port-registry",
      type: "archNode",
      position: { x: 20, y: 45 },
      data: { label: "Port Registry", description: "Lease-based" },
      parentId: "daemon-group",
      extent: "parent" as const,
    },
    {
      id: "crash-recovery",
      type: "archNode",
      position: { x: 220, y: 45 },
      data: { label: "Crash Recovery", description: "Persisted" },
      parentId: "daemon-group",
      extent: "parent" as const,
    },
  ],
  edges: [
    { id: "e-dev-unix", source: "dev-server", target: "unix-socket", animated: true, type: "smoothstep" },
    { id: "e-ai-unix", source: "ai-agent", target: "unix-socket", animated: true, type: "smoothstep" },
    { id: "e-ai-mcp", source: "ai-agent", target: "mcp-server", animated: true, type: "smoothstep" },
    { id: "e-tui-mcp", source: "tui", target: "mcp-server", animated: true, type: "smoothstep" },
    { id: "e-unix-registry", source: "unix-socket", target: "port-registry", animated: true, type: "smoothstep" },
    { id: "e-mcp-registry", source: "mcp-server", target: "port-registry", animated: true, type: "smoothstep" },
    { id: "e-mcp-crash", source: "mcp-server", target: "crash-recovery", animated: true, type: "smoothstep" },
  ],
};
