import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogArticle from "@/components/pages/blogDetails/BlogArticle";
import { formatBlogDate, prepareArticle, relatedPosts } from "@/lib/blog/article";
import { SITE_URL } from "@/lib/seo/buildMetadata";
import { buildBreadcrumbJsonLd, BREADCRUMBS } from "@/lib/seo/breadcrumbs";
import { blogs } from "../../../data/blogs";
import MainLayout from "../../mainLayout";

function findBlog(slugOrId: string) {
  return blogs.find((b) => b.id === slugOrId || b.slug === slugOrId);
}

function canonicalBlogPath(blog: (typeof blogs)[number]): string {
  return `/blogs/${blog.slug || blog.id}`;
}

/** Blog posts are bundled data: prerender every one at build so it is served as static HTML. */
export function generateStaticParams(): { slug: string }[] {
  return blogs.map((b) => ({ slug: b.slug || b.id }));
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
      title: { absolute: "Blog post not found | kartsquare" },
      description: "The article you are looking for is not available.",
      robots: { index: false, follow: true },
    };
  }

  const path = canonicalBlogPath(blog);
  const canonical = `${SITE_URL}${path}`;
  const rawTitle = blog.metaTitle || blog.title;
  const titleText = /kartsquare/i.test(rawTitle) ? rawTitle : `${rawTitle} | kartsquare`;
  const keywords = blog.tags?.length ? blog.tags : undefined;
  const description =
    blog.metaDescription?.trim() ||
    blog.excerpt?.trim() ||
    blog.description?.slice(0, 160) ||
    `Read ${blog.title} on the kartsquare blog.`;

  return {
    title: { absolute: titleText },
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical },
    openGraph: {
      title: titleText,
      description,
      url: canonical,
      siteName: "kartsquare",
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

export default async function BlogDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = findBlog(slug);
  // An unknown post is a real 404, never an empty page.
  if (!blog) notFound();
  const article = prepareArticle(blog);
  const related = relatedPosts(blog, blogs).map((r) => ({
    href: canonicalBlogPath(r),
    title: r.title,
    category: r.category,
    displayDate: formatBlogDate(r.date),
    coverImage: r.coverImage,
  }));

  const jsonLd = blog
    ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: blog.title,
        description: blog.metaDescription || blog.excerpt,
        // Local covers live in public/; structured data needs an absolute URL.
        image: blog.coverImage?.startsWith("/") ? `${SITE_URL}${blog.coverImage}` : blog.coverImage,
        datePublished: blog.date,
        author: { "@type": "Organization", name: blog.author || "kartsquare" },
        publisher: {
          "@type": "Organization",
          name: "kartsquare",
          url: SITE_URL,
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${SITE_URL}${canonicalBlogPath(blog)}`,
        },
      })
    : null;

  const breadcrumbJsonLd = blog
    ? buildBreadcrumbJsonLd([
        ...BREADCRUMBS.BLOGS,
        { name: blog.title, item: canonicalBlogPath(blog) },
      ])
    : null;

  return (
    <MainLayout>
      {jsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      ) : null}
      {breadcrumbJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }} />
      ) : null}
      <BlogArticle
        blog={blog}
        html={article.html}
        toc={article.toc}
        coverCredit={article.coverCredit}
        readingMinutes={article.readingMinutes}
        displayDate={article.displayDate}
        canonicalUrl={`${SITE_URL}${canonicalBlogPath(blog)}`}
        related={related}
      />
    </MainLayout>
  );
}
