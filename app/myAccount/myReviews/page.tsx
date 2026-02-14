import MainLayout from "@/app/mainLayout";
import MyReviewView from "@/components/pages/myReview";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "My Reviews",
  description: "Add customer reviews to user profile testimonials",
};

function MyReviewsPage() {
  return (
    <MainLayout>
      <MyReviewView />
    </MainLayout>
  );
}

export default MyReviewsPage;
