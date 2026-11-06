import { buildDirectionsUrl } from "@/utils/directions";

const params = (url: string | null) => new URL(url as string).searchParams;

describe("buildDirectionsUrl", () => {
  const provider = { latitude: 26.84328, longitude: 75.77727 };

  it("starts from the user's location when it is known", () => {
    const url = buildDirectionsUrl(provider, { latitude: 26.8467, longitude: 75.7647 });
    expect(url?.startsWith("https://www.google.com/maps/dir/?")).toBe(true);
    expect(params(url).get("api")).toBe("1");
    expect(params(url).get("destination")).toBe("26.84328,75.77727");
    expect(params(url).get("origin")).toBe("26.8467,75.7647");
  });

  it("leaves the origin to Google Maps without location permission", () => {
    const url = buildDirectionsUrl(provider, null);
    expect(params(url).get("destination")).toBe("26.84328,75.77727");
    expect(params(url).has("origin")).toBe(false);
  });

  it("falls back to the address text when there are no coordinates", () => {
    const url = buildDirectionsUrl({ latitude: 0, longitude: 0, address: "Thadi market, Mansarovar, Jaipur" });
    expect(params(url).get("destination")).toBe("Thadi market, Mansarovar, Jaipur");
  });

  it("accepts coordinates sent as strings", () => {
    expect(params(buildDirectionsUrl({ latitude: "26.9", longitude: "75.8" })).get("destination")).toBe("26.9,75.8");
  });

  it("returns null when there is nowhere to go", () => {
    expect(buildDirectionsUrl({ latitude: null, longitude: null, address: "  " })).toBeNull();
  });

  it("ignores an unusable origin rather than sending it", () => {
    const url = buildDirectionsUrl(provider, { latitude: 0, longitude: 0 });
    expect(params(url).has("origin")).toBe(false);
  });
});
