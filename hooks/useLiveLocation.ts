"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEFAULT_TRACKER_OPTIONS,
  LocationTracker,
  describeGeolocationError,
  type LocationSample,
  type TrackerOptions,
} from "@/lib/liveLocation/tracker";
import { liveLocationService } from "@/services/liveLocation/liveLocationService";
import type { LiveLocationStatus } from "@/services/liveLocation/liveLocationInterface";

/**
 * Continuous location broadcasting for a provider or supplier.
 *
 * Separate from `useGeolocation`, which is a one-shot `getCurrentPosition` used
 * across several screens and must keep that behaviour.
 *
 * The browser is a weak host for continuous tracking: background tabs are
 * throttled and a closed laptop stops reporting entirely. The hook reports its
 * own state honestly (`isThrottled`) rather than implying otherwise.
 */

export interface UseLiveLocationOptions extends Partial<TrackerOptions> {
  /** How often to flush the buffer to the server. */
  flushIntervalMs?: number;
  /** Called when broadcasting stops for a reason the user should see. */
  onError?: (message: string) => void;
  /** Called after every successful flush. */
  onFlush?: (result: { accepted: number; rejected: number }) => void;
}

export interface UseLiveLocationResult {
  isBroadcasting: boolean;
  isStarting: boolean;
  error: string | null;
  /** Last position sent, for the dashboard map preview. */
  lastSample: LocationSample | null;
  /** Samples waiting to be sent. Non-zero means the network is behind. */
  pendingCount: number;
  /** True while the tab is hidden and the browser may be throttling updates. */
  isThrottled: boolean;
  status: LiveLocationStatus | null;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  refreshStatus: () => Promise<void>;
}

const DEFAULT_FLUSH_MS = 60_000;

