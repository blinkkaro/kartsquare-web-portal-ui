import React from "react";
import { Metadata } from "next";
import MainLayout from "../mainLayout";
import BlogView from "../../components/pages/blogs";

export const metadata: Metadata = {
  title: "Expert Home Service Tips & Guides - KartSquare",
  description:
    "Discover expert tips and guides on home services, from cleaning to repairs. Get insights from KartSquare for better home maintenance.",
};

function Blog() {
  return (
    <MainLayout>
      <BlogView />
    </MainLayout>
  );
}

export default Blog;
