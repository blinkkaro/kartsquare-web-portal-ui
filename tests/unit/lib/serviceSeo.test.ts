import { serializeJsonLd } from "@/lib/seo/jsonLd";
import {
  buildServiceJsonLd,
  lookupService,
  serviceRedirectTarget,
  type ServiceSeo,
} from "@/lib/seo/serviceSeo";
import { isCanonicalServicePath, isSlugShape, serviceSitemapPath } from "@/lib/seo/sitemapPaths";
import { fetchPublicJson, UpstreamError } from "@/lib/seo/upstream";
import { buildProfileJsonLd, fetchPublicProfileForSeo } from "@/lib/seo/publicProfile";

const UUID = "c243316e-8613-48a4-b111-1df3a406f13e";
const ck: ServiceSeo = {
  service_id: UUID,
  slug: "ck-solar",
  canonical_path: "/services/jaipur/ck-solar",
  service_name: "CK Solar",
  service_desc: "Solar installation in Jaipur.",
  business_name: "CK Solar",
  provider_username: "cksolar",
  category_name: ["Energy & Environment"],
  sub_category_name: ["Solar Panel Installation", "Inverter & Battery Shop"],
  service_at_location: "at_customer",
  pricing_type: "noPrice",
  price: 0,
  currency: "INR",
  service_address: { address: "B - Scheme", city_town: "Jaipur", state: "Rajasthan", pincode: "302012", country: "India", latitude: 26.93, longitude: 75.73 },
};

function mockFetch(impl: (url: string) => Promise<Partial<Response>> | Partial<Response>) {
  const fn = jest.fn(async (url: string) => impl(url) as Response);
  global.fetch = fn as unknown as typeof fetch;
  return fn;
}
const json = (status: number, body: unknown = {}) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

afterEach(() => jest.restoreAllMocks());

describe("fetchPublicJson classification", () => {
  it.each([404, 410, 400])("%s => not-found", async (status) => {
    mockFetch(() => json(status));
    await expect(fetchPublicJson("http://x/a")).resolves.toEqual({ status: "not-found" });
  });
  it.each([500, 502, 503, 429, 401, 403])("%s => UpstreamError (never not-found)", async (status) => {
    mockFetch(() => json(status));
    await expect(fetchPublicJson("http://x/a")).rejects.toBeInstanceOf(UpstreamError);
  });
  it("network failure and timeout => UpstreamError", async () => {
    mockFetch(() => { throw new TypeError("fetch failed"); });
    await expect(fetchPublicJson("http://x/a")).rejects.toBeInstanceOf(UpstreamError);
    mockFetch(() => { throw new DOMException("timed out", "TimeoutError"); });
    await expect(fetchPublicJson("http://x/a")).rejects.toBeInstanceOf(UpstreamError);
  });
  it("unparsable body => UpstreamError", async () => {
    mockFetch(() => ({ ok: true, status: 200, json: async () => { throw new SyntaxError("bad"); } }));
    await expect(fetchPublicJson("http://x/a")).rejects.toBeInstanceOf(UpstreamError);
  });
});

describe("lookupService", () => {
  it("found", async () => {
    mockFetch(() => json(200, { data: ck }));
    await expect(lookupService("ck-solar")).resolves.toMatchObject({ kind: "found" });
  });
  it("unknown identifier => not-found", async () => {
    mockFetch(() => json(404));
    await expect(lookupService("nope")).resolves.toEqual({ kind: "not-found" });
  });
  it("backend outage is an UpstreamError, not not-found", async () => {
    mockFetch(() => json(503));
    await expect(lookupService("ck-solar-outage")).rejects.toBeInstanceOf(UpstreamError);
  });
  it("200 with a malformed payload is an UpstreamError", async () => {
    mockFetch(() => json(200, { data: { nope: true } }));
    await expect(lookupService("malformed")).rejects.toBeInstanceOf(UpstreamError);
  });
  it("asks the API for the identifier exactly once per call, URL-encoded", async () => {
    const f = mockFetch(() => json(404));
    await lookupService("a/b?c");
    expect(f.mock.calls[0][0]).toContain("/services/a%2Fb%3Fc");
  });
});

