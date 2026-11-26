import { blogs } from "@/data/blogs";

// Only generateStaticParams is under test; keep the page's view tree out of a node test.
jest.mock("@/app/mainLayout", () => ({ __esModule: true, default: () => null }));
jest.mock("@/components/pages/blogDetails", () => ({ __esModule: true, default: () => null }));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { generateStaticParams } = require("@/app/blogs/[slug]/page") as {
  generateStaticParams: () => { slug: string }[];
};

describe("blog posts are prerendered at build", () => {
  const params = generateStaticParams();

  it("prerenders every blog post", () => {
    expect(params).toHaveLength(blogs.length);
  });

  it("uses each post's canonical slug (its id only when it has no slug)", () => {
    expect(params.map((p) => p.slug)).toEqual(blogs.map((b) => b.slug || b.id));
  });

  it("never prerenders the same URL twice", () => {
    const slugs = params.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
