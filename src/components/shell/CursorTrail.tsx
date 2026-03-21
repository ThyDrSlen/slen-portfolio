"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
}

const CURSOR_CLASS = "cursor-trail-active";
const MAX_POINTS = 20;
const LIFETIME = 500;

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(pointer: fine)");
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!isDesktop || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const trail: TrailPoint[] = [];
    let mouseX = 0;
    let mouseY = 0;
    let mouseActive = false;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    document.documentElement.classList.add(CURSOR_CLASS);

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseActive = true;

      trail.push({ x: mouseX, y: mouseY, timestamp: Date.now() });
      if (trail.length > MAX_POINTS) {
        trail.shift();
      }
    };

    const render = () => {
      const now = Date.now();

      while (trail.length > 0 && now - trail[0].timestamp > LIFETIME) {
        trail.shift();
      }

      ctx.fillStyle = "rgba(10, 10, 10, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < trail.length; i++) {
        const point = trail[i];
        const age = now - point.timestamp;
        const life = 1 - age / LIFETIME;
        const opacity = life * 0.6;
        const isRecent = i > trail.length - 5;

        ctx.beginPath();
        ctx.arc(point.x, point.y, 3 * life, 0, Math.PI * 2);

        if (isRecent) {
          ctx.shadowBlur = 12 * life;
          ctx.shadowColor = `rgba(0, 255, 65, ${opacity})`;
        } else {
          ctx.shadowBlur = 0;
          ctx.shadowColor = "transparent";
        }

        ctx.fillStyle = `rgba(0, 255, 65, ${opacity})`;
        ctx.fill();
      }

      if (mouseActive) {
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 4, 0, Math.PI * 2);
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#00ff41";
        ctx.fillStyle = "#00ff41";
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
      }

      animationId = requestAnimationFrame(render);
    };

    document.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", resize);
    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
      document.documentElement.classList.remove(CURSOR_CLASS);
    };
  }, [isDesktop, prefersReducedMotion]);

  if (prefersReducedMotion || !isDesktop) return null;

  return (
    <>
      <style>{`
        .${CURSOR_CLASS},
        .${CURSOR_CLASS} * {
          cursor: none !important;
        }
        .${CURSOR_CLASS} input,
        .${CURSOR_CLASS} textarea,
        .${CURSOR_CLASS} button,
        .${CURSOR_CLASS} a,
        .${CURSOR_CLASS} select {
          cursor: auto !important;
        }
      `}</style>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          pointerEvents: "none",
        }}
      />
    </>
  );
}
