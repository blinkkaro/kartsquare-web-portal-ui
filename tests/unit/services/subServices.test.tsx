/**
 * @jest-environment node
 */
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import SubServiceView from "@/components/pages/servicesHub/SubServiceView";
import { CATEGORY_BY_SLUG, CATEGORY_CONTENT } from "@/data/services/categories";
import { LANDING_CONTENT } from "@/data/services/landing";
import { SUB_SERVICE_CONTENT } from "@/data/services/subServices";
import { isBundledCategoryIcon } from "@/lib/categoryIcons";
import { findBannedClaims } from "@/lib/services/claims";
import { getSubService, isSubServiceIndexable, subServicePath, subServicesFor } from "@/lib/services/content";
import { serviceMatches } from "@/lib/services/coverage";
import { similarity, validateContent } from "@/lib/services/validate";
import type { Service } from "@/services/serviceList/listInteraface";

jest.mock("@/store/hooks", () => ({ useAppDispatch: () => jest.fn() }));
jest.mock("@/app/mainLayout", () => ({ __esModule: true, default: ({ children }: { children: React.ReactNode }) => <main>{children}</main> }));

const text = (html: string) => html.replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
const hrefs = (html: string) => Array.from(html.matchAll(/href="([^"]+)"/g), (m) => m[1]);
const count = (html: string, tag: string) => (html.match(new RegExp(`<${tag}[ >]`, "g")) ?? []).length;

describe("service guide content", () => {
  it("every guide is complete and free of banned claims", () => {
    for (const s of SUB_SERVICE_CONTENT) expect({ slug: s.slug, problems: validateContent(s) }).toEqual({ slug: s.slug, problems: [] });
  });

  it("belongs to a real category and is named in its commonServices", () => {
    for (const s of SUB_SERVICE_CONTENT) {
      const parent = CATEGORY_BY_SLUG[s.categorySlug];
      expect(parent).toBeDefined();
      expect(parent.commonServices.map((x) => x.toLowerCase())).toContain(s.name.toLowerCase());
    }
  });

  it("slugs are lowercase, unique within a category and never reserved", () => {
    const keys = SUB_SERVICE_CONTENT.map((s) => `${s.categorySlug}/${s.slug}`);
    expect(new Set(keys).size).toBe(keys.length);
    for (const s of SUB_SERVICE_CONTENT) {
      expect(s.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(["in", "c", "book"]).not.toContain(s.slug);
    }
  });

  it("titles, descriptions and h1s are unique across every content page", () => {
    for (const key of ["seoTitle", "metaDescription", "h1"] as const) {
      const values = [...CATEGORY_CONTENT, ...LANDING_CONTENT, ...SUB_SERVICE_CONTENT].map((c) => c[key].toLowerCase());
      expect(new Set(values).size).toBe(values.length);
    }
  });

  it("intros are not near-duplicates of each other or of any other page", () => {
    const others = [...CATEGORY_CONTENT, ...LANDING_CONTENT].map((c) => c.intro.join(" "));
    const subs = SUB_SERVICE_CONTENT.map((s) => s.intro.join(" "));
    for (let i = 0; i < subs.length; i++) {
      for (let j = i + 1; j < subs.length; j++) expect(similarity(subs[i], subs[j])).toBeLessThan(0.2);
      for (const o of others) expect(similarity(subs[i], o)).toBeLessThan(0.2);
    }
  });

  it("uses icons that are bundled", () => {
    for (const s of SUB_SERVICE_CONTENT) expect(isBundledCategoryIcon(s.icon)).toBe(true);
  });

  it("looks guides up case-insensitively and indexes only reviewed ones", () => {
    expect(getSubService("MOBILE-ELECTRONICS-REPAIR", "Laptop-Repair")?.slug).toBe("laptop-repair");
    expect(getSubService("home-services", "laptop-repair")).toBeUndefined();
    for (const s of SUB_SERVICE_CONTENT) expect(isSubServiceIndexable(s)).toBe(s.reviewed && CATEGORY_BY_SLUG[s.categorySlug].reviewed);
    expect(subServicePath("mobile-electronics-repair", "tv-repair")).toBe("/services/c/mobile-electronics-repair/tv-repair");
    expect(subServicesFor("mobile-electronics-repair").length).toBe(6);
  });
});

describe("provider matching", () => {
  const svc = (service_name: string, sub?: string[], desc?: string) => ({ service_name, sub_category_name: sub ?? null, service_desc: desc ?? null }) as unknown as Service;
  it("matches whole words in the provider's own listing only", () => {
    expect(serviceMatches(svc("Rainbow Telecom", ["Mobile Repair"]), ["mobile"])).toBe(true);
    expect(serviceMatches(svc("Sharma LED TV Service"), ["tv"])).toBe(true);
    expect(serviceMatches(svc("Stv Electronics"), ["tv"])).toBe(false);
    expect(serviceMatches(svc("Laptop care", undefined, "We fix laptops"), ["cctv"])).toBe(false);
  });
});

describe("rendered service guides", () => {
  const provider = { service_id: "abc", service_name: "Rainbow Telecom", provider_name: "Rajeev", canonical_path: "/services/jaipur/rainbow-telecom", slug: "rainbow-telecom" } as unknown as Service;

  it.each(SUB_SERVICE_CONTENT.map((s) => [s.slug, s] as const))("%s: one h1, crumbs to parent, real links, no claims", (_slug, content) => {
    const parent = CATEGORY_BY_SLUG[content.categorySlug];
    const html = renderToStaticMarkup(<SubServiceView content={content} parent={parent} providers={[provider]} coverage={{ [parent.slug]: 2 }} cityName="Jaipur" citySlug="jaipur" />);
    expect(count(html, "h1")).toBe(1);
    expect(count(html, "h2")).toBeGreaterThanOrEqual(7);
    const links = hrefs(html);
    expect(links).toContain("/explore-services");
    expect(links).toContain(`/services/c/${parent.slug}`);
    expect(links).toContain("/services/jaipur/rainbow-telecom");
    expect(links).toContain(`/jaipur/${parent.slug}`);
    for (const h of links) if (h.startsWith("/")) expect(h).toBe(h.toLowerCase());
    for (const sib of subServicesFor(parent.slug)) if (sib.slug !== content.slug) expect(links).toContain(subServicePath(sib.categorySlug, sib.slug));
    expect(findBannedClaims(text(html))).toEqual([]);
    expect(html).not.toMatch(/₹|★|\brating|\bstars?\b/i);
    expect(text(html)).not.toMatch(/\b(cctv|tv) repair\b/);
  });

  it("shows an empty state and no city link when nothing is listed", () => {
    const content = SUB_SERVICE_CONTENT[0];
    const html = renderToStaticMarkup(<SubServiceView content={content} parent={CATEGORY_BY_SLUG[content.categorySlug]} providers={[]} coverage={{}} cityName="Jaipur" citySlug="jaipur" />);
    expect(text(html)).toContain("No listing in Jaipur names");
    expect(hrefs(html)).not.toContain(`/jaipur/${content.categorySlug}`);
    expect(hrefs(html)).toContain("/cus/services-list");
  });
});
