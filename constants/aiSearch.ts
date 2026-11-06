/**
 * AI search and location configuration. The user's own location (GPS or a
 * place they picked) always wins; city/area suggestions come from the
 * backend's live locations.
 */

/**
 * Where the app shows services when the user's location is unknown — location
 * off, denied, or not answered yet (Justdial shows Mumbai the same way). The
 * user can switch to their own location or another place at any time.
 * Override per deployment with NEXT_PUBLIC_DEFAULT_* env vars.
 */
export const DEFAULT_LOCATION = {
  city: process.env.NEXT_PUBLIC_DEFAULT_CITY || "Jaipur",
  state: process.env.NEXT_PUBLIC_DEFAULT_STATE || "Rajasthan",
  latitude: Number(process.env.NEXT_PUBLIC_DEFAULT_LAT) || 26.9124,
  longitude: Number(process.env.NEXT_PUBLIC_DEFAULT_LNG) || 75.7873,
  /** Businesses located within this distance of the centre count as "in the city". */
  cityRadiusKm: Number(process.env.NEXT_PUBLIC_DEFAULT_CITY_RADIUS_KM) || 25,
} as const;

/** Rotating search hints. City/locality are filled in from the user's chosen place. */
export function getExampleQueries(city: string | null, locality?: string | null): string[] {
  const area = locality || city;
  return [
    "Mera AC thanda nahi kar raha",
    area ? `${area} me plumber chahiye` : "plumber chahiye",
    city ? `Wedding photographer in ${city}` : "Wedding photographer near me",
    locality ? `Car service near ${locality}` : "Car service near me",
    "ghar ki deep cleaning karwani hai",
  ];
}

export const AI_LOCATION_STORAGE_KEY = "kartsquare_ai_location";
