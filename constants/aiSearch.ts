/**
 * AI search configuration. There is no default city and no hard-coded city or
 * locality list: the user's own location (GPS or a place they picked) fills the
 * hints, and city/area suggestions come from the backend's live locations.
 */

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
