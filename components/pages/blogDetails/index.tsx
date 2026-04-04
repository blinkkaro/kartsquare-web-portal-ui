"use client";
import React from "react";
import { blogs } from "../../../data/blogs";
import BlogDetailsContent from "./components/BlogDetailsContents";
import { useParams } from "next/navigation";

function BlogsDetailView() {
  const params = useParams();
  const id = params.id as string;
  const blog = blogs.find((b) => b.id === id || b.slug === id);
  return <BlogDetailsContent blog={blog} />;
}

export default BlogsDetailView;
