import MainLayout from "@/app/mainLayout";
import MyPreferencesView from "@/components/pages/myPreferences";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Preferences| kartsquare Portal",
  description: "Update and manage your preferences",
};

const Preferences = () => {
  return (
    <MainLayout>
      <MyPreferencesView />
    </MainLayout>
  );
};

export default Preferences;
