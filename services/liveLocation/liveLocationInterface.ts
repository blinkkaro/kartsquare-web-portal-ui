import type { LocationSample } from "@/lib/liveLocation/tracker";

export type LocationMode = "STATIC" | "LIVE";

export interface LiveLocationStatus {
  mode: LocationMode;
  is_broadcasting: boolean;
  latitude: number | null;
  longitude: number | null;
  accuracy_m: number | null;
  area_label: string | null;
  recorded_at: string | null;
  expires_at: string | null;
  /** Seconds until the position stops being discoverable. */
  expires_in_seconds: number | null;
  live_radius_km: number | null;
}

export interface PingResult {
  accepted_count: number;
  rejected_count: number;
  rejections: Array<{ reason: string; detail: string }>;
  /** False when the samples were valid but the provider had not actually moved. */
  position_moved: boolean;
  expires_at: string | null;
  is_broadcasting: boolean;
}

export interface PingPayload {
  samples: LocationSample[];
  ttl_ms?: number | null;
}

export interface SetModePayload {
  mode: LocationMode;
  live_radius_km?: number | null;
}

export interface ManualPinPayload {
  latitude: number;
  longitude: number;
  ttl_ms?: number | null;
  area_label?: string | null;
}

/** Provider position as shown on a booking the caller is party to. */
export interface BookingProviderLocation {
  latitude: number;
  longitude: number;
  /** True when the point has been blurred because the caller lacks exact access. */
  is_approximate: boolean;
  accuracy_m: number | null;
  heading_deg: number | null;
  recorded_at: string | null;
  source: LocationMode;
  age_seconds: number | null;
}
