import type { Metadata } from "next";
import { SITE_URL } from "./buildMetadata";

export function getApiBaseUrl(): string {
  const raw =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5500/api/v1";
  return String(raw).replace(/\/$/, "");
}

export type PublicProfileVariant = "provider" | "supplier";

export type PublicProfileSeoPayload = {
  profile: Record<string, unknown>;
  variant: PublicProfileVariant;
};

/**
 * Server-only public profile fetch for SEO (metadata + JSON-LD).
 * Uses native fetch so generateMetadata works without the browser axios stack.
 * Next.js deduplicates identical fetch calls in the same render.
 */
export async function fetchPublicProfileForSeo(
  username: string,
): Promise<PublicProfileSeoPayload | null> {
  const base = getApiBaseUrl();
  const enc = encodeURIComponent(username);

  const providerRes = await fetch(`${base}/profile/provider/${enc}`, {
    next: { revalidate: 300 },
    headers: { Accept: "application/json" },
  });
  if (providerRes.ok) {
    const json = await providerRes.json();
    const profile = json?.data?.profile;
    if (profile) return { profile, variant: "provider" };
  }

  const supplierRes = await fetch(`${base}/profile/supplier/${enc}`, {
    next: { revalidate: 300 },
    headers: { Accept: "application/json" },
  });
  if (supplierRes.ok) {
    const json = await supplierRes.json();
    const profile = json?.data?.profile;
    if (profile) return { profile, variant: "supplier" };
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
    `View ${display} on KartSquare — book services, see work, and connect with a verified business profile.`
  );
}

function parseStructuredData(
  raw: unknown,
): Record<string, unknown> | null {
  if (!raw) return null;
  if (typeof raw === "object" && raw !== null && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (typeof parsed === "object" && parsed !== null) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      return null;
    }
  }
  return null;
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
      url: `${String(SITE_URL).replace(/\/$/, "")}/in/${uname}`,
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

  const stored = parseStructuredData(profile.structured_data);
  if (stored) {
    return {
      ...stored,
      "@context": stored["@context"] || "https://schema.org",
      url: canonicalUrl,
      name: (stored.name as string) || display,
      description: (stored.description as string) || description,
    };
  }

  return buildGeoJsonLd(profile, variant, canonicalUrl, display, description);
}

export function buildProfileMetadata(
  payload: PublicProfileSeoPayload,
  username: string,
): Metadata {
  const { profile, variant } = payload;
  const display = displayName(profile, variant);
  const title =
    str(profile.meta_title) || `${display} | KartSquare`;
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
      siteName: "KartSquare",
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
