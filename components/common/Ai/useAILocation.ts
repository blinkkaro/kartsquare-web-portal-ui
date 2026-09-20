import { useCallback, useState, useSyncExternalStore } from "react";
import { AI_DEFAULT_CITY, AI_LOCATION_STORAGE_KEY } from "@/constants/aiSearch";

export interface AILocation {
  city: string;
  locality: string | null;
  /** Only set after the user explicitly taps "Use current location". Never requested automatically. */
  coords: { latitude: number; longitude: number } | null;
}

const DEFAULT: AILocation = { city: AI_DEFAULT_CITY, locality: null, coords: null };

// One shared location for the whole app (home hero + assistant stay in sync).
let current: AILocation = DEFAULT;
let loaded = false;
const listeners = new Set<() => void>();

function readStored(): AILocation {
  try {
    const raw = localStorage.getItem(AI_LOCATION_STORAGE_KEY);
    if (!raw) return DEFAULT;
    const p = JSON.parse(raw);
    return {
      city: typeof p.city === "string" && p.city ? p.city : DEFAULT.city,
      locality: typeof p.locality === "string" && p.locality ? p.locality : null,
      // Coordinates are deliberately not persisted: stale GPS would be wrong the next day.
      coords: null,
    };
  } catch {
    return DEFAULT;
  }
}

function getSnapshot(): AILocation {
  if (!loaded && typeof window !== "undefined") {
    current = readStored();
    loaded = true;
  }
  return current;
}

const getServerSnapshot = () => DEFAULT;

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function commit(next: AILocation, persist: boolean) {
  current = next;
  loaded = true;
  if (persist) {
    try {
      localStorage.setItem(
        AI_LOCATION_STORAGE_KEY,
        JSON.stringify({ city: next.city, locality: next.locality })
      );
    } catch {
      /* storage unavailable: keep in-memory only */
    }
  }
  listeners.forEach((l) => l());
}

export function useAILocation() {
  const location = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);

  const setLocation = useCallback((next: AILocation) => commit(next, true), []);

  /** Asks the browser for position only when the user taps the button. */
  const locateMe = useCallback((onDone?: (l: AILocation) => void) => {
    setLocateError(null);
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocateError("Location is not available on this device.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next: AILocation = {
          city: current.city,
          locality: null,
          coords: { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
        };
        setLocating(false);
        commit(next, false);
        onDone?.(next);
      },
      () => {
        setLocating(false);
        setLocateError("Couldn't get your location. You can type an area instead.");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  }, []);

  return { location, setLocation, locateMe, locating, locateError };
}
