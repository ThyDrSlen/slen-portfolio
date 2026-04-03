"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const HIT_SOUND =
  "data:audio/wav;base64,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"

const MARKER_DURATION_MS = 250;

interface Marker {
  id: number;
  x: number;
  y: number;
}

export function HitMarker() {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const nextId = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<Map<number, NodeJS.Timeout>>(new Map());
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      audioRef.current = null;
      return;
    }

    audioRef.current = new Audio(HIT_SOUND);
    audioRef.current.volume = 0.4;

    return () => {
      audioRef.current = null;
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    return () => {
      timeoutRef.current.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      timeoutRef.current.clear();
    };
  }, []);

  const spawn = useCallback(
    (x: number, y: number) => {
      const id = nextId.current++;
      setMarkers((prev) => [...prev, { id, x, y }]);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }

      const timeoutId = setTimeout(() => {
        setMarkers((prev) => prev.filter((m) => m.id !== id));
        timeoutRef.current.delete(id);
      }, MARKER_DURATION_MS);

      timeoutRef.current.set(id, timeoutId);
    },
    [],
  );

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button']")) {
        spawn(e.clientX, e.clientY);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [prefersReducedMotion, spawn]);

  if (prefersReducedMotion) return null;

  return (
    <>
      {markers.map((m) => (
        <div
          key={m.id}
          style={{
            position: "fixed",
            left: m.x,
            top: m.y,
            width: 0,
            height: 0,
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            aria-hidden="true"
            role="presentation"
            style={{
              position: "absolute",
              top: -18,
              left: -18,
              animation: `hitmarker-pop ${MARKER_DURATION_MS}ms cubic-bezier(0, 0, 0.2, 1) forwards`,
            }}
          >
            <line x1="5" y1="5" x2="13" y2="13" stroke="#fff" strokeWidth="1.5" />
            <line x1="31" y1="5" x2="23" y2="13" stroke="#fff" strokeWidth="1.5" />
            <line x1="5" y1="31" x2="13" y2="23" stroke="#fff" strokeWidth="1.5" />
            <line x1="31" y1="31" x2="23" y2="23" stroke="#fff" strokeWidth="1.5" />
          </svg>
        </div>
      ))}
    </>
  );
}
