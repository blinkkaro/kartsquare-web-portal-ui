/**
 * AI search configuration. Jaipur is the launch market, not a hard-coded
 * assumption: the default comes from env and every list below is keyed by city,
 * so adding Delhi / Mumbai / ... is a data change here (plus the backend's
 * locality gazetteer), not a code change.
 */
export const AI_DEFAULT_CITY = process.env.NEXT_PUBLIC_DEFAULT_CITY || "Jaipur";

export const AI_CITIES = [
  "Jaipur",
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Ahmedabad",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Kolkata",
  "Lucknow",
];

/** Suggested localities per city (typing anything else is also fine). */
export const AI_LOCALITIES: Record<string, string[]> = {
  Jaipur: [
    "Mansarovar",
    "Vaishali Nagar",
    "C-Scheme",
    "Raja Park",
    "Malviya Nagar",
    "Jagatpura",
    "Tonk Road",
    "Bani Park",
    "Sitapura",
    "Jhotwara",
  ],
};

/** Rotating search hints. City/locality are filled in from the user's chosen place. */
export function getExampleQueries(city: string, locality?: string | null): string[] {
  const area = locality || AI_LOCALITIES[city]?.[1];
  return [
    "Mera AC thanda nahi kar raha",
    area ? `${area} me plumber chahiye` : "plumber chahiye",
    `Wedding photographer in ${city}`,
    AI_LOCALITIES[city]?.[0] ? `Car service near ${AI_LOCALITIES[city][0]}` : "Car service near me",
    "ghar ki deep cleaning karwani hai",
  ];
}

export const AI_LOCATION_STORAGE_KEY = "kartsquare_ai_location";