export function useLiveLocation(
  options: UseLiveLocationOptions = {},
): UseLiveLocationResult {
  const {
    flushIntervalMs = DEFAULT_FLUSH_MS,
    onError,
    onFlush,
    ...trackerOptions
  } = options;

  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSample, setLastSample] = useState<LocationSample | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [isThrottled, setIsThrottled] = useState(false);
  const [status, setStatus] = useState<LiveLocationStatus | null>(null);

  const trackerRef = useRef<LocationTracker | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  /** Guards against overlapping flushes when the network is slow. */
  const flushingRef = useRef(false);
  /** Read inside listeners that must not be re-registered on every render. */
  const broadcastingRef = useRef(false);
  /**
   * True once the server has actually stored a live position for this session.
   *
   * `setMode("LIVE")` alone does not make the server consider us broadcasting —
   * it reports `is_broadcasting: false` until a ping lands. Until that happens a
   * status response saying "not broadcasting" is expected, not a signal to stop.
   */
  const serverConfirmedRef = useRef(false);
  const onErrorRef = useRef(onError);
  const onFlushRef = useRef(onFlush);

  useEffect(() => {
    onErrorRef.current = onError;
    onFlushRef.current = onFlush;
  }, [onError, onFlush]);

  if (trackerRef.current === null) {
    trackerRef.current = new LocationTracker({
      ...DEFAULT_TRACKER_OPTIONS,
      ...trackerOptions,
    });
  }

  const fail = useCallback((message: string) => {
    setError(message);
    onErrorRef.current?.(message);
  }, []);

  const flush = useCallback(async () => {
    const tracker = trackerRef.current;
    if (!tracker || !tracker.hasPending() || flushingRef.current) return;

    flushingRef.current = true;
    const batch = tracker.drain();
    setPendingCount(tracker.size);

    try {
      const result = await liveLocationService.ping({ samples: batch });
      if (result.is_broadcasting || result.accepted_count > 0) {
        serverConfirmedRef.current = true;
      }
      onFlushRef.current?.({
        accepted: result.accepted_count,
        rejected: result.rejected_count,
      });
      if (result.expires_at) {
        setStatus((prev) =>
          prev ? { ...prev, expires_at: result.expires_at } : prev,
        );
      }
    } catch (e) {
      // Put the batch back so a transient failure does not lose positions.
      // The tracker's cap still applies, so a long outage sheds oldest first.
      tracker.restore(batch);
      setPendingCount(tracker.size);
      const message =
        e instanceof Error ? e.message : "Could not send your location.";
      fail(message);
    } finally {
      flushingRef.current = false;
    }
  }, [fail]);

  const teardown = useCallback(() => {
    if (watchIdRef.current !== null && typeof navigator !== "undefined") {
      navigator.geolocation?.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stop = useCallback(async () => {
    teardown();
    broadcastingRef.current = false;
    serverConfirmedRef.current = false;
    setIsBroadcasting(false);

    // Send whatever is buffered before going offline, so the last known
    // position is not silently discarded.
    await flush().catch(() => undefined);

    try {
      await liveLocationService.goOffline();
      setStatus((prev) => (prev ? { ...prev, is_broadcasting: false } : prev));
    } catch {
      // Going offline is also enforced server-side by the TTL, so a failure
      // here delays it rather than leaving the provider live indefinitely.
    }
    trackerRef.current?.reset();
    setPendingCount(0);
  }, [flush, teardown]);

  const start = useCallback(async () => {
    if (broadcastingRef.current) return;

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      fail("Location is not available in this browser.");
      return;
    }

    setIsStarting(true);
    setError(null);

    try {
      const next = await liveLocationService.setMode({ mode: "LIVE" });
      setStatus(next);
    } catch (e) {
      setIsStarting(false);
      fail(e instanceof Error ? e.message : "Could not turn on live location.");
      return;
    }

    const tracker = trackerRef.current!;
    tracker.reset();
    serverConfirmedRef.current = false;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setIsStarting(false);
        setError(null);
        const result = tracker.offer({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          // The position's own timestamp, not Date.now(): a cached fix can be
          // minutes old and the server's staleness check needs to see that.
          timestamp: position.timestamp,
        });
        if (result === "accepted") {
          setLastSample(tracker.last);
          setPendingCount(tracker.size);
          // Send the first fix straight away rather than waiting a whole flush
          // interval: until a position reaches the server it keeps reporting
          // is_broadcasting: false, which makes the toggle look stuck off.
          if (!serverConfirmedRef.current) void flush();
        }
      },
      (err) => {
        setIsStarting(false);
        const { message, terminal } = describeGeolocationError(err.code);
        fail(message);
        // Retrying a denied permission just spins; stop the watch instead.
        if (terminal) void stop();
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 30_000 },
    );

    timerRef.current = setInterval(() => {
      void flush();
    }, flushIntervalMs);

    broadcastingRef.current = true;
    setIsBroadcasting(true);
  }, [fail, flush, flushIntervalMs, stop]);

  const refreshStatus = useCallback(async () => {
    try {
      const next = await liveLocationService.getStatus();
      setStatus(next);
      // Trust the server: a TTL that lapsed while the tab was asleep means the
      // provider is no longer live regardless of local state. Only once it has
      // confirmed a position, though — before the first ping "not broadcasting"
      // just means the fix is still in flight, and tearing down there would
      // switch the toggle back off the moment the user turned it on.
      if (
        !next.is_broadcasting &&
        broadcastingRef.current &&
        serverConfirmedRef.current
      ) {
        teardown();
        broadcastingRef.current = false;
        setIsBroadcasting(false);
      }
    } catch {
      // Status is advisory; a failure here must not stop an active broadcast.
    }
  }, [teardown]);

  // Flush immediately when the tab is hidden — a backgrounded tab may not get
  // another interval tick, and may never wake up again.
  useEffect(() => {
    if (typeof document === "undefined") return;

    const onVisibility = () => {
      const hidden = document.visibilityState === "hidden";
      setIsThrottled(hidden && broadcastingRef.current);
      if (hidden && broadcastingRef.current) void flush();
      if (!hidden && broadcastingRef.current) void refreshStatus();
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [flush, refreshStatus]);

  // Stop broadcasting when the page goes away. `pagehide` fires in cases
  // `beforeunload` misses, including mobile tab eviction and bfcache entry.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onPageHide = () => {
      if (!broadcastingRef.current) return;
      liveLocationService.goOfflineOnUnload();
    };

    window.addEventListener("pagehide", onPageHide);
    return () => window.removeEventListener("pagehide", onPageHide);
  }, []);

  // Release the geolocation watch on unmount. Without this the watch outlives
  // the component and keeps draining battery.
  useEffect(() => {
    return () => {
      teardown();
      if (broadcastingRef.current) {
        liveLocationService.goOfflineOnUnload();
        broadcastingRef.current = false;
      }
    };
  }, [teardown]);

  return {
    isBroadcasting,
    isStarting,
    error,
    lastSample,
    pendingCount,
    isThrottled,
    status,
    start,
    stop,
    refreshStatus,
  };
}
