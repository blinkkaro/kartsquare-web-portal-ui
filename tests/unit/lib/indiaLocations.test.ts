import { City, State } from "country-state-city";
import { getCitiesOfIndianState, getIndianStates } from "@/lib/indiaLocations";

/**
 * The bundled India data must be exactly what country-state-city returns, so the address forms
 * list the same states and cities, in the same order, as before. If this fails after upgrading
 * country-state-city, run `npm run locations:india`.
 */
describe("indiaLocations", () => {
  const libStates = State.getStatesOfCountry("IN");

  it("lists every Indian state, by name and code, in the package's order", () => {
    expect(getIndianStates()).toEqual(libStates.map((s) => ({ name: s.name, isoCode: s.isoCode })));
  });

  it("lists the same cities, in the same order, for every state", () => {
    for (const s of libStates) {
      const expected = City.getCitiesOfState("IN", s.isoCode).map((c) => c.name);
      expect(getCitiesOfIndianState(s.isoCode).map((c) => c.name)).toEqual(expected);
    }
  });

  it("finds Jaipur under Rajasthan", () => {
    const rajasthan = getIndianStates().find((s) => s.name === "Rajasthan");
    expect(rajasthan?.isoCode).toBe("RJ");
    expect(getCitiesOfIndianState("RJ").map((c) => c.name)).toContain("Jaipur");
  });

  it("returns no cities for an unknown code, including Object built-ins", () => {
    expect(getCitiesOfIndianState("ZZ")).toEqual([]);
    expect(getCitiesOfIndianState("constructor")).toEqual([]);
    expect(getCitiesOfIndianState("__proto__")).toEqual([]);
  });
});
