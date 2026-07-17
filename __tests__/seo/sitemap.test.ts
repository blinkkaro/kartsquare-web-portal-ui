/**
 * sitemap.test.ts
 * Tests for app/sitemap.xml/route.ts SEO fixes:
 *   - /services is NOT in the sitemap
 *   - /cus/reels is NOT in the sitemap
 *   - /External/* pages are NOT in the sitemap
 *   - Key canonical URLs ARE present
 *   - Kebab-case URLs used for legal pages
 */

// We read the route.ts file source and extract the static routes array
// to test its contents without needing to run the full Next.js server.
import * as fs from "fs";
import * as path from "path";

const routeFilePath = path.join(
  __dirname,
  "../../app/sitemap.xml/route.ts"
);
const routeSource = fs.readFileSync(routeFilePath, "utf-8");

function extractStaticUrls(source: string): string[] {
  // Find the staticRoutes array and extract all url: "..." values
  const staticRoutesMatch = source.match(/const staticRoutes\s*=\s*\[([\s\S]*?)\];/);
  if (!staticRoutesMatch) return [];
  const arrayContent = staticRoutesMatch[1];
  const urlMatches = arrayContent.matchAll(/url:\s*["']([^"']+)["']/g);
  return Array.from(urlMatches, (m) => m[1]);
}

describe("sitemap.xml static routes", () => {
  let staticUrls: string[];

  beforeAll(() => {
    staticUrls = extractStaticUrls(routeSource);
  });

  // ── Critical: routes that must NOT appear ────────────────────────────────

  it("should NOT include /services (no page.tsx exists — would 404)", () => {
    expect(staticUrls).not.toContain("/services");
  });

  it("should NOT include /cus/reels (disallowed in robots.txt)", () => {
    expect(staticUrls).not.toContain("/cus/reels");
    // Also check no /cus/ routes at all
    const cusUrls = staticUrls.filter((u) => u.startsWith("/cus/"));
    expect(cusUrls).toHaveLength(0);
  });

  it("should NOT include /External/JoinAsProvider (thin content / noindex)", () => {
    expect(staticUrls).not.toContain("/External/JoinAsProvider");
  });

  it("should NOT include /External/GlobalAboutUs (thin content / noindex)", () => {
    expect(staticUrls).not.toContain("/External/GlobalAboutUs");
  });

  it("should NOT include /External/GlobalContactUs (thin content / noindex)", () => {
    expect(staticUrls).not.toContain("/External/GlobalContactUs");
  });

  it("should NOT include any /External/* pages at all", () => {
    const externalUrls = staticUrls.filter((u) => u.startsWith("/External/"));
    expect(externalUrls).toHaveLength(0);
  });

  // ── Important: key pages that MUST appear ────────────────────────────────

  it("should include / (homepage)", () => {
    expect(staticUrls).toContain("/");
  });

  it("should include /store", () => {
    expect(staticUrls).toContain("/store");
  });

  it("should include /store/products", () => {
    expect(staticUrls).toContain("/store/products");
  });

  it("should include /search", () => {
    expect(staticUrls).toContain("/search");
  });

  it("should include /blogs", () => {
    expect(staticUrls).toContain("/blogs");
  });

  it("should include /careers", () => {
    expect(staticUrls).toContain("/careers");
  });

  it("should include /business-listing", () => {
    expect(staticUrls).toContain("/business-listing");
  });

  // ── Kebab-case canonical URLs for legal pages ─────────────────────────────

  it("should use kebab-case /contact-us (not camelCase /contactUs)", () => {
    expect(staticUrls).toContain("/contact-us");
    expect(staticUrls).not.toContain("/contactUs");
  });

  it("should use kebab-case /privacy-policy (not camelCase /privacyPolicy)", () => {
    expect(staticUrls).toContain("/privacy-policy");
    expect(staticUrls).not.toContain("/privacyPolicy");
  });

  it("should use kebab-case /terms-conditions (not camelCase /termsConditions)", () => {
    expect(staticUrls).toContain("/terms-conditions");
    expect(staticUrls).not.toContain("/termsConditions");
  });

  it("should include /cookie-policy", () => {
    expect(staticUrls).toContain("/cookie-policy");
  });
});
