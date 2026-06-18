"use client";

import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  ReactFlowProvider,
  type Node,
  type Edge,
  type NodeProps,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { ArchDiagramNodeData } from "@/content/diagram-data";

function ArchNode({ data }: NodeProps<Node<ArchDiagramNodeData>>) {
  return (
    <div
      style={{
        background: "var(--color-bg-surface)",
        border: "1px solid var(--color-accent)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-3) var(--space-4)",
        fontFamily: "var(--font-mono)",
        minWidth: 120,
        textAlign: "center",
        boxShadow: "0 0 8px rgba(0, 255, 65, 0.1)",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: "var(--color-accent)",
          border: "none",
          width: 6,
          height: 6,
        }}
      />
      <div
        style={{
          color: "var(--color-accent)",
          fontSize: "var(--text-xs)",
          fontWeight: 600,
          lineHeight: 1.3,
        }}
      >
        {data.label}
      </div>
      {data.description && (
        <div
          style={{
            color: "var(--color-text-muted)",
            fontSize: "0.65rem",
            marginTop: 2,
            lineHeight: 1.2,
          }}
        >
          {data.description}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: "var(--color-accent)",
          border: "none",
          width: 6,
          height: 6,
        }}
      />
    </div>
  );
}

function GroupNode({ data }: NodeProps<Node<ArchDiagramNodeData>>) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "rgba(10, 10, 10, 0.6)",
        border: "1px dashed var(--color-accent-dim)",
        borderRadius: "var(--radius-md)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 6,
          left: 10,
          color: "var(--color-accent-dim)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          fontWeight: 600,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {data.label}
      </div>
    </div>
  );
}

const nodeTypes: NodeTypes = {
  archNode: ArchNode,
  group: GroupNode,
};

const defaultEdgeOptions = {
  style: {
    stroke: "var(--color-accent-dim)",
    strokeWidth: 1.5,
  },
};

interface ArchitectureDiagramProps {
  nodes: Node[];
  edges: Edge[];
  caption?: string;
  height?: number;
}

export default function ArchitectureDiagram({
  nodes,
  edges,
  caption,
  height = 450,
}: ArchitectureDiagramProps) {
  return (
    <div data-testid="project-diagram">
      <ReactFlowProvider>
        <div
          role="img"
          aria-label={caption || "Architecture diagram"}
          style={{ height, width: "100%" }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            panOnDrag={false}
            zoomOnScroll={false}
            zoomOnDoubleClick={false}
            panOnScroll={false}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            proOptions={{ hideAttribution: true }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color="rgba(0, 255, 65, 0.05)"
            />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
      {caption && (
        <p
          className="mono"
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            marginTop: "var(--space-2)",
          }}
        >
          {caption}
        </p>
      )}
    </div>
  );
}
