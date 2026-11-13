import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { ServiceDetailBody, serviceMetadata } from "@/lib/seo/servicePage";
import { lookupService, serviceRedirectTarget } from "@/lib/seo/serviceSeo";
import { isSlugShape } from "@/lib/seo/sitemapPaths";

/**
 * Legacy single-segment URL: /services/{uuid} or /services/{slug}. Every service
 * that has a canonical URL gets ONE permanent redirect to /services/{city}/{slug}
 * (keeping ?action=). A service with no canonical city or slug has no canonical
 * URL, so this page renders it, noindex.
 */
type Props = {
  params: Promise<{ first: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const validId = (v: string) => UUID_RE.test(v) || isSlugShape(v);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { first } = await params;
  if (!validId(first)) return { robots: { index: false, follow: false } };
  return serviceMetadata(first, `/services/${first}`);
}

export default async function LegacyServicePage({ params, searchParams }: Props) {
  const { first } = await params;
  // Shape check before any API call: arbitrary strings never reach the backend.
  if (!validId(first)) notFound();

  // No try/catch: notFound()/permanentRedirect() work by throwing, and an
  // UpstreamError must reach the error boundary, not be shown as a missing page.
  const lookup = await lookupService(first);
  if (lookup.kind === "not-found") notFound();

  const target = serviceRedirectTarget(`/services/${first}`, lookup.service, await searchParams);
  if (target) permanentRedirect(target);

  return <ServiceDetailBody service={lookup.service} />;
}
