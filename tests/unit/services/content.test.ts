import { CATEGORY_CONTENT } from "@/data/services/categories";
import { LANDING_CONTENT } from "@/data/services/landing";
import { findBannedClaims } from "@/lib/services/claims";
import { categoryContentPath, indexableCategories } from "@/lib/services/content";
import { similarity, validateContent } from "@/lib/services/validate";

describe("category content", () => {
  it("every entry is complete and free of banned claims", () => {
    for (const c of CATEGORY_CONTENT) expect({ slug: c.slug, problems: validateContent(c) }).toEqual({ slug: c.slug, problems: [] });
  });

  it("every landing entry is complete and free of banned claims", () => {
    for (const l of LANDING_CONTENT) expect({ slug: l.subCategorySlug, problems: validateContent(l) }).toEqual({ slug: l.subCategorySlug, problems: [] });
  });

  it("slugs are lowercase, hyphenated and unique", () => {
    const slugs = CATEGORY_CONTENT.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  it("titles, descriptions and h1s are unique", () => {
    for (const key of ["seoTitle", "metaDescription", "h1"] as const) {
      const values = [...CATEGORY_CONTENT, ...LANDING_CONTENT].map((c) => c[key].toLowerCase());
      expect(new Set(values).size).toBe(values.length);
    }
  });

  it("intros are not near-duplicates", () => {
    const all = [...CATEGORY_CONTENT, ...LANDING_CONTENT].map((c) => c.intro.join(" "));
    for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) expect(similarity(all[i], all[j])).toBeLessThan(0.2);
  });

  it("related categories point at categories that exist", () => {
    const slugs = new Set(CATEGORY_CONTENT.map((c) => c.slug));
    for (const c of CATEGORY_CONTENT) for (const r of c.related) expect(slugs.has(r) && r !== c.slug).toBe(true);
  });

  it("nothing is indexable until a person marks it reviewed", () => {
    expect(CATEGORY_CONTENT.filter((c) => c.reviewed)).toHaveLength(indexableCategories().length);
    expect(indexableCategories()).toHaveLength(0);
  });

  it("builds a lowercase canonical path", () => {
    expect(categoryContentPath("home-services")).toBe("/services/c/home-services");
  });
});

describe("banned claims", () => {
  it.each([
    ["Verified providers", "verified"],
    ["We guarantee the repair", "guarantee"],
    ["Available 24/7", "24/7"],
    ["Instant booking", "instant"],
    ["Fixed price repairs", "fixed price"],
    ["The best plumber", "best"],
  ])("flags %s", (text, label) => expect(findBannedClaims(text)).toContain(label));

  it("allows a disclaimer but not a claim", () => {
    expect(findBannedClaims("Kartsquare does not guarantee the outcome")).toEqual([]);
    expect(findBannedClaims("Kartsquare does guarantee the outcome")).toContain("guarantee");
  });

  it("lets ordinary wording through", () => {
    expect(findBannedClaims("Send a request and agree the price with the provider.")).toEqual([]);
  });
});

describe("draft visibility", () => {
  const env = process.env as Record<string, string | undefined>;
  const original = { node: env.NODE_ENV, preview: env.SERVICES_PREVIEW };
  afterEach(() => {
    env.NODE_ENV = original.node;
    env.SERVICES_PREVIEW = original.preview;
  });

  it("hides unreviewed content in production unless previewing", async () => {
    const { getCategoryContent } = await import("@/lib/services/content");
    env.NODE_ENV = "production";
    delete env.SERVICES_PREVIEW;
    expect(getCategoryContent("home-services")).toBeUndefined();
    env.SERVICES_PREVIEW = "true";
    expect(getCategoryContent("home-services")?.slug).toBe("home-services");
  });

  it("is case-insensitive and returns nothing for unknown slugs", async () => {
    const { getCategoryContent } = await import("@/lib/services/content");
    env.NODE_ENV = "development";
    expect(getCategoryContent("HOME-SERVICES")?.slug).toBe("home-services");
    expect(getCategoryContent("nope")).toBeUndefined();
  });
});

describe("titles and descriptions against the reviewed static-page manifest", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const manifest = require("@/data/seo/metaManifest.json").entries as Array<{ title: string; description: string }>;

  it("never repeats a title or description already used by a static page or blog", () => {
    const used = new Set(manifest.flatMap((e) => [e.title.toLowerCase(), e.description.toLowerCase()]));
    for (const c of [...CATEGORY_CONTENT, ...LANDING_CONTENT]) {
      expect(used.has(c.seoTitle.toLowerCase())).toBe(false);
      expect(used.has(c.metaDescription.toLowerCase())).toBe(false);
    }
  });
});
