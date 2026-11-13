/**
 * Integration test pattern for the API layer: the real service function, with the HTTP boundary
 * (`services/api`) mocked. Asserts the endpoint called, the auth flag, and how the response and
 * the errors come out. Runs in the default `node` environment.
 */
import { serviceListService } from "@/services/serviceList/serviceListService";
import { SERVICE_API_ENDPOINTS } from "@/services/serviceList/apiEndPoints";
import { GET } from "@/services/api";

jest.mock("@/services/api", () => ({ GET: jest.fn(), POST: jest.fn(), PUT: jest.fn(), DELETE: jest.fn() }));

const mockGET = GET as jest.Mock;

describe("serviceListService.getCategories", () => {
  beforeEach(() => jest.clearAllMocks());

  it("calls the public /categories endpoint without auth", async () => {
    mockGET.mockResolvedValue({ status: "success", data: [] });

    await serviceListService.getCategories();

    expect(mockGET).toHaveBeenCalledWith(SERVICE_API_ENDPOINTS.GET_CATEGORIES, {}, false);
    expect(SERVICE_API_ENDPOINTS.GET_CATEGORIES).toBe("/categories");
  });

  it("returns the categories with the icon, colour and image the home grid needs", async () => {
    const category = {
      id: "c1",
      name: "Automotive",
      slug: "automotive",
      icon: "ph:car-duotone",
      color: "#ea580c",
      image: "https://res.cloudinary.com/x/image/upload/automotive.webp",
      is_deleted: false,
    };
    mockGET.mockResolvedValue({ status: "success", data: [category] });

    await expect(serviceListService.getCategories()).resolves.toEqual([category]);
  });

  it("rethrows a failed request so TanStack Query can show its error state", async () => {
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    mockGET.mockRejectedValue(new Error("Network Error"));

    await expect(serviceListService.getCategories()).rejects.toThrow("Network Error");
  });
});
