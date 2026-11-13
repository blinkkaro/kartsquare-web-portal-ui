import { COMPLETENESS_ROUTES, greetingPart, publicProfilePath } from "@/lib/providerDashboard";

describe("greetingPart", () => {
  it.each([
    [5, "morning"],
    [11, "morning"],
    [12, "afternoon"],
    [16, "afternoon"],
    [17, "evening"],
    [23, "evening"],
    [0, "evening"],
    [4, "evening"],
  ])("hour %i -> %s", (hour, expected) => {
    expect(greetingPart(hour)).toBe(expected);
  });
});

describe("publicProfilePath", () => {
  it("builds /in/{username}, preserving the stored casing", () => {
    expect(publicProfilePath("SolvitX")).toBe("/in/SolvitX");
  });
  it("encodes unsafe characters", () => {
    expect(publicProfilePath("a b")).toBe("/in/a%20b");
  });
  it("returns null without a username", () => {
    expect(publicProfilePath(null)).toBeNull();
    expect(publicProfilePath("  ")).toBeNull();
  });
});

describe("COMPLETENESS_ROUTES", () => {
  it("maps every checklist step to an internal route", () => {
    for (const route of Object.values(COMPLETENESS_ROUTES)) {
      expect(route.startsWith("/")).toBe(true);
    }
    expect(Object.keys(COMPLETENESS_ROUTES)).toHaveLength(6);
  });
});
