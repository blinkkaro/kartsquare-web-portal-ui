/**
 * @jest-environment node
 */
import type { CategoryContent } from "@/lib/services/types";

const reviewed: CategoryContent = {
  slug: "home-services",
  name: "Home Services",
  seoTitle: "x",
  metaDescription: "x",
  h1: "x",
  intro: [],
  commonServices: [],
  mayHelp: [],
  mayNotDo: [],
  howToChoose: [],
  requestInfo: [],
  faq: [],
  related: [],
  reviewed: true,
};
const draft: CategoryContent = { ...reviewed, slug: "automotive", name: "Automotive", reviewed: false };

async function load(opts: { hubReviewed: boolean; hubFlag: boolean }) {
  jest.resetModules();
  process.env.SERVICES_HUB_ENABLED = opts.hubFlag ? "true" : "false";
  jest.doMock("@/data/services/categories", () => ({ CATEGORY_CONTENT: [reviewed, draft], CATEGORY_BY_SLUG: {} }));
  jest.doMock("@/data/services/hub", () => ({ HUB_REVIEWED: opts.hubReviewed }));
  return import("@/lib/services/sitemap");
}

describe("contentSitemapPaths", () => {
  it("lists reviewed categories only, in lowercase canonical form", async () => {
    const { contentSitemapPaths } = await load({ hubReviewed: false, hubFlag: false });
    expect(contentSitemapPaths()).toEqual(["/services/c/home-services"]);
  });

  it("lists the hub only when it is both reviewed and switched on", async () => {
    expect((await load({ hubReviewed: true, hubFlag: false })).contentSitemapPaths()).not.toContain("/services");
    expect((await load({ hubReviewed: false, hubFlag: true })).contentSitemapPaths()).not.toContain("/services");
    expect((await load({ hubReviewed: true, hubFlag: true })).contentSitemapPaths()).toContain("/services");
  });
});

describe("sitemap.xml route", () => {
  it("never lists /search, /cus/services-list or draft pages", async () => {
    jest.resetModules();
    process.env.SERVICES_HUB_ENABLED = "false";
    jest.doMock("@/data/services/categories", () => ({ CATEGORY_CONTENT: [reviewed, draft], CATEGORY_BY_SLUG: {} }));
    jest.doMock("@/data/services/hub", () => ({ HUB_REVIEWED: false }));
    const fetchMock = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [] }) });
    (global as unknown as { fetch: typeof fetchMock }).fetch = fetchMock;
    const { GET } = await import("@/app/sitemap.xml/route");
    const xml = await (await GET()).text();
    expect(xml).not.toMatch(/\/search</);
    expect(xml).not.toContain("/cus/services-list");
    expect(xml).not.toContain("/services/c/automotive");
    expect(xml).toContain("/services/c/home-services");
    for (const [, loc] of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      expect(loc).toBe(loc.toLowerCase());
      if (new URL(loc).pathname !== "/") expect(loc).not.toMatch(/\/$/);
    }
  });
});

describe("isServicesHubEnabled", () => {
  it("is on in development, off in production, and the env var overrides both", async () => {
    const { isServicesHubEnabled } = await import("@/lib/services/hubFlag");
    const env = (e: Record<string, string | undefined>) => e as unknown as NodeJS.ProcessEnv;
    expect(isServicesHubEnabled(env({ NODE_ENV: "development" }))).toBe(true);
    expect(isServicesHubEnabled(env({ NODE_ENV: "production" }))).toBe(false);
    expect(isServicesHubEnabled(env({ NODE_ENV: "production", SERVICES_HUB_ENABLED: "true" }))).toBe(true);
    expect(isServicesHubEnabled(env({ NODE_ENV: "development", SERVICES_HUB_ENABLED: "false" }))).toBe(false);
  });
});
