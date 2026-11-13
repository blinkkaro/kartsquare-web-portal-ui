import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicesHubView from "@/components/pages/servicesHub/ServicesHubView";
import { CATEGORY_CONTENT } from "@/data/services/categories";
import { seoPublic, seoPrivate } from "@/lib/seo/buildMetadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/breadcrumbs";
import { COVERAGE_CITY, getCityCoverage } from "@/lib/services/coverage";
import { HUB_REVIEWED } from "@/data/services/hub";
import { isServicesHubEnabled, SERVICES_HUB_PATH } from "@/lib/services/content";

export const revalidate = 300;

const TITLE = "Explore Services on Kartsquare: Find Local Providers";
const DESCRIPTION =
  "Browse service categories on Kartsquare, read what each covers and what to check before choosing a provider, then send a request to a local provider.";

export function generateMetadata(): Metadata {
  // Until a person marks the hub reviewed it renders for preview but is not indexed.
  if (!HUB_REVIEWED) return seoPrivate({ title: TITLE, description: DESCRIPTION });
  return seoPublic({ title: TITLE, description: DESCRIPTION, path: SERVICES_HUB_PATH });
}

export default async function ServicesHubPage() {
  // /services is redirected to the app list while the hub flag is off (next.config.ts),
  // so this route is only reachable when it is on. Belt and braces:
  if (!isServicesHubEnabled()) notFound();

  const coverage = await getCityCoverage();
  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Services", item: SERVICES_HUB_PATH },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbs }} />
      <ServicesHubView categories={CATEGORY_CONTENT} coverage={coverage} cityName={COVERAGE_CITY.name} citySlug={COVERAGE_CITY.slug} />
    </>
  );
}
