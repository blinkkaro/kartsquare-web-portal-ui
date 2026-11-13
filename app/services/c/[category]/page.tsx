import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import CategoryContentView from "@/components/pages/servicesHub/CategoryContentView";
import { CATEGORY_CONTENT } from "@/data/services/categories";
import { seoPrivate, seoPublic } from "@/lib/seo/buildMetadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/breadcrumbs";
import { serializeJsonLd } from "@/lib/seo/jsonLd";
import { categoryContentPath, getCategoryContent, isCategoryIndexable, SERVICES_HUB_PATH } from "@/lib/services/content";
import { photoSrc } from "@/lib/services/photo";
import { COVERAGE_CITY, getCategoryMedia, getCategoryProviders, getCityCoverage } from "@/lib/services/coverage";

export const revalidate = 300;
export const dynamicParams = true;

interface Params {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return CATEGORY_CONTENT.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category } = await params;
  const content = getCategoryContent(category);
  if (!content) return seoPrivate({ title: "Not found", description: "This page does not exist." });
  const path = categoryContentPath(content.slug);
  // Unreviewed content is public but noindex, and is not in the sitemap.
  if (!isCategoryIndexable(content)) return seoPrivate({ title: content.seoTitle, description: content.metaDescription });
  // Share card: the category photo the site already shows, when there is one.
  const media = await getCategoryMedia();
  const photo = photoSrc(media[content.slug]?.image);
  return seoPublic({ title: content.seoTitle, description: content.metaDescription, path, ...(photo?.startsWith("https://") ? { image: photo } : {}) });
}

export default async function CategoryContentPage({ params }: Params) {
  const { category } = await params;
  const content = getCategoryContent(category);
  if (!content) notFound();
  // Mixed-case URL: one 308 to the lowercase canonical.
  if (category !== content.slug) permanentRedirect(categoryContentPath(content.slug));

  const [coverage, providers, media] = await Promise.all([getCityCoverage(), getCategoryProviders(content.slug), getCategoryMedia()]);

  const breadcrumbs = buildBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Services", item: SERVICES_HUB_PATH },
    { name: content.name, item: categoryContentPath(content.slug) },
  ]);
  // FAQPage structured data only for reviewed, real FAQ content.
  const faqJsonLd = isCategoryIndexable(content)
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
      <CategoryContentView content={content} providers={providers} coverage={coverage} media={media} cityName={COVERAGE_CITY.name} citySlug={COVERAGE_CITY.slug} />
    </>
  );
}
