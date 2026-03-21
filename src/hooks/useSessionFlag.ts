"use client";

import { useState, useCallback, useEffect } from "react";

export function useSessionFlag(key: string): [boolean, () => void] {
  const [flagged, setFlagged] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(key) === "1") {
        setFlagged(true);
      }
    } catch {
    }
  }, [key]);

  const setFlag = useCallback(() => {
    try {
      sessionStorage.setItem(key, "1");
    } catch {
    }
    setFlagged(true);
  }, [key]);

  return [flagged, setFlag];
}
