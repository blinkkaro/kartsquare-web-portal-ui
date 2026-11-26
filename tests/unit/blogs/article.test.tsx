/**
 * @jest-environment node
 */
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import BlogArticle from "@/components/pages/blogDetails/BlogArticle";
import { blogs, type BlogPost } from "@/data/blogs";
import { formatBlogDate, prepareArticle, relatedPosts } from "@/lib/blog/article";
import { findBannedClaims } from "@/lib/services/claims";

const post = (over: Partial<BlogPost>): BlogPost => ({
  id: "x", slug: "x", title: "T", excerpt: "E", description: "D", content: "", author: "kartsquare Team", date: "2026-11-25",
  category: "Repairs", coverImage: "/c.jpg", metaTitle: "M", metaDescription: "MD", tags: [], ...over,
});

describe("prepareArticle", () => {
  it("anchors every h2, de-duplicates ids and builds the contents list", () => {
    const a = prepareArticle(post({ content: "<p>Hi</p><h2>Before you call</h2><p>a</p><h2>Before you call</h2><h2 id=\"old\">FAQ &amp; more</h2>" }));
    expect(a.toc).toEqual([
      { id: "before-you-call", label: "Before you call" },
      { id: "before-you-call-2", label: "Before you call" },
      { id: "faq-more", label: "FAQ & more" },
    ]);
    expect(a.html).toContain('<h2 id="before-you-call">');
    expect(a.html).not.toContain('id="old"');
  });

  it("moves the cover credit into the caption", () => {
    const a = prepareArticle(post({ content: "<p>Body</p>\n<p><small>Cover photo: <a href=\"https://x\">X</a>, CC BY 2.0.</small></p>" }));
    expect(a.coverCredit).toMatch(/^Cover photo:/);
    expect(a.html).not.toContain("Cover photo");
  });

  it("estimates reading time and formats the date the same everywhere", () => {
    expect(prepareArticle(post({ content: `<p>${"word ".repeat(1100)}</p>` })).readingMinutes).toBe(5);
    expect(formatBlogDate("2026-11-25")).toBe("25 Nov 2026");
  });

  it("suggests other posts, same category first, never the post itself", () => {
    const b = blogs.find((x) => x.id === "11") as BlogPost;
    const r = relatedPosts(b, blogs);
    expect(r).toHaveLength(3);
    expect(r.map((x) => x.id)).not.toContain("11");
    expect(r[0].category).toBe(b.category);
  });
});

describe("BlogArticle", () => {
  jest.mock("@/app/mainLayout", () => ({ __esModule: true, default: ({ children }: { children: React.ReactNode }) => <main>{children}</main> }));

  it.each(["10", "11", "12"])("post %s: one h1, contents list, caption, related links, no claims in chrome", (id) => {
    const b = blogs.find((x) => x.id === id) as BlogPost;
    const a = prepareArticle(b);
    const html = renderToStaticMarkup(
      <BlogArticle blog={b} html={a.html} toc={a.toc} coverCredit={a.coverCredit} readingMinutes={a.readingMinutes} displayDate={a.displayDate} canonicalUrl={`https://www.kartsquare.com/blogs/${b.slug}`} related={[{ href: "/blogs/y", title: "Y", category: "General", displayDate: "1 Jan 2026", coverImage: "/y.jpg" }]} />,
    );
    expect((html.match(/<h1[ >]/g) ?? []).length).toBe(1);
    for (const t of a.toc) expect(html).toContain(`href="#${t.id}"`);
    expect(html).toContain("min read");
    expect(html).toContain('href="/blogs/y"');
    expect(html).toContain("/explore-services");
    if (b.coverImage.startsWith("/")) expect(html).toMatch(/<figcaption[^>]*>Cover photo:/);
    const chrome = html.replace(a.html, "").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ");
    expect(findBannedClaims(chrome)).toEqual([]);
  });
});
