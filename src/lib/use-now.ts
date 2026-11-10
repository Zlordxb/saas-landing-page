"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 20_000);
  return () => window.clearInterval(id);
}

// Rounded to the minute, so React sees the same value until the minute changes.
const getSnapshot = () => Math.floor(Date.now() / 60_000) * 60_000;
// On the server (and while hydrating) there is no "now" yet: callers show a neutral text.
const getServerSnapshot = () => null;

/**
 * The current time in milliseconds, updated every minute, or null during the
 * server render. Reading the clock this way (useSyncExternalStore) avoids
 * hydration mismatches between the server's time and the visitor's.
 */
export function useNow(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
