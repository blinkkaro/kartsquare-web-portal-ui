import React from "react";
import MainLayout from "../mainLayout";
import ListingView from "@/components/pages/leading";
import { seoPublic } from "@/lib/seo/buildMetadata";

export const metadata = seoPublic({
  title: "List your business for free",
  description:
    "Register your company on KartSquare to reach buyers and service customers. Create a free business listing and grow visibility across India.",
  path: "/business-listing",
  keywords: [
    "free business listing",
    "list company India",
    "KartSquare registration",
    "B2B visibility",
  ],
});

export default function FreeListing() {
  return (
    <MainLayout>
      <ListingView />
    </MainLayout>
  );
}
