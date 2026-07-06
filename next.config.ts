import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // ── Services: make /services the canonical URL ──────────────────────
      // Previously /services → /cus/servicesList. Reversed: /cus/servicesList
      // now redirects to /services so Google indexes the clean top-level path.
      {
        source: "/cus/servicesList",
        destination: "/services",
        permanent: true,
      },
      // ── Kebab-case aliases for camelCase legal pages ─────────────────────
      // Google prefers kebab-case; these redirects capture natural traffic.
      {
        source: "/contact-us",
        destination: "/contactUs",
        permanent: true,
      },
      {
        source: "/privacy-policy",
        destination: "/privacyPolicy",
        permanent: true,
      },
      {
        source: "/terms-and-conditions",
        destination: "/termsConditions",
        permanent: true,
      },
      {
        source: "/terms",
        destination: "/termsConditions",
        permanent: true,
      },
      {
        source: "/cookie-policy-info",
        destination: "/cookie-policy",
        permanent: true,
      },
      // ── Old blog numeric ID redirect (also handled by middleware) ─────────
      // Keep here as a safety net for external links
      {
        source: "/blog",
        destination: "/blogs",
        permanent: true,
      },
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
