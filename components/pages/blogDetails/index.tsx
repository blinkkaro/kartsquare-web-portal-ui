"use client";
import React from "react";
import { blogs } from "../../../data/blogs";
import BlogDetailsContent from "./components/BlogDetailsContents";
import { useParams } from "next/navigation";

function BlogsDetailView() {
  const params = useParams();
  const segment = (params.slug as string) || (params as { id?: string }).id || "";
  const blog = blogs.find((b) => b.id === segment || b.slug === segment);
  return <BlogDetailsContent blog={blog} />;
}

export default BlogsDetailView;