describe("serviceRedirectTarget", () => {
  const CANON = "/services/jaipur/ck-solar";
  it("legacy /services/{uuid} => single hop to /services/{city}/{slug}", () => {
    expect(serviceRedirectTarget(`/services/${UUID}`, ck)).toBe(CANON);
  });
  it("legacy /services/{slug} => single hop to the canonical path", () => {
    expect(serviceRedirectTarget("/services/ck-solar", ck)).toBe(CANON);
  });
  it("historical slug (any city prefix) => directly to the final canonical path", () => {
    expect(serviceRedirectTarget("/services/old-city/old-ck", ck)).toBe(CANON);
  });
  it("valid service under the WRONG city => redirected to its canonical city", () => {
    expect(serviceRedirectTarget("/services/jodhpur/ck-solar", ck)).toBe(CANON);
  });
  it("already canonical => no redirect (loop prevention)", () => {
    expect(serviceRedirectTarget(CANON, ck)).toBeNull();
  });
  it("missing canonical city or slug (canonical_path null) => no redirect", () => {
    expect(serviceRedirectTarget(`/services/${UUID}`, { canonical_path: null })).toBeNull();
    expect(serviceRedirectTarget(`/services/${UUID}`, {})).toBeNull();
  });
  it("never follows an unsafe or legacy-shaped canonical_path from the payload", () => {
    for (const bad of ["//evil.com", "https://evil.com", "/in/x", "/services/ck-solar", "/services/a/b/c", "/services/../x", "/services/Jaipur/ck", "/services/jaipur/" + UUID, "/services/jaipur/in", "javascript:1"]) {
      expect(serviceRedirectTarget(`/services/${UUID}`, { canonical_path: bad })).toBeNull();
    }
  });
  it("preserves enquiry context (?action=) and drops everything else", () => {
    expect(serviceRedirectTarget(`/services/${UUID}`, ck, { action: "review", utm_source: "x", next: "//evil.com" })).toBe(
      `${CANON}?action=review`,
    );
    expect(serviceRedirectTarget(`/services/${UUID}`, ck, { action: ["a", "b"] })).toBe(`${CANON}?action=a`);
  });
  it("encodes preserved values so they cannot alter the path", () => {
    expect(serviceRedirectTarget(`/services/${UUID}`, ck, { action: "a&b=c/../d" })).toBe(
      `${CANON}?action=a%26b%3Dc%2F..%2Fd`,
    );
  });
});

describe("path shape guards", () => {
  it("isSlugShape rejects anything that is not a lowercase slug (checked before the API)", () => {
    for (const ok of ["jaipur", "ck-solar", "11-11-the-cafe"]) expect(isSlugShape(ok)).toBe(true);
    for (const bad of ["", "Jaipur", "a b", "a/b", "..", "a--b", "-a", "a_", "x".repeat(81), null, 3]) expect(isSlugShape(bad)).toBe(false);
  });
  it("isCanonicalServicePath requires city AND slug", () => {
    expect(isCanonicalServicePath("/services/jaipur/ck-solar")).toBe(true);
    expect(isCanonicalServicePath("/services/ck-solar")).toBe(false);
    expect(isCanonicalServicePath("/services/jaipur/book")).toBe(false);
    expect(isCanonicalServicePath(`/services/jaipur/${UUID}`)).toBe(false);
  });
});

describe("buildServiceJsonLd (real fields only)", () => {
  const node = buildServiceJsonLd(ck, "/services/jaipur/ck-solar") as Record<string, any>;

  it("uses the canonical URL for url and @id, and the real username for the provider", () => {
    expect(node.url).toMatch(/\/services\/jaipur\/ck-solar$/);
    expect(node["@id"]).toBe(`${node.url}#service`);
    expect(node.provider.url).toMatch(/\/in\/cksolar$/);
    expect(node.provider["@id"]).toBe(`${node.provider.url}#provider`);
  });

  it("never contains the guessed /in/ck-solar-jaipur URL or any AI-stored value", () => {
    expect(JSON.stringify(node)).not.toContain("ck-solar-jaipur");
  });

  it("has no aggregateRating and no fabricated review/price/availability", () => {
    const s = JSON.stringify({ ...node, ...buildServiceJsonLd({ ...ck, price: 0 }, "/services/jaipur/ck-solar") });
    expect(s).not.toMatch(/aggregateRating|ratingValue|reviewCount|availability|"price"/);
  });

  it("omits the provider address and geo for an at_customer service", () => {
    expect(node.provider.address).toBeUndefined();
    expect(node.provider.geo).toBeUndefined();
    expect(node.areaServed).toEqual({ "@type": "Place", name: "Jaipur" });
  });

  it("includes address/geo only from real fields when the service is at the provider", () => {
    const n = buildServiceJsonLd({ ...ck, service_at_location: "at_provider" }, "/services/jaipur/ck-solar") as Record<string, any>;
    expect(n.provider.address).toMatchObject({ addressLocality: "Jaipur", postalCode: "302012" });
    expect(n.provider.geo.latitude).toBe(26.93);
  });

  it("emits offers only for real positive prices", () => {
    const n = buildServiceJsonLd(
      { ...ck, pricing_type: "multiple", price_items: [{ service_name: "Install", price: 1200 }, { service_name: "Free quote", price: 0 }] },
      "/services/ck-solar",
    ) as Record<string, any>;
    expect(n.offers).toEqual({ "@type": "Offer", name: "Install", price: 1200, priceCurrency: "INR" });
  });

  it("omits properties that have no data instead of inventing them", () => {
    const n = buildServiceJsonLd({ service_id: UUID }, "/services/jaipur/x") as Record<string, unknown>;
    expect(Object.keys(n).sort()).toEqual(["@context", "@id", "@type", "url"]);
  });
});

