/**
 * buildMetadata.test.ts
 * Tests for lib/seo/buildMetadata.ts SEO fixes:
 *   - seoPublic() always returns an OG image (fallback)
 *   - seoPublic() includes hreflang en-IN alternate
 *   - seoAuth() returns noindex
 *   - seoPrivate() returns noindex + nofollow
 *   - Canonical URL is correctly formed
 */
import { seoPublic, seoAuth, seoPrivate, SITE_URL } from "@/lib/seo/buildMetadata";
import type { Metadata } from "next";

describe("seoPublic()", () => {
  describe("OG image fallback", () => {
    it("should use the default og-image.png when no image is passed", () => {
      const meta = seoPublic({
        title: "Test Page",
        description: "Test description",
        path: "/test",
      });
      const og = meta.openGraph as Record<string, unknown>;
      const images = og?.images as Array<{ url: string }>;
      expect(images).toBeDefined();
      expect(images.length).toBeGreaterThan(0);
      expect(images[0].url).toBe(`${SITE_URL}/og-image.png`);
    });

    it("should use the provided image when explicitly passed", () => {
      const customImage = "https://example.com/custom.jpg";
      const meta = seoPublic({
        title: "Test Page",
        description: "Test description",
        path: "/test",
        image: customImage,
      });
      const og = meta.openGraph as Record<string, unknown>;
      const images = og?.images as Array<{ url: string }>;
      expect(images[0].url).toBe(customImage);
    });

    it("Twitter card should always be summary_large_image", () => {
      const meta = seoPublic({
        title: "Test Page",
        description: "Test description",
        path: "/test",
      });
      const twitter = meta.twitter as Record<string, unknown>;
      expect(twitter?.card).toBe("summary_large_image");
    });

    it("Twitter should always include an image", () => {
      const meta = seoPublic({
        title: "Test",
        description: "Desc",
        path: "/test",
      });
      const twitter = meta.twitter as Record<string, unknown>;
      expect(twitter?.images).toBeDefined();
    });
  });

  describe("hreflang alternate", () => {
    it("should include en-IN hreflang language alternate", () => {
      const meta = seoPublic({
        title: "Test",
        description: "Desc",
        path: "/test",
      });
      const alternates = meta.alternates as Record<string, unknown>;
      const langs = alternates?.languages as Record<string, string>;
      expect(langs?.["en-IN"]).toBeDefined();
      expect(langs?.["en-IN"]).toContain("/test");
    });
  });

  describe("canonical URL", () => {
    it("should set canonical to SITE_URL for root path", () => {
      const meta = seoPublic({ title: "Home", description: "Desc", path: "/" });
      const alternates = meta.alternates as Record<string, unknown>;
      expect(alternates?.canonical).toBe(SITE_URL);
    });

    it("should append path to SITE_URL for non-root paths", () => {
      const meta = seoPublic({ title: "Store", description: "Desc", path: "/store" });
      const alternates = meta.alternates as Record<string, unknown>;
      expect(alternates?.canonical).toBe(`${SITE_URL}/store`);
    });

    it("should handle paths without leading slash", () => {
      const meta = seoPublic({ title: "Test", description: "Desc", path: "blogs" });
      const alternates = meta.alternates as Record<string, unknown>;
      expect(alternates?.canonical).toBe(`${SITE_URL}/blogs`);
    });
  });

  describe("robots directive", () => {
    it("should mark page as indexable", () => {
      const meta = seoPublic({ title: "Test", description: "Desc", path: "/test" });
      expect(meta.robots).toMatchObject({ index: true, follow: true });
    });
  });

  describe("OG type", () => {
    it("should default to website type", () => {
      const meta = seoPublic({ title: "Test", description: "Desc", path: "/test" });
      const og = meta.openGraph as Record<string, unknown>;
      expect(og?.type).toBe("website");
    });

    it("should use article type when specified", () => {
      const meta = seoPublic({
        title: "Blog",
        description: "Desc",
        path: "/blogs/test",
        ogType: "article",
      });
      const og = meta.openGraph as Record<string, unknown>;
      expect(og?.type).toBe("article");
    });
  });
});

describe("seoAuth()", () => {
  it("should mark page as noindex", () => {
    const meta = seoAuth({ title: "Login", description: "Login page" });
    expect(meta.robots).toMatchObject({ index: false, follow: true });
  });

  it("should NOT include canonical or OG image", () => {
    const meta = seoAuth({ title: "Login", description: "Login page" });
    expect((meta as Record<string, unknown>).alternates).toBeUndefined();
    expect((meta as Record<string, unknown>).openGraph).toBeUndefined();
  });
});

describe("seoPrivate()", () => {
  it("should mark page as noindex AND nofollow", () => {
    const meta = seoPrivate({ title: "Dashboard", description: "Private" });
    expect(meta.robots).toMatchObject({ index: false, follow: false });
  });
});
