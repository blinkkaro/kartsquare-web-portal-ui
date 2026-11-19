import INDIA from "@/data/indiaLocations.json";

/**
 * India's states and cities for the address forms, bundled from data/indiaLocations.json
 * (built by `npm run locations:india`). Same names and order as country-state-city's
 * `State.getStatesOfCountry("IN")` / `City.getCitiesOfState("IN", code)`, without shipping
 * that package's worldwide data to the browser.
 */
export interface IndianState {
  name: string;
  isoCode: string;
}

export interface IndianCity {
  name: string;
}

const CITIES: Record<string, string[]> = INDIA.cities;

/** All Indian states and union territories. */
export function getIndianStates(): IndianState[] {
  return INDIA.states;
}

/** Cities of one state, by its ISO code (e.g. "RJ"). Empty for an unknown code. */
export function getCitiesOfIndianState(isoCode: string): IndianCity[] {
  const list = Object.prototype.hasOwnProperty.call(CITIES, isoCode) ? CITIES[isoCode] : [];
  return list.map((name) => ({ name }));
}
