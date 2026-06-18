type DiagramNode = {
  id: string;
  position: { x: number; y: number };
  data: { label: string };
};

type DiagramEdge = {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  label?: string;
};

type ProjectDiagramProps = {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  label: string;
};

const NODE_WIDTH = 156;
const NODE_HEIGHT = 64;
const PADDING = 32;

function splitLabel(label: string): string[] {
  return label.split("\n").map((line) => line.trim()).filter(Boolean);
}

function getNodeCenter(node: DiagramNode) {
  return {
    x: node.position.x + NODE_WIDTH / 2,
    y: node.position.y + NODE_HEIGHT / 2,
  };
}

export function ProjectDiagram({ nodes, edges, label }: ProjectDiagramProps) {
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const minX = Math.min(...nodes.map((node) => node.position.x)) - PADDING;
  const minY = Math.min(...nodes.map((node) => node.position.y)) - PADDING;
  const maxX = Math.max(...nodes.map((node) => node.position.x + NODE_WIDTH)) + PADDING;
  const maxY = Math.max(...nodes.map((node) => node.position.y + NODE_HEIGHT)) + PADDING;

  return (
    <div
      data-testid="project-diagram"
      role="img"
      aria-label={label}
      style={{
        width: "100%",
        overflowX: "auto",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        background:
          "radial-gradient(circle at 20% 20%, var(--color-accent-glow), transparent 28%), var(--color-bg)",
        padding: "var(--space-4)",
      }}
    >
      <svg
        viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
        width="100%"
        height="420"
        style={{ minWidth: 620, display: "block" }}
        aria-hidden="true"
      >
        <defs>
          <marker
            id="diagram-arrow"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="var(--color-accent)" />
          </marker>
        </defs>

        {edges.map((edge) => {
          const source = nodeById.get(edge.source);
          const target = nodeById.get(edge.target);
          if (!source || !target) return null;
          const start = getNodeCenter(source);
          const end = getNodeCenter(target);
          const labelX = (start.x + end.x) / 2;
          const labelY = (start.y + end.y) / 2 - 8;

          return (
            <g key={edge.id}>
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="var(--color-accent)"
                strokeWidth="2"
                strokeOpacity="0.72"
                strokeDasharray={edge.animated ? "6 6" : undefined}
                markerEnd="url(#diagram-arrow)"
              />
              {edge.label && (
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  fill="var(--color-text-muted)"
                  fontFamily="var(--font-mono)"
                  fontSize="11"
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {nodes.map((node) => {
          const lines = splitLabel(node.data.label);
          const firstLineY = node.position.y + NODE_HEIGHT / 2 - (lines.length - 1) * 8;

          return (
            <g key={node.id}>
              <rect
                x={node.position.x}
                y={node.position.y}
                width={NODE_WIDTH}
                height={NODE_HEIGHT}
                rx="10"
                fill="var(--color-bg-elevated)"
                stroke="var(--color-border)"
              />
              <rect
                x={node.position.x + 1}
                y={node.position.y + 1}
                width={NODE_WIDTH - 2}
                height={NODE_HEIGHT - 2}
                rx="9"
                fill="none"
                stroke="var(--color-accent)"
                strokeOpacity="0.26"
              />
              {lines.map((line, index) => (
                <text
                  key={`${node.id}-${line}`}
                  x={node.position.x + NODE_WIDTH / 2}
                  y={firstLineY + index * 16}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={index === 0 ? "var(--color-text)" : "var(--color-text-secondary)"}
                  fontFamily="var(--font-mono)"
                  fontSize={index === 0 ? "13" : "11"}
                  fontWeight={index === 0 ? 600 : 400}
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
