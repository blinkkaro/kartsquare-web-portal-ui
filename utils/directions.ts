/**
 * Google Maps directions links.
 *
 * With the user's real location we pass it as the origin, so Maps opens with
 * the route ready. Without it (location off or not shared) we leave the origin
 * out and Google Maps starts from the device's own location, asking for it if
 * needed. On phones the link opens the Google Maps app when it is installed.
 */

export interface DirectionsPoint {
  latitude: number;
  longitude: number;
}

export interface DirectionsDestination {
  latitude?: number | string | null;
  longitude?: number | string | null;
  /** Used when there are no coordinates: Google geocodes the text. */
  address?: string | null;
}

function realPoint(lat: unknown, lng: unknown): DirectionsPoint | null {
  const latitude = Number(lat);
  const longitude = Number(lng);
  // 0,0 was the address column default: it means "not set".
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  if (latitude === 0 && longitude === 0) return null;
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;
  return { latitude, longitude };
}

/** A directions URL to `destination`, or null when there is nowhere to go. */
export function buildDirectionsUrl(
  destination: DirectionsDestination,
  origin?: DirectionsPoint | null,
): string | null {
  const point = realPoint(destination.latitude, destination.longitude);
  const address = destination.address?.trim();
  if (!point && !address) return null;

  const params = new URLSearchParams({ api: "1" });
  params.set("destination", point ? `${point.latitude},${point.longitude}` : address!);
  const from = origin ? realPoint(origin.latitude, origin.longitude) : null;
  if (from) params.set("origin", `${from.latitude},${from.longitude}`);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
