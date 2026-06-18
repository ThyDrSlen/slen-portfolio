"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const MARKER_DURATION_MS = 250;
const HIT_SOUND_SRC = "/audio/hitmarker.wav";
const HIT_SOUND_VOLUME = 0.4;

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
      audioRef.current?.pause();
      audioRef.current = null;
      return;
    }

    const audio = new Audio(HIT_SOUND_SRC);
    audio.volume = HIT_SOUND_VOLUME;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const activeTimeouts = timeoutRef.current;

    return () => {
      activeTimeouts.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      activeTimeouts.clear();
    };
  }, []);

  const spawn = useCallback((x: number, y: number) => {
    const id = nextId.current++;
    setMarkers((prev) => [...prev, { id, x, y }]);

    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      void audio.play().catch(() => undefined);
    }

    const timeoutId = setTimeout(() => {
      setMarkers((prev) => prev.filter((m) => m.id !== id));
      timeoutRef.current.delete(id);
    }, MARKER_DURATION_MS);

    timeoutRef.current.set(id, timeoutId);
  }, []);

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
