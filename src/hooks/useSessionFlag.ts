"use client";

import { useState, useCallback } from "react";

export function useSessionFlag(key: string): [boolean, () => void] {
  const [flagged, setFlagged] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem(key) === "1";
    } catch {
      return false;
    }
  });

  const setFlag = useCallback(() => {
    try {
      sessionStorage.setItem(key, "1");
    } catch {
    }
    setFlagged(true);
  }, [key]);

  return [flagged, setFlag];
}
