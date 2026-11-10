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
  coords: { latitude: number; longitude: number; accuracy?: number } | null;
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
/** True from a GPS fix until its area name is looked up, so the UI shows one final label. */
let resolvingName = false;
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
async function commitGps(latitude: number, longitude: number, accuracy?: number): Promise<AILocation> {
  const coords = { latitude, longitude, ...(accuracy ? { accuracy } : {}) };
  // Coordinates first, so results can load while the name is looked up.
  resolvingName = true;
  commit({ city: null, locality: null, coords, source: "gps" }, true);
  let place: Awaited<ReturnType<typeof resolveCoords>> = null;
  try {
    place = await resolveCoords(latitude, longitude);
  } finally {
    resolvingName = false;
  }
  const next: AILocation = {
    city: place?.city?.name ?? null,
    locality: place?.location?.kind === "locality" ? place.location.name : null,
    coords,
    source: "gps",
  };
  // A newer pick or fix may have landed while this one resolved.
  if (current.source === "gps" && current.coords?.latitude === latitude && current.coords?.longitude === longitude) {
    commit(next, false);
  } else {
    listeners.forEach((l) => l());
  }
  return next;
}

/**
 * One precise position. High accuracy asks the device for GPS / Wi-Fi rather
 * than a coarse network guess, and `maxAgeMs` bounds how old a cached fix may
 * be: distances shown as "X km away" are only as good as this point.
 */
function readGps(
  onSuccess: (latitude: number, longitude: number, accuracy: number) => void,
  onError: () => void,
  maxAgeMs = 60 * 1000,
) {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    onError();
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => onSuccess(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy),
    onError,
    { enableHighAccuracy: true, timeout: 15000, maximumAge: maxAgeMs },
  );
}

/** Reads GPS in the background and makes it the current location. */
function locateInBackground(maxAgeMs?: number) {
  locatingNow = true;
  listeners.forEach((l) => l());
  readGps(
    (lat, lng, accuracy) => {
      locatingNow = false;
      void commitGps(lat, lng, accuracy);
    },
    () => {
      locatingNow = false;
      listeners.forEach((l) => l());
    },
    maxAgeMs,
  );
}

/**
 * Runs once per page load.
 *  - Location allowed: the user's own GPS is used — it wins over a place
 *    picked on an earlier visit, so turning location on always shows
 *    distances from where the user really is.
 *  - Never asked: ask once (the browser shows its own prompt).
 *  - Denied / dismissed: keep a picked place, else the default city, until
 *    the user taps "Use my location".
 * It also listens for the permission changing while the page is open, so
 * turning location on in the browser takes effect without a reload.
 */
async function autoLocate() {
  if (autoStarted || typeof window === "undefined") return;
  autoStarted = true;
  if (!navigator.geolocation) return;

  // Show "finding your location" straight away instead of flashing the default
  // city, then "Near you", then the real area. Cleared on every path that
  // does not end in a GPS read.
  locatingNow = true;
  listeners.forEach((l) => l());
  const giveUp = () => {
    locatingNow = false;
    listeners.forEach((l) => l());
  };

  let state: PermissionState | "unknown" = "unknown";
  try {
    if (navigator.permissions?.query) {
      const status = await navigator.permissions.query({ name: "geolocation" as PermissionName });
      state = status.state;
      status.onchange = () => {
        if (status.state === "granted") locateInBackground(0);
      };
    }
  } catch {
    /* Permissions API missing (older Safari): treat as unknown */
  }
  if (state === "denied") return giveUp();
  if (state === "granted") {
    locateInBackground();
    return;
  }
  // Not granted yet: a place the user chose stays; don't prompt over it.
  if (getSnapshot().source === "picked") return giveUp();

  let prompted = false;
  try {
    prompted = localStorage.getItem(PROMPTED_KEY) === "1";
  } catch {
    /* ignore */
  }
  // Asked before and not granted: wait for the user to tap "Use my location".
  if (prompted) return giveUp();

  try {
    localStorage.setItem(PROMPTED_KEY, "1");
  } catch {
    /* ignore */
  }
  locateInBackground();
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
  const autoLocating = useSyncExternalStore(subscribe, () => locatingNow || resolvingName, () => false);
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
      async (lat, lng, accuracy) => {
        const next = await commitGps(lat, lng, accuracy);
        setLocating(false);
        onDone?.(next);
      },
      () => {
        setLocating(false);
        setLocateError("Couldn't get your location. Allow location access, or type an area instead.");
      },
      0, // the user asked for where they are now: never a cached fix
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
