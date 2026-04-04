import React from "react";
import type { Metadata } from "next";
import MainLayout from "../../mainLayout";
import { blogs } from "../../../data/blogs";
import BlogsDetailView from "@/components/pages/blogDetails";
import { SITE_URL } from "@/lib/seo/buildMetadata";

function findBlog(slugOrId: string) {
  return blogs.find((b) => b.id === slugOrId || b.slug === slugOrId);
}

function canonicalBlogPath(blog: (typeof blogs)[number]): string {
  return `/blogs/${blog.slug || blog.id}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = findBlog(slug);
  if (!blog) {
    return {
      title: { absolute: "Blog post not found | KartSquare" },
      description: "The article you are looking for is not available.",
      robots: { index: false, follow: true },
    };
  }

  const path = canonicalBlogPath(blog);
  const canonical = `${SITE_URL}${path}`;
  const rawTitle = blog.metaTitle || blog.title;
  const titleText = /KartSquare/i.test(rawTitle)
    ? rawTitle
    : `${rawTitle} | KartSquare`;
  const keywords = blog.tags?.length ? blog.tags : undefined;
  const description =
    blog.metaDescription?.trim() ||
    blog.excerpt?.trim() ||
    blog.description?.slice(0, 160) ||
    `Read ${blog.title} on the KartSquare blog.`;

  return {
    title: { absolute: titleText },
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical },
    openGraph: {
      title: titleText,
      description,
      url: canonical,
      siteName: "KartSquare",
      type: "article",
      locale: "en_IN",
      publishedTime: blog.date,
      ...(blog.coverImage ? { images: [{ url: blog.coverImage }] } : {}),
    },
    twitter: {
      card: blog.coverImage ? "summary_large_image" : "summary",
      title: titleText,
      description,
      ...(blog.coverImage ? { images: [blog.coverImage] } : {}),
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = findBlog(slug);

  const jsonLd = blog
    ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: blog.title,
        description: blog.metaDescription || blog.excerpt,
        image: blog.coverImage,
        datePublished: blog.date,
        author: { "@type": "Organization", name: blog.author || "KartSquare" },
        publisher: {
          "@type": "Organization",
          name: "KartSquare",
          url: SITE_URL,
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${SITE_URL}${canonicalBlogPath(blog)}`,
        },
      })
    : null;

  return (
    <MainLayout>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      ) : null}
      <BlogsDetailView />
    </MainLayout>
  );
}
