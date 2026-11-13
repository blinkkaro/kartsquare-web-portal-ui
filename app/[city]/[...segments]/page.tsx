import type { Metadata } from "next";
import {
  buildLocationListingMetadata,
  parsePage,
  renderLocationListing,
} from "@/lib/seo/locationListingPage";

type Props = {
  params: Promise<{ city: string; segments: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * Every listing URL under a city:
 *
 *   /{city}/{category}                   /jaipur/ac-repair
 *   /{city}/{locality}/{category}        /jaipur/mansarovar/ac-repair
 *   /{city}/{category}/{subcategory}     /jaipur/ac-repair/split-ac-service
 *
 * One catch-all rather than separate routes, for two reasons. Next.js forbids
 * different slug names at the same depth ([locality] vs [category]), and the
 * last two shapes are indistinguishable from the path alone — only the data
 * says which is which, so the resolver tries both.
 */
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const [{ city, segments }, search] = await Promise.all([params, searchParams]);
  return buildLocationListingMetadata(city, segments ?? [], parsePage(search.page));
}

export default async function CityListingPage({ params, searchParams }: Props) {
  const [{ city, segments }, search] = await Promise.all([params, searchParams]);
  return renderLocationListing(city, segments ?? [], parsePage(search.page));
}
