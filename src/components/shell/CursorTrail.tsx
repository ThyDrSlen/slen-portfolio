"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
}

const MAX_POINTS = 20;
const LIFETIME = 500;
const IDLE_GRACE_MS = 100;

function subscribePointer(callback: () => void) {
  const mql = window.matchMedia("(pointer: fine)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getPointerSnapshot() {
  return window.matchMedia("(pointer: fine)").matches;
}

// Frame skip by hardwareConcurrency: 1 (8+ cores), 2 (3–4), 3 (≤2)
function getFrameSkip(): number {
  const cores = navigator.hardwareConcurrency ?? 4;
  if (cores <= 2) return 3;
  if (cores <= 4) return 2;
  return 1;
}

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isDesktop = useSyncExternalStore(subscribePointer, getPointerSnapshot, () => false);

  useEffect(() => {
    if (!isDesktop || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationId = 0;
    let rendering = false;
    let frameCount = 0;
    const frameSkip = getFrameSkip();

    const trail: TrailPoint[] = [];
    let mouseX = 0;
    let mouseY = 0;
    let mouseActive = false;
    let lastMoveTime = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();

    const render = () => {
      const now = Date.now();

      while (trail.length > 0 && now - trail[0].timestamp > LIFETIME) {
        trail.shift();
      }

      if (trail.length === 0 && now - lastMoveTime > LIFETIME + IDLE_GRACE_MS) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        rendering = false;
        return;
      }

      frameCount++;
      if (frameSkip > 1 && frameCount % frameSkip !== 0) {
        animationId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";

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
      }

      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";

      animationId = requestAnimationFrame(render);
    };

    const startRendering = () => {
      if (rendering) return;
      rendering = true;
      animationId = requestAnimationFrame(render);
    };

    let moveQueued = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      mouseActive = true;

      if (!moveQueued) {
        moveQueued = true;
        requestAnimationFrame(() => {
          moveQueued = false;
          lastMoveTime = Date.now();
          trail.push({ x: mouseX, y: mouseY, timestamp: lastMoveTime });
          if (trail.length > MAX_POINTS) {
            trail.shift();
          }
          startRendering();
        });
      }
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, [isDesktop, prefersReducedMotion]);

  if (prefersReducedMotion || !isDesktop) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10,
        pointerEvents: "none",
        background: "transparent",
      }}
    />
  );
}
