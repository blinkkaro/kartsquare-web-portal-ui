import type { Metadata } from "next";
import { SITE_URL } from "./buildMetadata";
import { fetchPublicJson, getApiBaseUrl } from "./upstream";

export { getApiBaseUrl };

export type PublicProfileVariant = "provider" | "supplier";

export type PublicProfileSeoPayload = {
  profile: Record<string, unknown>;
  variant: PublicProfileVariant;
};

type ProfileResponse = { data?: { profile?: Record<string, unknown> } };

/**
 * Server-only public profile fetch for SEO (metadata + JSON-LD).
 *
 * Returns the profile, or `null` only when the API answered "not found" for both
 * the provider and the supplier lookup. A network error, timeout or 5xx throws
 * UpstreamError: an outage must never be rendered (or cached) as a 404.
 * Next.js deduplicates identical fetch calls in the same render.
 */
export async function fetchPublicProfileForSeo(
  username: string,
): Promise<PublicProfileSeoPayload | null> {
  const base = getApiBaseUrl();
  const enc = encodeURIComponent(username);

  const provider = await fetchPublicJson<ProfileResponse>(`${base}/profile/provider/${enc}`);
  if (provider.status === "ok" && provider.body?.data?.profile) {
    return { profile: provider.body.data.profile, variant: "provider" };
  }

  const supplier = await fetchPublicJson<ProfileResponse>(`${base}/profile/supplier/${enc}`);
  if (supplier.status === "ok" && supplier.body?.data?.profile) {
    return { profile: supplier.body.data.profile, variant: "supplier" };
  }

  return null;
}

function str(v: unknown): string | undefined {
  if (v == null) return undefined;
  return typeof v === "string" && v.trim() ? v : undefined;
}

function absolutizeMediaUrl(url: string): string {
  const base = String(SITE_URL).replace(/\/$/, "");
  if (/^https?:\/\//i.test(url)) return url;
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${base}${path}`;
}

function displayName(
  profile: Record<string, unknown>,
  variant: PublicProfileVariant,
): string {
  if (variant === "supplier") {
    const store = str(profile.store_name);
    if (store) return store;
  } else {
    const biz = str(profile.business_name);
    if (biz) return biz;
  }
  const first = str(profile.first_name) || "";
  const last = str(profile.last_name) || "";
  const combined = `${first} ${last}`.trim();
  return combined || str(profile.username) || "Profile";
}

function descriptionFromProfile(
  profile: Record<string, unknown>,
  display: string,
): string {
  return (
    str(profile.meta_description) ||
    str(profile.description) ||
    str(profile.bio) ||
    `View ${display} on kartsquare — book services, see work, and connect with a business profile.`
  );
}

function buildGeoJsonLd(
  profile: Record<string, unknown>,
  variant: PublicProfileVariant,
  canonicalUrl: string,
  display: string,
  description: string,
): Record<string, unknown> {
  const addr = profile.default_address as Record<string, unknown> | undefined;
  const image =
    str(profile.og_image) ||
    str(profile.profile_pic) ||
    str(profile.logo_url) ||
    str(profile.banner_image);

  const postal: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": variant === "supplier" ? "Store" : "ProfessionalService",
    "@id": `${canonicalUrl}#profile`,
    name: display,
    description: description.slice(0, 2000),
    url: canonicalUrl,
  };

  if (image) postal.image = image;

  if (addr && typeof addr === "object") {
    const line1 = str(addr.address_line1);
    const city = str(addr.city);
    const state = str(addr.state);
    const zip = str(addr.postal_code);
    const country = str(addr.country);
    if (line1 || city || state || country) {
      postal.address = {
        "@type": "PostalAddress",
        ...(line1 ? { streetAddress: line1 } : {}),
        ...(city ? { addressLocality: city } : {}),
        ...(state ? { addressRegion: state } : {}),
        ...(zip ? { postalCode: zip } : {}),
        ...(country ? { addressCountry: country } : {}),
      };
    }
    const lat = addr.latitude;
    const lng = addr.longitude;
    if (typeof lat === "number" && typeof lng === "number") {
      postal.geo = {
        "@type": "GeoCoordinates",
        latitude: lat,
        longitude: lng,
      };
    }
  }

  const uname = str(profile.username);
  const personName = `${str(profile.first_name) || ""} ${str(profile.last_name) || ""}`.trim();
  if (personName && uname) {
    postal.provider = {
      "@type": "Person",
      name: personName,
      url: `${String(SITE_URL).replace(/\/$/, "")}/in/${encodeURIComponent(uname)}`,
    };
  }

  return postal;
}

export function buildProfileJsonLd(
  payload: PublicProfileSeoPayload,
  username: string,
): Record<string, unknown> | null {
  const { profile, variant } = payload;
  const canonicalUrl = `${String(SITE_URL).replace(/\/$/, "")}/in/${encodeURIComponent(username)}`;
  const display = displayName(profile, variant);
  const description = descriptionFromProfile(profile, display);

  // The stored `structured_data` is AI-generated and has carried guessed URLs, so it
  // is never used: the node is built from real fields and the canonical URL only.
  return buildGeoJsonLd(profile, variant, canonicalUrl, display, description);
}

export function buildProfileMetadata(
  payload: PublicProfileSeoPayload,
  username: string,
): Metadata {
  const { profile, variant } = payload;
  const display = displayName(profile, variant);
  const title =
    str(profile.meta_title) || `${display} | kartsquare`;
  const description = descriptionFromProfile(profile, display);
  const keywordsRaw = str(profile.meta_keywords);
  const canonicalPath = `/in/${encodeURIComponent(username)}`;

  const ogTitle = str(profile.og_title) || title;
  const ogDesc = str(profile.og_description) || description;

  const profilePicRaw =
    str(profile.og_image) ||
    str(profile.profile_pic) ||
    str(profile.logo_url);
  const profilePic = profilePicRaw
    ? absolutizeMediaUrl(profilePicRaw)
    : `${SITE_URL}/og?title=${encodeURIComponent(ogTitle)}&desc=${encodeURIComponent(ogDesc.slice(0, 120))}`;

  return {
    title: { absolute: title },
    description,
    ...(keywordsRaw
      ? { keywords: keywordsRaw.split(",").map((k) => k.trim()).filter(Boolean) }
      : {}),
    alternates: {
      canonical: `${String(SITE_URL).replace(/\/$/, "")}${canonicalPath}`,
    },
    openGraph: {
      type: "profile",
      url: `${String(SITE_URL).replace(/\/$/, "")}${canonicalPath}`,
      siteName: "kartsquare",
      title: ogTitle,
      description: ogDesc,
      images: [{ url: profilePic, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDesc,
      images: [profilePic],
    },
    robots: { index: true, follow: true },
  };
}
