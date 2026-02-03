"use client";
import React from "react";
import { blogs } from "../../../data/blogs";
import BlogDetailsContent from "./components/BlogDetailsContents";
import { useParams } from "next/navigation";

function BlogsDetailView() {
  const params = useParams();
  const blog = blogs.find((b) => b.id === params.id);
  return <BlogDetailsContent blog={blog} />;
}

export default BlogsDetailView;
