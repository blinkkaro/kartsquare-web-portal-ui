/**
 * publicProfile.test.ts
 * Tests for lib/seo/publicProfile.ts:
 *   - buildProfileMetadata() returns correct metadata
 *   - External pages (GlobalAboutUs, GlobalContactUs, JoinAsProvider) are noindex
 *   - Organization sameAs is populated
 *   - layout.tsx organization JSON-LD has non-empty sameAs
 */
import { buildProfileMetadata, buildProfileJsonLd } from "@/lib/seo/publicProfile";
import * as fs from "fs";
import * as path from "path";

describe("buildProfileMetadata()", () => {
  const mockProviderPayload = {
    profile: {
      username: "testprovider",
      business_name: "Test Business",
      description: "A great service provider",
      profile_pic: "https://example.com/pic.jpg",
    },
    variant: "provider" as const,
  };

  it("should return index:true for a valid profile", () => {
    const meta = buildProfileMetadata(mockProviderPayload, "testprovider");
    expect(meta.robots).toMatchObject({ index: true, follow: true });
  });

  it("should include correct canonical URL", () => {
    const meta = buildProfileMetadata(mockProviderPayload, "testprovider");
    const alternates = meta.alternates as Record<string, unknown>;
    expect(alternates?.canonical).toContain("/in/testprovider");
  });

  it("should include OG image from profile pic", () => {
    const meta = buildProfileMetadata(mockProviderPayload, "testprovider");
    const og = meta.openGraph as Record<string, unknown>;
    const images = og?.images as Array<{ url: string }>;
    expect(images).toBeDefined();
    expect(images[0]?.url).toContain("pic.jpg");
  });

  it("should use business_name for the profile title", () => {
    const meta = buildProfileMetadata(mockProviderPayload, "testprovider");
    expect(JSON.stringify(meta.title)).toContain("Test Business");
  });
});

describe("buildProfileJsonLd()", () => {
  it("should return a valid JSON-LD object with @type ProfessionalService for provider", () => {
    const payload = {
      profile: { username: "testprovider", business_name: "Test Co" },
      variant: "provider" as const,
    };
    const ld = buildProfileJsonLd(payload, "testprovider");
    expect(ld).not.toBeNull();
    expect(ld?.["@context"]).toBe("https://schema.org");
    expect(ld?.["@type"]).toBe("ProfessionalService");
  });

  it("should return @type Store for supplier variant", () => {
    const payload = {
      profile: { username: "testsupplier", store_name: "Test Store" },
      variant: "supplier" as const,
    };
    const ld = buildProfileJsonLd(payload, "testsupplier");
    expect(ld?.["@type"]).toBe("Store");
  });
});

describe("External pages metadata — noindex", () => {
  function extractMetadataFromSource(filePath: string): { isNoindex: boolean; usesSeoAuth: boolean } {
    const source = fs.readFileSync(filePath, "utf-8");
    return {
      isNoindex: source.includes("seoAuth"),
      usesSeoAuth: source.includes("seoAuth") && !source.includes("seoPublic"),
    };
  }

  it("GlobalAboutUs/page.tsx should use seoAuth (noindex)", () => {
    const filePath = path.join(__dirname, "../../app/External/GlobalAboutUs/page.tsx");
    const result = extractMetadataFromSource(filePath);
    expect(result.isNoindex).toBe(true);
    expect(result.usesSeoAuth).toBe(true);
  });

  it("GlobalContactUs/page.tsx should use seoAuth (noindex)", () => {
    const filePath = path.join(__dirname, "../../app/External/GlobalContactUs/page.tsx");
    const result = extractMetadataFromSource(filePath);
    expect(result.isNoindex).toBe(true);
    expect(result.usesSeoAuth).toBe(true);
  });

  it("JoinAsProvider/page.tsx should use seoAuth (noindex)", () => {
    const filePath = path.join(__dirname, "../../app/External/JoinAsProvider/page.tsx");
    const result = extractMetadataFromSource(filePath);
    expect(result.isNoindex).toBe(true);
    expect(result.usesSeoAuth).toBe(true);
  });
});

describe("layout.tsx Organization JSON-LD — sameAs", () => {
  it("should have a non-empty sameAs array in Organization JSON-LD", () => {
    const layoutPath = path.join(__dirname, "../../app/layout.tsx");
    const source = fs.readFileSync(layoutPath, "utf-8");

    // Extract the sameAs array content
    const sameAsMatch = source.match(/sameAs:\s*\[([\s\S]*?)\]/);
    expect(sameAsMatch).not.toBeNull();

    const sameAsContent = sameAsMatch![1];
    // Should contain at least one URL
    expect(sameAsContent).toMatch(/https?:\/\//);
  });

  it("should reference twitter.com or x.com in sameAs", () => {
    const layoutPath = path.join(__dirname, "../../app/layout.tsx");
    const source = fs.readFileSync(layoutPath, "utf-8");
    expect(source).toMatch(/twitter\.com|x\.com/);
  });

  it("should reference linkedin.com in sameAs", () => {
    const layoutPath = path.join(__dirname, "../../app/layout.tsx");
    const source = fs.readFileSync(layoutPath, "utf-8");
    expect(source).toContain("linkedin.com");
  });
});

describe("in/[username]/page.tsx — profile 404 handling", () => {
  it("should import notFound from next/navigation", () => {
    const profilePath = path.join(__dirname, "../../app/in/[username]/page.tsx");
    const source = fs.readFileSync(profilePath, "utf-8");
    expect(source).toContain("notFound");
    expect(source).toContain("next/navigation");
  });

  it("should call notFound() in the page component when seoPayload is null", () => {
    const profilePath = path.join(__dirname, "../../app/in/[username]/page.tsx");
    const source = fs.readFileSync(profilePath, "utf-8");
    // Check that notFound() is called in the page component (not just imported)
    expect(source).toMatch(/if\s*\(!seoPayload\)\s*\{?\s*notFound\(\)/);
  });
});
