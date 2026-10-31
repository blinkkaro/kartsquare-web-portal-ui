import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { seoPublic, SITE_URL } from "@/lib/seo/buildMetadata";
import { buildBreadcrumbJsonLd } from "@/lib/seo/breadcrumbs";
import {
  getLocationListing,
  type ListingArgs,
  type LocationListing as Listing,
} from "@/services/location/locationService";
import LocationListingView from "@/components/pages/location/LocationListing";

/** `?page=` is the only query parameter a canonical listing page may carry. */
export function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

export interface ResolvedRoute {
  args: ListingArgs;
  listing: Listing;
}

/**
 * Works out what `/{city}/a/b` means, because the URL design is genuinely
 * ambiguous: `/{city}/{locality}/{category}` and
 * `/{city}/{category}/{subcategory}` are both three segments.
 *
 * Only the data can tell them apart, so both readings are tried against the
 * API. A locality reading that only survived because the backend fell back to
 * the city (`locality_unknown`) is a weak match and loses to a clean
 * category/subcategory reading — otherwise `/jaipur/ac-repair/split-ac` would
 * resolve as the non-existent locality "ac-repair".
 */
export async function resolveListingRoute(
  citySlug: string,
  segments: string[],
  page: number,
): Promise<ResolvedRoute | null> {
  if (segments.length === 1) {
    const args: ListingArgs = { citySlug, categorySlug: segments[0], page };
    const listing = await getLocationListing(args);
    if (listing) {
      return { args, listing };
    }

    // If segments[0] is not a category, try as locality (e.g. /jaipur/jhotwara)
    const asLocality: ListingArgs = {
      citySlug,
      localitySlug: segments[0],
      categorySlug: "home-services",
      page,
    };
    const localityListing = await getLocationListing(asLocality);
    if (
      localityListing &&
      localityListing.fallback?.reason !== "locality_unknown"
    ) {
      return { args: asLocality, listing: localityListing };
    }

    return null;
  }

  if (segments.length === 2) {
    const [first, second] = segments;

    const asLocality: ListingArgs = {
      citySlug,
      localitySlug: first,
      categorySlug: second,
      page,
    };
    const localityListing = await getLocationListing(asLocality);
    if (
      localityListing &&
      localityListing.fallback?.reason !== "locality_unknown"
    ) {
      return { args: asLocality, listing: localityListing };
    }

    const asSubCategory: ListingArgs = {
      citySlug,
      categorySlug: first,
      subCategorySlug: second,
      page,
    };
    const subCategoryListing = await getLocationListing(asSubCategory);
    if (subCategoryListing) {
      return { args: asSubCategory, listing: subCategoryListing };
    }

    // Neither reading is clean: keep the weak locality match so the page can
    // say "we don't have that locality yet" rather than 404.
    return localityListing
      ? { args: asLocality, listing: localityListing }
      : null;
  }

  // Deeper than the canonical shapes — not a page.
  return null;
}

/**
 * Metadata for a listing page.
 *
 * DB-generated copy wins; the fallback is built from the real place and
 * category names rather than one template string with the city substituted —
 * five hundred near-identical titles is the doorway-page signature this
 * whole feature has to avoid.
 */
