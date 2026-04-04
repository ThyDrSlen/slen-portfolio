"use client";

import { useSyncExternalStore, useCallback } from "react";

const listeners = new Map<string, Set<() => void>>();

function getListenersForKey(key: string) {
  let keyListeners = listeners.get(key);
  if (!keyListeners) {
    keyListeners = new Set<() => void>();
    listeners.set(key, keyListeners);
  }
  return keyListeners;
}

function notify(key: string) {
  listeners.get(key)?.forEach((cb) => {
    cb();
  });
}

export function useSessionFlag(key: string): [boolean, () => void] {
  const flagged = useSyncExternalStore(
    (callback) => {
      const keyListeners = getListenersForKey(key);
      keyListeners.add(callback);

      return () => {
        keyListeners.delete(callback);
        if (keyListeners.size === 0) {
          listeners.delete(key);
        }
      };
    },
    () => {
      try {
        return sessionStorage.getItem(key) === "1";
      } catch (error) {
        console.warn(`Failed to read session flag \"${key}\"`, error);
        return false;
      }
    },
    () => false,
  );

  const setFlag = useCallback(() => {
    try {
      sessionStorage.setItem(key, "1");
    } catch (error) {
      console.warn(`Failed to set session flag \"${key}\"`, error);
    }
    notify(key);
  }, [key]);

  return [flagged, setFlag];
}
