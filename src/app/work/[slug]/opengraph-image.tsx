import { ImageResponse } from "next/og";
import { caseStudies } from "@/content/case-studies";
import { siteConfig } from "@/content/site";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage({ params }: { params: { slug: string } }) {
  const cs = caseStudies.find((c) => c.slug === params.slug);
  const title = cs?.title ?? "Case Study";
  const summary = cs?.summary ?? "";
  const role = cs?.role ?? "";
  const period = cs?.period ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0a0a0a",
          fontFamily: '"IBM Plex Mono", monospace',
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            width: "100%",
            height: "4px",
            background:
              "linear-gradient(90deg, #00ff41 0%, #00ff41 60%, transparent 100%)",
            flexShrink: 0,
          }}
        />

        {/* CRT scan-line overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 65, 0.03) 2px, rgba(0, 255, 65, 0.03) 4px)",
            display: "flex",
            pointerEvents: "none",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            flexGrow: 1,
            padding: "60px 80px 48px 80px",
          }}
        >
          {/* Label */}
          <div
            style={{
              display: "flex",
              fontSize: 14,
              color: "#00ff41",
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontWeight: 400,
            }}
          >
            Case Study
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              fontSize: 52,
              fontWeight: 700,
              color: "#ededed",
              marginBottom: 16,
              letterSpacing: "-1px",
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>

          {/* Role · Period */}
          {(role || period) && (
            <div
              style={{
                display: "flex",
                fontSize: 18,
                color: "#00ff41",
                marginBottom: 20,
                fontWeight: 400,
              }}
            >
              {role}
              {role && period ? " · " : ""}
              {period}
            </div>
          )}

          {/* Summary */}
          {summary && (
            <div
              style={{
                display: "flex",
                fontSize: 22,
                color: "#888888",
                maxWidth: 860,
                lineHeight: 1.5,
                fontWeight: 400,
              }}
            >
              {summary}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "0 80px 36px 80px",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 18,
              color: "#555555",
              fontWeight: 400,
              letterSpacing: "1px",
            }}
          >
            {siteConfig.url.replace("https://", "")}
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
