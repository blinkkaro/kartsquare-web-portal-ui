import MainLayout from "@/app/mainLayout";
import BlogView from "@/components/pages/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | KartSquare Portal",
  description: "Read the latest blog posts",
};

export default function Blog() {
  return (
    <MainLayout>
      <BlogView />
    </MainLayout>
  );
}
