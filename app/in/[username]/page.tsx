import React from "react";
import MainLayout from "../../mainLayout";
import ProviderProfilePage from "@/components/pages/providerProfile";
import { Metadata } from "next";
import { profileService } from "@/services/profile/pofileService";

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata(
  { params }: ProfilePageProps
): Promise<Metadata> {
  const { username } = await params;

  try {
    // Need to fix typo in filename or import if 'pofileService' is typo in codebase
    // Assuming 'pofileService.ts' exports 'profileService'
    const response = await profileService.getProviderProfileByUsername(username);
    const profile = response.profile;

    let structuredData = null;
    if (profile.structured_data) {
      structuredData = typeof profile.structured_data === 'string'
        ? JSON.parse(profile.structured_data)
        : profile.structured_data;
    }

    const title = profile.meta_title || `${profile.first_name} ${profile.last_name} | Kartsquare`;
    const description = profile.meta_description || profile.bio || `Check out ${profile.first_name} ${profile.last_name}'s profile on Kartsquare.`;

    return {
      title: title,
      description: description,
      keywords: profile.meta_keywords?.split(','),
      openGraph: {
        title: profile.og_title || title,
        description: profile.og_description || description,
        images: profile.og_image ? [profile.og_image] : (profile.profile_pic ? [profile.profile_pic] : []),
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kartsquare.com'}/in/${profile.username}`,
      },
      other: {
        'script:ld+json': structuredData ? JSON.stringify(structuredData) : ''
      }
    };
  } catch (error) {
    return {
      title: "User Profile | Kartsquare",
      description: "User profile page"
    };
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  return (
    <MainLayout>
      <ProviderProfilePage username={username} />
    </MainLayout>
  );
}
