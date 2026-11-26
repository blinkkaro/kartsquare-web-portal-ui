/**
 * @jest-environment node
 */
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AboutKartsquare from "@/components/pages/home/sections/AboutKartsquare";
import LocalGuide from "@/components/pages/home/sections/LocalGuide";
import PopularNeeds from "@/components/pages/home/sections/PopularNeeds";
import ServicesHubView from "@/components/pages/servicesHub/ServicesHubView";
import { CATEGORY_CONTENT } from "@/data/services/categories";
import { COMMITMENTS, HOME_GUIDE_INTRO, HOME_SEASON_LINES, HUB_FAQ, PLAYBOOK, SEASONS, SITUATIONS } from "@/data/services/hubCopy";
import { SUB_SERVICE_CONTENT } from "@/data/services/subServices";
import { isBundledCategoryIcon } from "@/lib/categoryIcons";
import { findBannedClaims } from "@/lib/services/claims";
import { getCategoryContent, getSubService } from "@/lib/services/content";

jest.mock("@/store/hooks", () => ({ useAppDispatch: () => jest.fn() }));
jest.mock("@/app/mainLayout", () => ({ __esModule: true, default: ({ children }: { children: React.ReactNode }) => <main>{children}</main> }));

const text = (html: string) => html.replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
const hrefs = (html: string) => Array.from(html.matchAll(/href="([^"]+)"/g), (m) => m[1]);

/** True when an internal /services/c path is a page in data/services. */
const exists = (href: string) => {
  const m = href.match(/^\/services\/c\/([^/#]+)(?:\/([^/#]+))?/);
  if (!m) return true;
  return m[2] ? Boolean(getSubService(m[1], m[2])) : Boolean(getCategoryContent(m[1]));
};

describe("hub and home copy", () => {
  const strings = [
    ...SITUATIONS.flatMap((s) => [s.label, s.hint]),
    ...SEASONS.flatMap((s) => [s.title, s.text, ...s.links.map((l) => l.label)]),
    ...PLAYBOOK.flatMap((p) => [p.heading, ...p.paragraphs]),
    ...COMMITMENTS.flatMap((c) => [c.title, c.text]),
    ...HUB_FAQ.flatMap((f) => [f.q, f.a]),
    ...HOME_GUIDE_INTRO,
    ...HOME_SEASON_LINES.map((l) => l.text),
  ];

  it("contains no banned claims, prices or numbers about supply", () => {
    for (const t of strings) {
      expect({ t, claims: findBannedClaims(t) }).toEqual({ t, claims: [] });
      expect(t).not.toMatch(/₹|\brating of\b|\d+\+|\d+,\d{3}/);
    }
  });

  it("links only to pages that exist, with bundled icons", () => {
    for (const s of SITUATIONS) {
      expect(exists(s.href)).toBe(true);
      expect(isBundledCategoryIcon(s.icon)).toBe(true);
    }
    for (const s of SEASONS) for (const l of s.links) expect(exists(l.href)).toBe(true);
  });
});

describe("rendered hub", () => {
  it("one h1, every internal guide link resolves, no claims", () => {
    const html = renderToStaticMarkup(<ServicesHubView categories={CATEGORY_CONTENT} guides={SUB_SERVICE_CONTENT} coverage={{ "home-services": 3 }} cityName="Jaipur" citySlug="jaipur" />);
    expect((html.match(/<h1[ >]/g) ?? []).length).toBe(1);
    for (const h of hrefs(html)) if (h.startsWith("/")) expect(exists(h)).toBe(true);
    expect(hrefs(html)).toContain("/business-listing");
    expect(findBannedClaims(text(html))).toEqual([]);
  });

  it("leaves out problem links whose guide cannot be opened", () => {
    const html = renderToStaticMarkup(<ServicesHubView categories={CATEGORY_CONTENT} coverage={{}} contentSlugs={["home-services"]} cityName="Jaipur" citySlug="jaipur" />);
    const guideLinks = hrefs(html).filter((h) => h.startsWith("/services/c/"));
    expect(new Set(guideLinks)).toEqual(new Set(["/services/c/home-services"]));
  });
});

describe("home local guide", () => {
  it("renders links that exist and no h1", () => {
    const html = renderToStaticMarkup(
      <>
        <LocalGuide />
        <PopularNeeds />
      </>,
    );
    expect(html).not.toMatch(/<h1[ >]/);
    for (const h of hrefs(html)) if (h.startsWith("/")) expect(exists(h)).toBe(true);
    expect(findBannedClaims(text(html))).toEqual([]);
  });
});

describe("home about section", () => {
  it("links to pages that exist, keeps its heading and describes the photo", () => {
    const html = renderToStaticMarkup(<AboutKartsquare />);
    expect(text(html)).toContain("Your local services app for Jaipur");
    for (const h of hrefs(html)) if (h.startsWith("/services/")) expect(exists(h)).toBe(true);
    expect(hrefs(html)).toContain("/explore-services");
    expect(html).toMatch(/alt="The windows of Hawa Mahal in Jaipur"/);
  });
});
