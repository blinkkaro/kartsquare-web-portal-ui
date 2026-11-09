import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true, // gzip responses
  poweredByHeader: false, // remove X-Powered-By header
  experimental: {
    optimizePackageImports: [
      // tree-shake heavy packages
      "@mui/material",
      "@mui/icons-material",
      "framer-motion",
    ],
  },
  async redirects() {
    return [
      // ── Services: /services → /cus/services-list ─────────────────────────
      {
        source: "/services",
        destination: "/cus/services-list",
        permanent: true,
      },
      // old camelCase URL (existing bookmarks / indexed links); query string is preserved
      {
        source: "/cus/servicesList",
        destination: "/cus/services-list",
        permanent: true,
      },
      // ── camelCase → kebab-case (Google prefers kebab-case) ───────────────
      // kebab-case is the canonical destination; camelCase pages are kept as
      // redirect sources so any existing inbound links still resolve correctly.
      {
        source: "/contactUs",
        destination: "/contact-us",
        permanent: true,
      },
      // legacy locale-prefixed about-us URL (old site: kartsquare.com/en/aboutus)
      {
        source: "/en/aboutus",
        destination: "/about-us",
        permanent: true,
      },
      {
        source: "/aboutus",
        destination: "/about-us",
        permanent: true,
      },
      {
        source: "/aboutUs",
        destination: "/about-us",
        permanent: true,
      },
      {
        source: "/privacyPolicy",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/termsConditions",
        destination: "/terms-conditions",
        permanent: true,
      },
      {
        source: "/terms-and-conditions",
        destination: "/terms-conditions",
        permanent: true,
      },
      {
        source: "/terms",
        destination: "/terms-conditions",
        permanent: true,
      },
      {
        source: "/cookie-policy-info",
        destination: "/cookie-policy",
        permanent: true,
      },
      // ── Old blog numeric ID redirect (also handled by middleware) ─────────
      {
        source: "/blog",
        destination: "/blogs",
        permanent: true,
      },
      // ── Join-as-provider: old standalone External page → canonical route ──
      {
        source: "/External/JoinAsProvider",
        destination: "/supplier/register",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // Serve the existing camelCase page files at kebab-case canonical URLs.
      // This avoids duplicating page files while making kebab-case the public URL.
      { source: "/contact-us", destination: "/contactUs" },
      { source: "/privacy-policy", destination: "/privacyPolicy" },
      { source: "/terms-conditions", destination: "/termsConditions" },
    ];
  },
  // Category icons and photos change only on a deploy: let browsers and the CDN keep them
  // for 30 days, and serve the cached copy while revalidating for a week after that.
  async headers() {
    const longCache = [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=604800" }];
    return [
      { source: "/category-icons/:path*", headers: longCache },
      { source: "/images/categories/:path*", headers: longCache },
    ];
  },
  images: {
    // AVIF first: about 20% smaller than WebP for the category photos.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "kartsquare-document.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
