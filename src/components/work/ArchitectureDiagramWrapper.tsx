"use client";

import dynamic from "next/dynamic";
import type { Node, Edge } from "@xyflow/react";

const ArchitectureDiagram = dynamic(() => import("./ArchitectureDiagram"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 450,
        width: "100%",
        background: "var(--color-bg-elevated)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-xs)",
        color: "var(--color-text-muted)",
        animation: "pulse 2s ease-in-out infinite",
      }}
    >
      Loading diagram…
    </div>
  ),
});

interface ArchitectureDiagramWrapperProps {
  nodes: Record<string, unknown>[];
  edges: Record<string, unknown>[];
  caption?: string;
  height?: number;
}

export default function ArchitectureDiagramWrapper({
  nodes,
  edges,
  ...rest
}: ArchitectureDiagramWrapperProps) {
  return (
    <ArchitectureDiagram
      nodes={nodes as Node[]}
      edges={edges as Edge[]}
      {...rest}
    />
  );
}
