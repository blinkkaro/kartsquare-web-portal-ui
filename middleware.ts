import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { blogs } from "@/data/blogs";

/**
 * Permanent redirect /blogs/1 → /blogs/my-post-slug so crawlers and users share one canonical URL.
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const match = /^\/blogs\/([^/]+)\/?$/.exec(pathname);
  if (!match) return NextResponse.next();

  const segment = decodeURIComponent(match[1]);
  if (!/^\d+$/.test(segment)) return NextResponse.next();

  const blog = blogs.find((b) => b.id === segment);
  if (!blog?.slug?.trim()) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/blogs/${blog.slug}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/blogs/:segment"],
};
