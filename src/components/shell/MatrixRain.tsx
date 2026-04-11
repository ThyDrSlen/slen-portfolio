"use client";

import { useEffect, useRef } from "react";

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let animationId: number;
    const fontSize = 14;
    let viewportWidth = 0;
    let viewportHeight = 0;
    let columns = 0;
    // Use a ref-like plain object so the draw loop always reads the
    // latest array reference, eliminating the race condition that occurs
    // when the resize handler replaces the array while draw() is mid-loop.
    const dropsRef: { current: number[] } = { current: [] };

    const initializeDrops = () => {
      columns = Math.floor(viewportWidth / fontSize);
      dropsRef.current = new Array(columns).fill(0).map(() => Math.random() * -100);
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;

      canvas.width = viewportWidth * dpr;
      canvas.height = viewportHeight * dpr;
      canvas.style.width = `${viewportWidth}px`;
      canvas.style.height = `${viewportHeight}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initializeDrops();
    };
    resize();
    window.addEventListener("resize", resize);

    const chars =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ{}[]()<>/\\|;:+=*&^%$#@!~`";
    const charArray = chars.split("");

    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.05)";
      ctx.fillRect(0, 0, viewportWidth, viewportHeight);

      ctx.fillStyle = "#00ff41";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < dropsRef.current.length; i++) {
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSize;
        const y = dropsRef.current[i] * fontSize;

        // Vary brightness
        const brightness = Math.random();
        if (brightness > 0.95) {
          ctx.fillStyle = "#ffffff";
        } else if (brightness > 0.8) {
          ctx.fillStyle = "#00ff41";
        } else {
          ctx.fillStyle = "#008f22";
        }

        ctx.fillText(char, x, y);

        if (y > viewportHeight && Math.random() > 0.975) {
          dropsRef.current[i] = 0;
        }
        dropsRef.current[i] += 0.15 + Math.random() * 0.2;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="matrix-rain" aria-hidden="true" />;
}
