import React from "react";
import type { Metadata } from "next";
import MainLayout from "../../mainLayout";
import { blogs } from "../../../data/blogs";
import BlogsDetailView from "@/components/pages/blogDetails";
import { SITE_URL } from "@/lib/seo/buildMetadata";

function findBlog(slugOrId: string) {
  return blogs.find((b) => b.id === slugOrId || b.slug === slugOrId);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const blog = findBlog(id);
  if (!blog) {
    return {
      title: { absolute: "Blog post not found | KartSquare" },
      description: "The article you are looking for is not available.",
      robots: { index: false, follow: true },
    };
  }

  const path = `/blogs/${blog.slug || blog.id}`;
  const canonical = `${SITE_URL}${path}`;
  const rawTitle = blog.metaTitle || blog.title;
  const titleText = /KartSquare/i.test(rawTitle)
    ? rawTitle
    : `${rawTitle} | KartSquare`;
  const keywords = blog.tags?.length ? blog.tags : undefined;

  return {
    title: { absolute: titleText },
    description: blog.metaDescription,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical },
    openGraph: {
      title: titleText,
      description: blog.metaDescription,
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
      description: blog.metaDescription,
      ...(blog.coverImage ? { images: [blog.coverImage] } : {}),
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blog = findBlog(id);

  const jsonLd = blog
    ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: blog.title,
        description: blog.metaDescription,
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
          "@id": `${SITE_URL}/blogs/${blog.slug || blog.id}`,
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
