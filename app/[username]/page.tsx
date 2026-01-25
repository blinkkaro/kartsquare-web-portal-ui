"use client";

import React from "react";
import MainLayout from "../mainLayout";
import ProviderProfilePage from "@/components/pages/providerProfile";

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { username } = React.use(params);
  
  return (
    <MainLayout>
      <ProviderProfilePage username={username} />
    </MainLayout>
  );
}
