#!/usr/bin/env node
/**
 * Builds data/indiaLocations.json: India's states and the cities of each, taken from the
 * country-state-city package. The address forms only ever offer Indian states and cities,
 * and importing country-state-city in the browser ships every city in the world
 * (an 8 MB file, ~2.3 MB gzipped) on every page that has an address form.
 *
 * Re-run after upgrading country-state-city:
 *
 *   npm run locations:india
 *
 * Order is kept exactly as the package returns it, so dropdowns list the same way.
 */
const fs = require("fs");
const path = require("path");
const { State, City } = require("country-state-city");

const OUT = path.join(__dirname, "..", "data", "indiaLocations.json");

const states = State.getStatesOfCountry("IN").map((s) => ({ name: s.name, isoCode: s.isoCode }));
const cities = {};
for (const s of states) {
  cities[s.isoCode] = City.getCitiesOfState("IN", s.isoCode).map((c) => c.name);
}

fs.writeFileSync(OUT, `${JSON.stringify({ states, cities })}\n`);
const total = Object.values(cities).reduce((n, list) => n + list.length, 0);
const kb = (fs.statSync(OUT).size / 1024).toFixed(1);
console.log(
  `Wrote ${states.length} states and ${total} cities to data/indiaLocations.json (${kb} KB)`,
);