describe("serializeJsonLd", () => {
  it("cannot close the script element or inject markup", () => {
    const out = serializeJsonLd({ name: "</script><script>alert(1)</script> & <b>" });
    expect(out).not.toContain("</script>");
    expect(out).not.toContain("<");
    expect(out).not.toContain(">");
    expect(JSON.parse(out).name).toBe("</script><script>alert(1)</script> & <b>");
  });
  it("escapes U+2028/U+2029 and still round-trips", () => {
    const v = { a: "x\u2028y\u2029z" };
    const out = serializeJsonLd(v);
    expect(out).not.toMatch(/[\u2028\u2029]/);
    expect(JSON.parse(out)).toEqual(v);
  });
});

describe("canonical, sitemap and JSON-LD agree", () => {
  it("one path everywhere for the same service", () => {
    const path = ck.canonical_path as string;
    const sitemap = serviceSitemapPath({ canonical_path: path });
    const jsonLd = buildServiceJsonLd(ck, path) as Record<string, string>;
    expect(sitemap).toBe(path);
    expect(jsonLd.url.endsWith(path)).toBe(true);
    expect(serviceRedirectTarget(path, ck)).toBeNull(); // canonical request stays
  });
  it("sitemap skips entries without a canonical city/slug and never lists a legacy or UUID path", () => {
    expect(serviceSitemapPath({ canonical_path: null })).toBeNull();
    expect(serviceSitemapPath({})).toBeNull();
    expect(serviceSitemapPath({ canonical_path: "/services/ck-solar" })).toBeNull(); // legacy shape
    expect(serviceSitemapPath({ canonical_path: `/services/jaipur/${UUID}` })).toBeNull();
    expect(serviceSitemapPath({ canonical_path: "/services/Bad/Slug" })).toBeNull();
  });
});

describe("provider profile", () => {
  const payload = { variant: "provider" as const, profile: { username: "cksolar", business_name: "CK Solar", structured_data: { "@type": "Service", url: "https://www.kartsquare.com/in/ck-solar-jaipur" } } };

  it("JSON-LD ignores AI-stored structured_data and uses /in/{username}", () => {
    const ld = buildProfileJsonLd(payload, "cksolar") as Record<string, string>;
    expect(JSON.stringify(ld)).not.toContain("ck-solar-jaipur");
    expect(ld.url).toMatch(/\/in\/cksolar$/);
    expect(ld["@id"]).toBe(`${ld.url}#profile`);
  });
  it("description fallback does not claim 'verified'", () => {
    const ld = buildProfileJsonLd({ variant: "provider", profile: { username: "x" } }, "x") as Record<string, string>;
    expect(ld.description).not.toMatch(/verified/i);
  });
  it("unknown profile (404 on both lookups) => null; outage => throws", async () => {
    mockFetch(() => json(404));
    await expect(fetchPublicProfileForSeo("nobody")).resolves.toBeNull();
    mockFetch((u) => (u.includes("/provider/") ? json(404) : json(503)));
    await expect(fetchPublicProfileForSeo("nobody")).rejects.toBeInstanceOf(UpstreamError);
    mockFetch(() => json(500));
    await expect(fetchPublicProfileForSeo("nobody")).rejects.toBeInstanceOf(UpstreamError);
  });
});
