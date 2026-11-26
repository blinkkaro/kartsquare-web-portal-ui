import type { Metadata } from "next";
import ServiceMarquee from "@/components/pages/home/sections/ServiceMarquee";
import ServicesHubView from "@/components/pages/servicesHub/ServicesHubView";
import { CATEGORY_CONTENT } from "@/data/services/categories";
import { SUB_SERVICE_CONTENT } from "@/data/services/subServices";
import { seoPublic, seoPrivate } from "@/lib/seo/buildMetadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/breadcrumbs";
import { serializeJsonLd } from "@/lib/seo/jsonLd";
import { categoryContentPath, getCategoryContent, indexableSubServices, SERVICES_HUB_PATH, subServicePath } from "@/lib/services/content";
import { SITE_URL } from "@/lib/seo/buildMetadata";
import { COVERAGE_CITY, getCategoryMedia, getCityCoverage } from "@/lib/services/coverage";
import { HUB_REVIEWED } from "@/data/services/hub";

export const revalidate = 300;

const TITLE = "Explore Local Services in Jaipur on Kartsquare";
const DESCRIPTION =
  "Home repair, phone and laptop repair, vehicles, events and more in Jaipur. Read plain guides on what to ask, then send a request to a local provider.";

export function generateMetadata(): Metadata {
  // Until a person marks the hub reviewed it is visible but not indexed.
  if (!HUB_REVIEWED) return seoPrivate({ title: TITLE, description: DESCRIPTION });
  return seoPublic({ title: TITLE, description: DESCRIPTION, path: SERVICES_HUB_PATH });
}

export default async function ServicesHubPage() {
  const [coverage, media] = await Promise.all([getCityCoverage(), getCategoryMedia()]);
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Services", item: SERVICES_HUB_PATH },
  ]);

  // The hub is a collection of real pages: list only the reviewed ones, as the sitemap does.
  const collection = serializeJsonLd({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}${SERVICES_HUB_PATH}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        ...CATEGORY_CONTENT.filter((c) => c.reviewed).map((c) => ({ name: c.name, path: categoryContentPath(c.slug) })),
        ...indexableSubServices().map((s) => ({ name: s.name, path: subServicePath(s.categorySlug, s.slug) })),
      ].map((x, i) => ({ "@type": "ListItem", position: i + 1, name: x.name, url: `${SITE_URL}${x.path}` })),
    },
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: collection }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbs }} />
      <ServicesHubView heroStrip={<ServiceMarquee />} categories={CATEGORY_CONTENT} guides={SUB_SERVICE_CONTENT} coverage={coverage} media={media} contentSlugs={CATEGORY_CONTENT.filter((c) => getCategoryContent(c.slug)).map((c) => c.slug)} cityName={COVERAGE_CITY.name} citySlug={COVERAGE_CITY.slug} />
    </>
  );
}
