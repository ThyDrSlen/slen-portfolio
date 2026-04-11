"use client";

import { useSyncExternalStore, useCallback, useRef } from "react";

const listeners = new Map<string, Set<() => void>>();

function getListenersForKey(key: string) {
  let keyListeners = listeners.get(key);
  if (!keyListeners) {
    keyListeners = new Set<() => void>();
    listeners.set(key, keyListeners);
  }
  return keyListeners;
}

function removeListener(key: string, callback: () => void) {
  const keyListeners = listeners.get(key);
  if (!keyListeners) return;
  try {
    keyListeners.delete(callback);
  } finally {
    if (keyListeners.size === 0) {
      listeners.delete(key);
    }
  }
}

function notify(key: string) {
  listeners.get(key)?.forEach((cb) => {
    cb();
  });
}

export function useSessionFlag(key: string): [boolean, () => void] {
  // Track the current key so the stable subscribe closure can always
  // reference the latest value without being recreated on every render.
  const keyRef = useRef(key);
  keyRef.current = key;

  // Keep a ref to the callback registered with the listeners Map so the
  // unsubscribe path always removes exactly the same function that was added,
  // even if key changes between subscribe and unsubscribe calls.
  const registeredRef = useRef<{ key: string; callback: () => void } | null>(
    null,
  );

  const subscribe = useCallback((callback: () => void) => {
    const currentKey = keyRef.current;

    // Remove any previously registered listener for a stale key before
    // subscribing to the new one (guards against key changes between renders).
    if (registeredRef.current && registeredRef.current.key !== currentKey) {
      removeListener(registeredRef.current.key, registeredRef.current.callback);
      registeredRef.current = null;
    }

    getListenersForKey(currentKey).add(callback);
    registeredRef.current = { key: currentKey, callback };

    return () => {
      const registered = registeredRef.current;
      if (registered) {
        removeListener(registered.key, registered.callback);
        registeredRef.current = null;
      }
    };
  }, []); // stable — reads key via ref, never needs to be recreated

  const flagged = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return sessionStorage.getItem(keyRef.current) === "1";
      } catch (error) {
        console.warn(`Failed to read session flag "${keyRef.current}"`, error);
        return false;
      }
    },
    () => false,
  );

  const setFlag = useCallback(() => {
    const currentKey = keyRef.current;
    try {
      sessionStorage.setItem(currentKey, "1");
    } catch (error) {
      console.warn(`Failed to set session flag "${currentKey}"`, error);
    }
    notify(currentKey);
  }, []); // stable — reads key via ref

  return [flagged, setFlag];
}
