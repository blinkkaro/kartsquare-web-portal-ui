import React from "react";
import { notFound } from "next/navigation";
import MainLayout from "../../mainLayout";
import ProviderProfilePage from "@/components/pages/providerProfile";
import { Metadata } from "next";
import {
  buildProfileJsonLd,
  buildProfileMetadata,
  fetchPublicProfileForSeo,
} from "@/lib/seo/publicProfile";
import { buildBreadcrumbJsonLd } from "@/lib/seo/breadcrumbs";

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata(
  { params }: ProfilePageProps,
): Promise<Metadata> {
  const { username } = await params;

  try {
    const payload = await fetchPublicProfileForSeo(username);
    if (!payload) {
      // Profile genuinely not found — signal 404 to metadata. The page component
      // will call notFound() and Next.js will serve the not-found page.
      return {
        title: { absolute: "Profile not found | kartsquare" },
        description: "This kartsquare profile could not be found.",
        // Let the not-found page be indexed so Google understands it's a 404,
        // but don't follow further links from this error state.
        robots: { index: false, follow: false },
      };
    }
    return buildProfileMetadata(payload, username);
  } catch {
    // API threw (e.g. network error, 5xx). This is a temporary failure —
    // do NOT permanently deindex the profile. Keep noindex ONLY for this render;
    // once the API recovers, a fresh crawl will re-index via the sitemap.
    // A permanently-down profile should be handled with 503 at the infra level.
    return {
      title: { absolute: "Profile | kartsquare" },
      description:
        "Discover service providers and suppliers on kartsquare — India's marketplace for products and professional services.",
      robots: { index: false, follow: true },
    };
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const seoPayload = await fetchPublicProfileForSeo(username);

  // Trigger Next.js 404 page when profile doesn't exist.
  // This ensures Google receives a proper 404 HTTP status and removes the
  // URL from its index naturally — better than serving a noindex page.
  if (!seoPayload) {
    notFound();
  }

  const jsonLd = buildProfileJsonLd(seoPayload, username);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Profiles", item: "/business-listing" },
    {
      name: username,
      item: `/in/${username}`,
    },
  ]);

  return (
    <MainLayout>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      {breadcrumbJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
        />
      ) : null}
      <ProviderProfilePage username={username} />
    </MainLayout>
  );
}
