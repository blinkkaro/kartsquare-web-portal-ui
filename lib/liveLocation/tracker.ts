/**
 * Pure buffering and throttling logic for live location broadcasting.
 *
 * Deliberately free of React and browser APIs so it can be unit tested in the
 * project's node test environment. `useLiveLocation` supplies the geolocation
 * watch and the network calls; everything that decides *whether* a sample is
 * worth keeping or sending lives here.
 */

export interface LocationSample {
  latitude: number;
  longitude: number;
  accuracy_m: number | null;
  heading_deg: number | null;
  speed_mps: number | null;
  source: "GPS" | "NETWORK" | "MANUAL";
  recorded_at: string; // ISO 8601
}

export type OfferResult =
  | "accepted"
  | "throttled"
  | "too-inaccurate"
  | "not-moved"
  | "invalid";

export interface TrackerOptions {
  /** Minimum gap between kept samples. */
  minIntervalMs: number;
  /** Displacement that forces a sample through even inside the interval. */
  minDisplacementM: number;
  /** Samples less precise than this are dropped before they cost bandwidth. */
  maxAccuracyM: number;
  /** Buffer cap. Oldest are dropped first — recency matters more than history. */
  maxBufferSize: number;
}

export const DEFAULT_TRACKER_OPTIONS: TrackerOptions = {
  minIntervalMs: 60_000,
  minDisplacementM: 50,
  maxAccuracyM: 500,
  maxBufferSize: 50,
};

const EARTH_RADIUS_M = 6_371_008.8;
const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Great-circle distance in metres. Mirrors the server's implementation. */
export function distanceMeters(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
): number {
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * sinDLng * sinDLng;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(Math.min(1, h)));
}

function isUsable(lat: unknown, lng: unknown): boolean {
  if (typeof lat !== "number" || typeof lng !== "number") return false;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;
  // (0,0) means "no fix" far more often than it means the Gulf of Guinea.
  if (lat === 0 && lng === 0) return false;
  return true;
}

/**
 * Holds samples between network flushes.
 *
 * The browser fires `watchPosition` far more often than we want to transmit —
 * every GPS tick on some devices. This decides what to keep, caps how much is
 * held, and survives a failed send by taking the batch back.
 */
export class LocationTracker {
  private buffer: LocationSample[] = [];
  private lastKept: LocationSample | null = null;
  private options: TrackerOptions;
  /** Samples silently discarded because the buffer was full. */
  private droppedCount = 0;

  constructor(options: Partial<TrackerOptions> = {}) {
    this.options = { ...DEFAULT_TRACKER_OPTIONS, ...options };
  }

  get size(): number {
    return this.buffer.length;
  }

  get dropped(): number {
    return this.droppedCount;
  }

  get last(): LocationSample | null {
    return this.lastKept;
  }

  /**
   * Considers a reading from the geolocation watcher.
   *
   * `timestamp` comes from the GeolocationPosition rather than Date.now(): a
   * cached fix can be minutes old, and stamping it with the current time would
   * hide that from the server's staleness check.
   */
  offer(reading: {
    latitude: number;
    longitude: number;
    accuracy?: number | null;
    heading?: number | null;
    speed?: number | null;
    timestamp: number;
  }): OfferResult {
    if (!isUsable(reading.latitude, reading.longitude)) return "invalid";
    if (!Number.isFinite(reading.timestamp)) return "invalid";

    const accuracy =
      typeof reading.accuracy === "number" && Number.isFinite(reading.accuracy)
        ? reading.accuracy
        : null;

    if (accuracy !== null && accuracy > this.options.maxAccuracyM) {
      return "too-inaccurate";
    }

    if (this.lastKept) {
      const elapsed = reading.timestamp - Date.parse(this.lastKept.recorded_at);

      // Out-of-order or duplicate readings are discarded rather than buffered:
      // the server would reject them anyway, so sending them wastes the batch.
      if (elapsed <= 0) return "throttled";

      const moved = distanceMeters(this.lastKept, reading);

      // Either enough time or enough movement lets a sample through. Movement
      // alone must be able to force one, or a fast-moving provider is reported
      // a minute behind where they actually are.
      if (
        elapsed < this.options.minIntervalMs &&
        moved < this.options.minDisplacementM
      ) {
        return "not-moved";
      }
    }

    const sample: LocationSample = {
      latitude: reading.latitude,
      longitude: reading.longitude,
      accuracy_m: accuracy,
      heading_deg:
        typeof reading.heading === "number" && Number.isFinite(reading.heading)
          ? reading.heading
          : null,
      speed_mps:
        typeof reading.speed === "number" &&
        Number.isFinite(reading.speed) &&
        reading.speed >= 0
          ? reading.speed
          : null,
      source: "GPS",
      recorded_at: new Date(reading.timestamp).toISOString(),
    };

    this.push(sample);
    this.lastKept = sample;
    return "accepted";
  }

  private push(sample: LocationSample): void {
    this.buffer.push(sample);
    // Drop from the front: if we must lose samples, lose the stale ones.
    while (this.buffer.length > this.options.maxBufferSize) {
      this.buffer.shift();
      this.droppedCount++;
    }
  }

  /** Removes and returns everything buffered, ready to transmit. */
  drain(): LocationSample[] {
    const out = this.buffer;
    this.buffer = [];
    return out;
  }

  /**
   * Returns a failed batch to the buffer.
   *
   * Restored samples go in front of anything captured while the request was in
   * flight, so chronological order survives a retry. The cap still applies —
   * a long outage sheds the oldest rather than growing without bound.
   */
  restore(samples: LocationSample[]): void {
    if (samples.length === 0) return;
    this.buffer = [...samples, ...this.buffer];
    while (this.buffer.length > this.options.maxBufferSize) {
      this.buffer.shift();
      this.droppedCount++;
    }
  }

  /** Clears everything, including the throttle reference point. */
  reset(): void {
    this.buffer = [];
    this.lastKept = null;
    this.droppedCount = 0;
  }

  /** True when there is something worth a network round trip. */
  hasPending(): boolean {
    return this.buffer.length > 0;
  }
}

/**
 * Maps a GeolocationPositionError code to a message the provider can act on.
 *
 * Permission denial is terminal — retrying cannot fix it, and the caller must
 * stop the watch rather than spin.
 */
export function describeGeolocationError(code: number): {
  message: string;
  terminal: boolean;
} {
  switch (code) {
    case 1: // PERMISSION_DENIED
      return {
        message:
          "Location permission is blocked. Enable it in your browser settings to go live.",
        terminal: true,
      };
    case 2: // POSITION_UNAVAILABLE
      return {
        message: "Your location is unavailable right now. Retrying.",
        terminal: false,
      };
    case 3: // TIMEOUT
      return {
        message: "Getting your location is taking longer than usual. Retrying.",
        terminal: false,
      };
    default:
      return { message: "Could not read your location.", terminal: false };
  }
}
