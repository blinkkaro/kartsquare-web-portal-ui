import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { AI_LOCATION_STORAGE_KEY, DEFAULT_LOCATION } from "@/constants/aiSearch";
import { resolveCoords } from "@/services/location/locationClient";

/**
 * Where the user is — the one place the whole app reads it from.
 *
 * In priority order: a place the user picked, the user's exact GPS point, and
 * otherwise the default city (Jaipur, Rajasthan) — shown while location is
 * off, denied or not answered yet, the way Justdial falls back to Mumbai.
 * GPS replaces the default as soon as it arrives.
 */
export interface AILocation {
  /** Display name of the nearest known city; null when unknown or not seeded. */
  city: string | null;
  locality: string | null;
  /** The point results are searched around: GPS, or the picked place's centre. */
  coords: { latitude: number; longitude: number } | null;
  /** "default" = the fallback city, used only while nothing better is known. */
  source?: "gps" | "picked" | "default" | null;
}

export const DEFAULT_AI_LOCATION: AILocation = {
  city: DEFAULT_LOCATION.city,
  locality: null,
  coords: { latitude: DEFAULT_LOCATION.latitude, longitude: DEFAULT_LOCATION.longitude },
  source: "default",
};

/** Set once the first-visit permission prompt has been shown, so it is never repeated unasked. */
const PROMPTED_KEY = "kartsquare_location_prompted";

// One shared location for the whole app (home, services list, assistant stay in sync).
let current: AILocation = DEFAULT_AI_LOCATION;
let loaded = false;
let autoStarted = false;
let locatingNow = false;
const listeners = new Set<() => void>();

function readStored(): AILocation {
  try {
    const raw = localStorage.getItem(AI_LOCATION_STORAGE_KEY);
    if (!raw) return DEFAULT_AI_LOCATION;
    const p = JSON.parse(raw);
    // Only a place the user picked is remembered. GPS is re-read each visit:
    // a stale fix would put them where they were yesterday.
    const coords =
      p.source === "picked" &&
      p.coords &&
      typeof p.coords.latitude === "number" &&
      typeof p.coords.longitude === "number"
        ? { latitude: p.coords.latitude, longitude: p.coords.longitude }
        : null;
    // Entries from the old city-name-only format carry no point to search
    // around; they are dropped rather than shown as a location we can't use.
    if (!coords) return DEFAULT_AI_LOCATION;
    return {
      city: typeof p.city === "string" && p.city ? p.city : null,
      locality: typeof p.locality === "string" && p.locality ? p.locality : null,
      coords,
      source: coords ? "picked" : null,
    };
  } catch {
    return DEFAULT_AI_LOCATION;
  }
}

function getSnapshot(): AILocation {
  if (!loaded && typeof window !== "undefined") {
    current = readStored();
    loaded = true;
  }
  return current;
}

// The server renders the default too, so the first client render matches it.
const getServerSnapshot = () => DEFAULT_AI_LOCATION;

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
      if (next.source === "picked") {
        localStorage.setItem(
          AI_LOCATION_STORAGE_KEY,
          JSON.stringify({
            city: next.city,
            locality: next.locality,
            coords: next.coords,
            source: "picked",
          }),
        );
      } else {
        localStorage.removeItem(AI_LOCATION_STORAGE_KEY);
      }
    } catch {
      /* storage unavailable: keep in-memory only */
    }
  }
  listeners.forEach((l) => l());
}

/** Turns a GPS fix into a location, naming the nearest known area if there is one. */
async function commitGps(latitude: number, longitude: number): Promise<AILocation> {
  // Coordinates first, so results can load while the name is looked up.
  commit({ city: null, locality: null, coords: { latitude, longitude }, source: "gps" }, true);
  const place = await resolveCoords(latitude, longitude);
  const next: AILocation = {
    city: place?.city?.name ?? null,
    locality: place?.location?.kind === "locality" ? place.location.name : null,
    coords: { latitude, longitude },
    source: "gps",
  };
  // A newer pick or fix may have landed while this one resolved.
  if (current.source === "gps" && current.coords?.latitude === latitude && current.coords?.longitude === longitude) {
    commit(next, false);
  }
  return next;
}

function readGps(
  onSuccess: (latitude: number, longitude: number) => void,
  onError: () => void,
) {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    onError();
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => onSuccess(pos.coords.latitude, pos.coords.longitude),
    onError,
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
  );
}

/**
 * Runs once per page load. A place the user picked wins. Otherwise: read GPS
 * silently if permission was already granted; on the very first visit, ask
 * once (the browser shows its own prompt); after a denial or a dismissed
 * prompt, wait for the user to tap "Use my location".
 */
async function autoLocate() {
  if (autoStarted || typeof window === "undefined") return;
  autoStarted = true;
  if (getSnapshot().source === "picked") return;
  if (!navigator.geolocation) return;

  let state: PermissionState | "unknown" = "unknown";
  try {
    if (navigator.permissions?.query) {
      state = (await navigator.permissions.query({ name: "geolocation" as PermissionName })).state;
    }
  } catch {
    /* Permissions API missing (older Safari): treat as unknown */
  }
  if (state === "denied") return;

  let prompted = false;
  try {
    prompted = localStorage.getItem(PROMPTED_KEY) === "1";
  } catch {
    /* ignore */
  }
  if (state !== "granted" && prompted) return;

  try {
    localStorage.setItem(PROMPTED_KEY, "1");
  } catch {
    /* ignore */
  }
  locatingNow = true;
  listeners.forEach((l) => l());
  readGps(
    (lat, lng) => {
      locatingNow = false;
      void commitGps(lat, lng);
    },
    () => {
      locatingNow = false;
      listeners.forEach((l) => l());
    },
  );
}

/** "Near Mansarovar, Jaipur" style label; `fallback` when nothing is known. */
export function placeLabel(location: AILocation, fallback = "your area"): string {
  if (location.locality && location.city) return `${location.locality}, ${location.city}`;
  if (location.locality) return location.locality;
  if (location.city) return location.city;
  if (location.coords) return "your location";
  return fallback;
}

export function useAILocation() {
  const location = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const autoLocating = useSyncExternalStore(subscribe, () => locatingNow, () => false);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);

  useEffect(() => {
    void autoLocate();
  }, []);

  /** A place the user picked (with its centre point); clearing it goes back to the default city. */
  const setLocation = useCallback(
    (next: AILocation) =>
      commit(next.coords ? { ...next, source: next.source ?? "picked" } : DEFAULT_AI_LOCATION, true),
    [],
  );

  /** Asks the browser for the exact position (the user tapped "Use my location"). */
  const locateMe = useCallback((onDone?: (l: AILocation) => void) => {
    setLocateError(null);
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocateError("Location is not available on this device. You can type an area instead.");
      return;
    }
    setLocating(true);
    readGps(
      async (lat, lng) => {
        const next = await commitGps(lat, lng);
        setLocating(false);
        onDone?.(next);
      },
      () => {
        setLocating(false);
        setLocateError("Couldn't get your location. Allow location access, or type an area instead.");
      },
    );
  }, []);

  return {
    location,
    setLocation,
    locateMe,
    locating: locating || autoLocating,
    locateError,
    /** True once there is a point to search around (always, given the default city). */
    hasLocation: !!location.coords,
    /** True while showing the default city because the user's location is unknown. */
    isDefaultLocation: location.source === "default",
  };
}
