import type { NextConfig } from "next";

/**
 * Local development only: proxy /api/* to a backend running on this machine (default :5900), so the
 * browser talks to its own origin and CORS never applies. Use with
 * NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1 (see docs/01-project-overview.md).
 * Never active in production builds.
 */
const LOCAL_API_TARGET = process.env.LOCAL_API_PROXY_TARGET ?? "http://localhost:5900";
const proxyLocalApi = process.env.NODE_ENV !== "production";

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
      // Kept until the /services content hub is reviewed. Set SERVICES_HUB_ENABLED=true
      // (build and runtime) to serve the hub at /services instead.
      ...(process.env.SERVICES_HUB_ENABLED === "true"
        ? []
        : [
            {
              source: "/services",
              destination: "/cus/services-list",
              permanent: true,
            },
          ]),
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
      ...(proxyLocalApi
        ? [{ source: "/api/:path*", destination: `${LOCAL_API_TARGET}/api/:path*` }]
        : []),
    ];
  },
  images: {
    // AVIF first where Next optimizes an image itself (Cloudinary photos use their own loader).
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
