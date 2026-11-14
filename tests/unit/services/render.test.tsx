/**
 * @jest-environment node
 */
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import CategoryContentView from "@/components/pages/servicesHub/CategoryContentView";
import LandingContentSection from "@/components/pages/servicesHub/LandingContentSection";
import ServicesHubView from "@/components/pages/servicesHub/ServicesHubView";
import { CATEGORY_CONTENT } from "@/data/services/categories";
import { LANDING_CONTENT } from "@/data/services/landing";
import { findBannedClaims } from "@/lib/services/claims";
import type { Service } from "@/services/serviceList/listInteraface";

jest.mock("@/store/hooks", () => ({ useAppDispatch: () => jest.fn() }));
jest.mock("@/app/mainLayout", () => ({ __esModule: true, default: ({ children }: { children: React.ReactNode }) => <main>{children}</main> }));

const text = (html: string) => html.replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
const flat = (html: string) => html.replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, "|").replace(/\s+/g, " ");
const hrefs = (html: string) => Array.from(html.matchAll(/href="([^"]+)"/g), (m) => m[1]);
const count = (html: string, tag: string) => (html.match(new RegExp(`<${tag}[ >]`, "g")) ?? []).length;

const provider = { service_id: "abc", service_name: "Shivam Aircon", provider_name: "Shivam", canonical_path: "/services/jaipur/shivam-aircon", slug: "shivam-aircon" } as unknown as Service;

describe("rendered pages", () => {
  it.each(CATEGORY_CONTENT.map((c) => [c.slug, c] as const))("category page %s: one h1, sane links, no claims", (_slug, content) => {
    const html = renderToStaticMarkup(<CategoryContentView content={content} providers={[provider]} coverage={{ [content.slug]: 2 }} cityName="Jaipur" citySlug="jaipur" />);
    expect(count(html, "h1")).toBe(1);
    expect(count(html, "h2")).toBeGreaterThanOrEqual(6);
    for (const h of hrefs(html)) {
      if (!h.startsWith("/")) continue;
      expect(h).toBe(h.toLowerCase());
      expect(h === "/" || !h.endsWith("/")).toBe(true);
    }
    // related links point at pages that exist
    const known = new Set(CATEGORY_CONTENT.map((c) => `/services/c/${c.slug}`));
    for (const r of content.related) expect(known.has(`/services/c/${r}`)).toBe(true);
    expect(hrefs(html)).toContain(`/jaipur/${content.slug}`);
    expect(hrefs(html)).toContain("/services/jaipur/shivam-aircon");
    expect(findBannedClaims(text(html))).toEqual([]);
    expect(html).not.toMatch(/₹|★|\brating|\bstars?\b/i);
    expect(html).not.toMatch(/click here|read more/i);
    // no lowercased acronyms or doubled words in headings and links
    expect(flat(html)).not.toMatch(/\b(\w+) \1\b/i);
    expect(text(html)).not.toMatch(/\bit & digital\b/);
  });

  it("shows the category photo from the API, and an icon tile when there is none", () => {
    const content = CATEGORY_CONTENT[0];
    const media = { [content.slug]: { icon: "ph:house-duotone", color: "#059669", image: "https://res.cloudinary.com/x/image/upload/v1/kartsquare/categories/a.webp" } };
    const withPhoto = renderToStaticMarkup(<CategoryContentView content={content} providers={[]} coverage={{}} media={media} cityName="Jaipur" citySlug="jaipur" />);
    expect(withPhoto).toMatch(/<img[^>]+alt=""/);
    const without = renderToStaticMarkup(<CategoryContentView content={content} providers={[]} coverage={{}} cityName="Jaipur" citySlug="jaipur" />);
    expect(without).not.toMatch(/<img/);
  });

  it("omits Jaipur provider links when the API shows no coverage", () => {
    const content = CATEGORY_CONTENT[0];
    const html = renderToStaticMarkup(<CategoryContentView content={content} providers={[]} coverage={{}} cityName="Jaipur" citySlug="jaipur" />);
    expect(hrefs(html)).not.toContain(`/jaipur/${content.slug}`);
    expect(html).not.toContain("providers in Jaipur");
    expect(hrefs(html)).toContain("/cus/services-list");
  });

  it("hub: one h1, links every category, shows city links only for live categories", () => {
    const html = renderToStaticMarkup(<ServicesHubView categories={CATEGORY_CONTENT} coverage={{ "home-services": 3 }} cityName="Jaipur" citySlug="jaipur" />);
    expect(count(html, "h1")).toBe(1);
    for (const c of CATEGORY_CONTENT) expect(hrefs(html)).toContain(`/services/c/${c.slug}`);
    expect(hrefs(html)).toContain("/jaipur/home-services");
    expect(hrefs(html)).not.toContain("/jaipur/automotive");
    expect(findBannedClaims(text(html))).toEqual([]);
  });

  it("hub: every card opens a real page (guide, else the city list, else it is left out)", () => {
    const viewable = ["home-services"];
    const html = renderToStaticMarkup(<ServicesHubView categories={CATEGORY_CONTENT} coverage={{ "home-services": 3, automotive: 2 }} contentSlugs={viewable} cityName="Jaipur" citySlug="jaipur" />);
    const links = hrefs(html);
    expect(links).toContain("/services/c/home-services");
    expect(links).toContain("/jaipur/automotive");
    // no coverage and no viewable guide: no card, so no dead link
    expect(links).not.toContain("/services/c/fitness-sports");
    expect(links).not.toContain("/jaipur/fitness-sports");
    expect(links.filter((h) => h.startsWith("/services/c/"))).toEqual(["/services/c/home-services"]);
  });

  it("category page breadcrumbs link to the hub at /explore-services", () => {
    const html = renderToStaticMarkup(<CategoryContentView content={CATEGORY_CONTENT[0]} providers={[]} coverage={{}} cityName="Jaipur" citySlug="jaipur" />);
    expect(hrefs(html)).toContain("/explore-services");
    expect(hrefs(html)).not.toContain("/services");
  });

  it.each(LANDING_CONTENT.map((l) => [l.subCategorySlug, l] as const))("landing section %s: no h1, no claims", (_s, content) => {
    const html = renderToStaticMarkup(<LandingContentSection content={content} />);
    expect(count(html, "h1")).toBe(0);
    expect(findBannedClaims(text(html))).toEqual([]);
  });
});
