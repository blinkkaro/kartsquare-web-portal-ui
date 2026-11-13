/**
 * Unit test pattern for a util with fallbacks: one `describe` per function, one `it` per branch,
 * named after the outcome ("prefers the slug"), not the implementation.
 */
import { getServiceRouteParam } from "@/utils/serviceRoute";

describe("getServiceRouteParam", () => {
  it("prefers the slug, because /services/{slug} is the canonical URL", () => {
    expect(getServiceRouteParam({ slug: "solvitx-agri-farming", service_id: "uuid-1" })).toBe(
      "solvitx-agri-farming",
    );
  });

  it("ignores a blank slug and falls back to the service id", () => {
    expect(getServiceRouteParam({ slug: "   ", service_id: "uuid-1" })).toBe("uuid-1");
  });

  it("falls back to id when there is no slug and no service_id", () => {
    expect(getServiceRouteParam({ slug: null, service_id: null, id: "uuid-2" })).toBe("uuid-2");
  });

  it("returns an empty string when nothing identifies the service", () => {
    expect(getServiceRouteParam({})).toBe("");
  });
});
