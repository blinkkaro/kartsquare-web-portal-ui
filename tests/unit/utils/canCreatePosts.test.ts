import { canCreatePosts } from "@/utils/auth";

describe("canCreatePosts", () => {
  it("lets a service provider create posts, reels and stories", () => {
    expect(canCreatePosts("SERVICE_PROVIDER")).toBe(true);
  });

  it("is not case sensitive about the role the backend sends", () => {
    expect(canCreatePosts("service_provider")).toBe(true);
    expect(canCreatePosts("Service_Provider")).toBe(true);
  });

  it.each(["CUSTOMER", "SUPPLIER", "INFLUENCER", "ADMIN", "MANAGER", "SUPPORT"])("keeps creating away from a %s", (role) => {
    expect(canCreatePosts(role)).toBe(false);
  });

  it("is false when the role is unknown, so a logged-out or half-loaded user never sees the controls", () => {
    expect(canCreatePosts(undefined)).toBe(false);
    expect(canCreatePosts(null)).toBe(false);
    expect(canCreatePosts("")).toBe(false);
  });
});
