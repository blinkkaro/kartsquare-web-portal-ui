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
      // ── Services: /services → /cus/servicesList ──────────────────────────
      {
        source: "/services",
        destination: "/cus/servicesList",
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
  images: {
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