export async function buildLocationListingMetadata(
  citySlug: string,
  segments: string[],
  page: number,
): Promise<Metadata> {
  const resolved = await resolveListingRoute(citySlug, segments, page);

  if (!resolved) {
    return { title: "Not found", robots: { index: false, follow: false } };
  }

  const { listing } = resolved;
  const placeName =
    listing.location.kind === "locality"
      ? `${listing.location.name}, ${listing.city.name}`
      : listing.location.name;

  const subject = listing.sub_category?.name ?? listing.category.name;

  const path =
    page > 1 ? `${listing.canonical_path}?page=${page}` : listing.canonical_path;

  const seo = listing.seo;
  const title =
    seo?.meta_title?.trim() ||
    `${subject} in ${placeName}${page > 1 ? ` — page ${page}` : ""}`;

  const description =
    seo?.meta_description?.trim() ||
    `Compare ${listing.pagination.total} verified ${subject.toLowerCase()} ` +
      `providers in ${placeName}. Ratings, prices and direct booking on kartsquare.`;

  const metadata = seoPublic({
    title,
    description: description.slice(0, 160),
    // A paginated page canonicalises to ITSELF, not back to page 1 — that is
    // what keeps deep supply reachable instead of orphaned.
    path,
    ...(seo?.meta_keywords
      ? {
          keywords: seo.meta_keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
        }
      : {}),
    ...(seo?.og_image?.trim() ? { image: seo.og_image.trim() } : {}),
    ...(seo?.og_title?.trim() ? { ogTitle: seo.og_title.trim() } : {}),
    ...(seo?.og_description?.trim()
      ? { ogDescription: seo.og_description.trim() }
      : {}),
  });

  // The backend owns the indexability decision — threshold, sort and filter
  // state — so the sitemap, the meta robots tag and the redirect cannot
  // disagree about which pages exist.
  return {
    ...metadata,
    robots: listing.indexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}

function buildItemListJsonLd(listing: Listing, placeName: string): string {
  const subject = listing.sub_category?.name ?? listing.category.name;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${subject} in ${placeName}`,
    numberOfItems: listing.pagination.total,
    itemListElement: listing.services.slice(0, 20).map((service, index) => {
      const address = service.service_address as
        | Record<string, unknown>
        | undefined;
      return {
        "@type": "ListItem",
        position:
          (listing.pagination.page - 1) * listing.pagination.limit + index + 1,
        item: {
          "@type": "LocalBusiness",
          name: service.business_name || service.provider_name,
          url: `${SITE_URL}/services/${service.slug || service.service_id}`,
          ...(service.image_urls?.length
            ? { image: service.image_urls[0] }
            : {}),
          ...(address
            ? {
                address: {
                  "@type": "PostalAddress",
                  streetAddress: address.address ?? undefined,
                  addressLocality: address.city_town ?? undefined,
                  addressRegion: address.state ?? undefined,
                  postalCode: address.pincode ?? undefined,
                  addressCountry: address.country ?? "IN",
                },
                ...(Number(address.latitude) && Number(address.longitude)
                  ? {
                      geo: {
                        "@type": "GeoCoordinates",
                        latitude: address.latitude,
                        longitude: address.longitude,
                      },
                    }
                  : {}),
              }
            : {}),
          ...(Number(service.review_count) > 0
            ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: service.avg_service_rating,
                  reviewCount: service.review_count,
                },
              }
            : {}),
        },
      };
    }),
  });
}

/** Renders any listing route under `/{city}/…`. */
export async function renderLocationListing(
  citySlug: string,
  segments: string[],
  page: number,
) {
  const resolved = await resolveListingRoute(citySlug, segments, page);

  // An unknown city, locality or category is a 404 — this route sits at the
  // root of the URL space and would otherwise swallow every mistyped path.
  if (!resolved) notFound();

  const { args, listing } = resolved;

  // A locality that is thin, or that does not exist, is not a page of its
  // own. 301 to the city rather than letting a near-empty or invented URL
  // into the index — that is what turns a local-SEO asset into a
  // doorway-page penalty.
  if (
    args.localitySlug &&
    (listing.fallback?.reason === "locality_thin" ||
      listing.fallback?.reason === "locality_unknown")
  ) {
    permanentRedirect(listing.canonical_path);
  }

  const placeName =
    listing.location.kind === "locality"
      ? `${listing.location.name}, ${listing.city.name}`
      : listing.location.name;

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: listing.city.name, item: `/${listing.city.slug}` },
    ...(listing.location.kind === "locality"
      ? [
          {
            name: listing.location.name,
            item: `/${listing.city.slug}/${listing.location.slug}`,
          },
        ]
      : []),
    { name: listing.category.name, item: listing.canonical_path },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: buildBreadcrumbJsonLd(breadcrumbs),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: buildItemListJsonLd(listing, placeName),
        }}
      />
      <LocationListingView listing={listing} />
    </>
  );
}
