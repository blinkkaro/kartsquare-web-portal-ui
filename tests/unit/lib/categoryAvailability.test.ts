const mockGet = jest.fn();
jest.mock("@/services/api", () => ({ GET: (...a: unknown[]) => mockGet(...a) }));

import { getCategoryAvailability } from "@/services/location/locationClient";

const cats = [{ id: "c1", name: "Home Services", slug: "home-services", icon: null, service_count: 3, provider_count: 2 }];

beforeEach(() => mockGet.mockReset());

describe("getCategoryAvailability", () => {
  it("asks the city's categories endpoint for the availability view, anonymously", async () => {
    mockGet.mockResolvedValue({ data: { categories: cats } });
    await expect(getCategoryAvailability("jaipur")).resolves.toEqual(cats);
    expect(mockGet).toHaveBeenCalledWith("/locations/jaipur/categories", { view: "availability" }, false);
  });

  it("scopes to a locality when given", async () => {
    mockGet.mockResolvedValue({ data: { categories: cats } });
    await getCategoryAvailability("jaipur", "jhotwara");
    expect(mockGet).toHaveBeenCalledWith("/locations/jaipur/categories", { view: "availability", locality: "jhotwara" }, false);
  });

  it("falls back to the whole city when the locality is unknown (404)", async () => {
    mockGet.mockRejectedValueOnce({ statusCode: 404 }).mockResolvedValueOnce({ data: { categories: cats } });
    await expect(getCategoryAvailability("jaipur", "nowhere")).resolves.toEqual(cats);
    expect(mockGet).toHaveBeenLastCalledWith("/locations/jaipur/categories", { view: "availability" }, false);
  });

  it("an empty answer is an empty list (nothing available), not an error", async () => {
    mockGet.mockResolvedValue({ data: { categories: [] } });
    await expect(getCategoryAvailability("jaipur")).resolves.toEqual([]);
  });

  it("failures are thrown so the page can show an error state instead of fake categories", async () => {
    mockGet.mockRejectedValue({ statusCode: 500 });
    await expect(getCategoryAvailability("jaipur")).rejects.toEqual({ statusCode: 500 });
    mockGet.mockRejectedValue({ statusCode: 500 });
    await expect(getCategoryAvailability("jaipur", "jhotwara")).rejects.toEqual({ statusCode: 500 });
  });

  it("encodes the city segment", async () => {
    mockGet.mockResolvedValue({ data: { categories: [] } });
    await getCategoryAvailability("a/b");
    expect(mockGet.mock.calls[0][0]).toBe("/locations/a%2Fb/categories");
  });
});
