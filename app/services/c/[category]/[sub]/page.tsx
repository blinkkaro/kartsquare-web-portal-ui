import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import SubServiceView from "@/components/pages/servicesHub/SubServiceView";
import { SUB_SERVICE_CONTENT } from "@/data/services/subServices";
import { seoPrivate, seoPublic } from "@/lib/seo/buildMetadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/breadcrumbs";
import { serializeJsonLd } from "@/lib/seo/jsonLd";
import { categoryContentPath, getCategoryContent, getSubService, isSubServiceIndexable, SERVICES_HUB_PATH, subServicePath } from "@/lib/services/content";
import { COVERAGE_CITY, getCategoryMedia, getCityCoverage, getSubServiceProviders } from "@/lib/services/coverage";
import { photoSrc } from "@/lib/services/photo";

export const revalidate = 300;
export const dynamicParams = true;

interface Params {
  params: Promise<{ category: string; sub: string }>;
}

export function generateStaticParams() {
  return SUB_SERVICE_CONTENT.map((s) => ({ category: s.categorySlug, sub: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category, sub } = await params;
  const content = getSubService(category, sub);
  if (!content) return seoPrivate({ title: "Not found", description: "This page does not exist." });
  // Unreviewed guides are public but noindex, and are not in the sitemap.
  if (!isSubServiceIndexable(content)) return seoPrivate({ title: content.seoTitle, description: content.metaDescription });
  const media = await getCategoryMedia();
  const photo = photoSrc(media[content.categorySlug]?.image);
  return seoPublic({
    title: content.seoTitle,
    description: content.metaDescription,
    path: subServicePath(content.categorySlug, content.slug),
    ...(photo?.startsWith("https://") ? { image: photo } : {}),
  });
}

export default async function SubServicePage({ params }: Params) {
  const { category, sub } = await params;
  const content = getSubService(category, sub);
  const parent = getCategoryContent(category);
  if (!content || !parent) notFound();
  // Mixed-case URL: one 308 to the lowercase canonical.
  if (category !== content.categorySlug || sub !== content.slug) permanentRedirect(subServicePath(content.categorySlug, content.slug));

  const [coverage, providers, media] = await Promise.all([getCityCoverage(), getSubServiceProviders(content.categorySlug, content.matchTerms), getCategoryMedia()]);

  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Services", item: SERVICES_HUB_PATH },
    { name: parent.name, item: categoryContentPath(parent.slug) },
    { name: content.name, item: subServicePath(content.categorySlug, content.slug) },
  ]);
  // FAQPage structured data only for reviewed, real FAQ content.
  const faqJsonLd = isSubServiceIndexable(content)
    ? serializeJsonLd({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: content.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      })
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbs }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />}
      <SubServiceView content={content} parent={parent} providers={providers} coverage={coverage} media={media} cityName={COVERAGE_CITY.name} citySlug={COVERAGE_CITY.slug} />
    </>
  );
}
