import { KART_AI_EXAMPLE_QUERY, searchHref } from "@/lib/homeHero";

describe("searchHref", () => {
  it("opens the services list for the typed search, trimmed and encoded", () => {
    expect(searchHref("  geyser repair ")).toBe("/cus/services-list?search=geyser%20repair");
  });

  it("opens the whole services list for an empty search", () => {
    expect(searchHref("   ")).toBe("/cus/services-list");
  });
});

describe("KART_AI_EXAMPLE_QUERY", () => {
  it("is the customer line the preview shows", () => {
    expect(KART_AI_EXAMPLE_QUERY).toBe("Geyser nahi chal raha hai");
  });
});
