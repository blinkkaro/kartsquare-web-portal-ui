import React from "react";
import { Metadata } from "next";
import MainLayout from "../../mainLayout";
import { blogs } from "../../../data/blogs";
import BlogsDetailView from "@/components/pages/blogDetails";

interface BlogDetailsPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: BlogDetailsPageProps): Promise<Metadata> {
  const blog = blogs.find((b) => b.id === params.id);
  if (!blog) {
    return {
      title: "Blog Not Found - kartsquare",
    };
  }
  return {
    title: blog.metaTitle,
    description: blog.metaDescription,
    keywords: blog.tags.join(", "),
  };
}

const BlogDetailsPage: React.FC<BlogDetailsPageProps> = ({ params }) => {
  return (
    <MainLayout>
      <BlogsDetailView />
    </MainLayout>
  );
};

export default BlogDetailsPage;
