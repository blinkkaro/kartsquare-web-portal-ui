import { GET, POST, PUT } from "../api";
import { getTokens } from "@/utils/auth";
import { LIVE_LOCATION_API_ENDPOINTS as EP } from "./apiEndPoints";
import type {
  BookingProviderLocation,
  LiveLocationStatus,
  ManualPinPayload,
  PingPayload,
  PingResult,
  SetModePayload,
} from "./liveLocationInterface";

class LiveLocationService {
  /** What the provider is currently broadcasting. */
  async getStatus(): Promise<LiveLocationStatus> {
    const response = await GET<{ data: LiveLocationStatus }>(EP.STATUS, {}, true);
    return response.data.data ?? (response.data as unknown as LiveLocationStatus);
  }

  /**
   * Uploads buffered samples.
   *
   * A partial rejection comes back 200 with per-sample reasons rather than an
   * error, so callers must read `rejected_count` instead of relying on throw.
   */
  async ping(payload: PingPayload): Promise<PingResult> {
    const response = await POST<{ data: PingResult }>(EP.PING, payload, {}, true);
    return response.data.data ?? (response.data as unknown as PingResult);
  }

  /** Pins a position manually for a fixed window. */
  async setManualPin(payload: ManualPinPayload): Promise<PingResult> {
    const response = await POST<{ data: PingResult }>(EP.PIN, payload, {}, true);
    return response.data.data ?? (response.data as unknown as PingResult);
  }

  async setMode(payload: SetModePayload): Promise<LiveLocationStatus> {
    const response = await PUT<{ data: LiveLocationStatus }>(
      EP.MODE,
      payload,
      {},
      true,
    );
    return response.data.data ?? (response.data as unknown as LiveLocationStatus);
  }

  async goOffline(): Promise<void> {
    await POST(EP.OFFLINE, {}, {}, true);
  }

  /**
   * Best-effort "stop sharing" during page unload.
   *
   * An ordinary request is cancelled when the document goes away. `keepalive`
   * lets the browser finish it afterwards — and unlike navigator.sendBeacon it
   * still carries an Authorization header, so the endpoint keeps its normal
   * bearer auth instead of accepting a token in the body.
   *
   * Returns false when it could not be dispatched, so the caller can fall back
   * to a regular request while the page is still alive.
   */
  goOfflineOnUnload(): boolean {
    if (typeof fetch === "undefined") return false;

    const { accessToken } = getTokens();
    if (!accessToken) return false;

    const base = process.env.NEXT_PUBLIC_API_URL;
    if (!base) return false;

    try {
      void fetch(`${base}${EP.OFFLINE}`, {
        method: "POST",
        keepalive: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: "{}",
        // The page is going away; a rejection here has nowhere to surface.
      }).catch(() => undefined);
      return true;
    } catch {
      return false;
    }
  }

  /** Provider position for a booking the current user is party to. */
  async getForBooking(
    bookingId: string,
  ): Promise<BookingProviderLocation | null> {
    const response = await GET<{ data: BookingProviderLocation | null }>(
      EP.FOR_BOOKING(bookingId),
      {},
      true,
    );
    return response.data.data ?? null;
  }
}

export const liveLocationService = new LiveLocationService();
