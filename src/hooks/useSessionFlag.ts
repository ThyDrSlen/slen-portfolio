"use client";

import { useSyncExternalStore, useCallback } from "react";

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((cb) => {
    cb();
  });
}

export function useSessionFlag(key: string): [boolean, () => void] {
  const flagged = useSyncExternalStore(
    (callback) => {
      listeners.add(callback);
      return () => {
        listeners.delete(callback);
      };
    },
    () => {
      try {
        return sessionStorage.getItem(key) === "1";
      } catch {
        return false;
      }
    },
    () => false,
  );

  const setFlag = useCallback(() => {
    try {
      sessionStorage.setItem(key, "1");
    } catch {
    }
    notify();
  }, [key]);

  return [flagged, setFlag];
}
