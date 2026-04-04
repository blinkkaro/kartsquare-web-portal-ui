import React from "react";
import MainLayout from "../../mainLayout";
import ProviderProfilePage from "@/components/pages/providerProfile";
import { Metadata } from "next";
import {
  buildProfileJsonLd,
  buildProfileMetadata,
  fetchPublicProfileForSeo,
} from "@/lib/seo/publicProfile";

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
      return {
        title: { absolute: "Profile not found | KartSquare" },
        description: "This KartSquare profile could not be found.",
        robots: { index: false, follow: true },
      };
    }
    return buildProfileMetadata(payload, username);
  } catch {
    return {
      title: { absolute: "Profile | KartSquare" },
      description:
        "Discover service providers and suppliers on KartSquare — India's marketplace for products and professional services.",
      robots: { index: false, follow: true },
    };
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const seoPayload = await fetchPublicProfileForSeo(username);
  const jsonLd = seoPayload ? buildProfileJsonLd(seoPayload, username) : null;

  return (
    <MainLayout>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <ProviderProfilePage username={username} />
    </MainLayout>
  );
}
