import { canCreatePosts } from "@/utils/auth";

describe("canCreatePosts", () => {
  it.each(["SERVICE_PROVIDER", "SUPPLIER"])("lets a %s create posts and reels", (role) => {
    expect(canCreatePosts(role)).toBe(true);
  });

  it("is not case sensitive about the role the backend sends", () => {
    expect(canCreatePosts("service_provider")).toBe(true);
    expect(canCreatePosts("Supplier")).toBe(true);
  });

  it.each(["CUSTOMER", "INFLUENCER", "ADMIN", "MANAGER", "SUPPORT"])("keeps creating away from a %s", (role) => {
    expect(canCreatePosts(role)).toBe(false);
  });

  it("is false when the role is unknown, so a logged-out or half-loaded user never sees the controls", () => {
    expect(canCreatePosts(undefined)).toBe(false);
    expect(canCreatePosts(null)).toBe(false);
    expect(canCreatePosts("")).toBe(false);
  });
});
