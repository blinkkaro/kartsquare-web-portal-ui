/**
 * Unit test pattern for a pure function: no mocks, one behaviour per `it`, table-driven where the
 * inputs vary and the assertion does not. Runs in the default `node` environment.
 */
import { toSlug } from "@/services/location/locationClient";

describe("toSlug", () => {
  it.each([
    ["Jaipur", "jaipur"],
    ["Packers & Movers", "packers-movers"],
    ["  Beauty   &  Salon  ", "beauty-salon"],
    ["IT & Digital Services", "it-digital-services"],
  ])("turns %j into %j", (input, expected) => {
    expect(toSlug(input)).toBe(expected);
  });

  it("strips accents instead of dropping the letter", () => {
    expect(toSlug("Café Münster")).toBe("cafe-munster");
  });

  it("never starts or ends with a hyphen", () => {
    expect(toSlug("--Jaipur--")).toBe("jaipur");
  });

  it("returns an empty string when nothing URL-safe is left", () => {
    expect(toSlug("!!!")).toBe("");
  });
});
