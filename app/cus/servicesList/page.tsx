import type { Metadata } from "next";
import { Suspense } from "react";
import { Box, Typography } from "@mui/material";
import { seoPublic } from "@/lib/seo/buildMetadata";
import { sitePageSeoOrFallback } from "@/lib/seo/sitePageSeo";
import ListOfServices from "../../../components/pages/servicesList";

import { buildBreadcrumbJsonLd, BREADCRUMBS } from "@/lib/seo/breadcrumbs";

const servicesListFallback = seoPublic({
  title: "Browse services \u2014 book home & professional help",
  description:
    "Discover and book home repairs, cleaning, beauty, wellness, and professional services from verified KartSquare providers across India.",
  path: "/services",
  keywords: [
    "book services online India",
    "home services near me",
    "KartSquare services",
    "verified technicians",
    "professional services India",
    "home repair booking",
  ],
});

export async function generateMetadata(): Promise<Metadata> {
  return sitePageSeoOrFallback("services_list", servicesListFallback);
}

/** Real fallback copy for the useSearchParams Suspense boundary — see /store for why. */
function ServicesListFallback() {
  return (
    <Box sx={{ textAlign: "center", py: { xs: 6, md: 10 } }}>
      <Typography variant="h3" component="h1" fontWeight={900} sx={{ mb: 2 }}>
        Services for you
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
        Find trusted professionals for your needs
      </Typography>
    </Box>
  );
}

export default function ServicesListPage() {
  const jsonLd = buildBreadcrumbJsonLd(BREADCRUMBS.SERVICES);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <Suspense fallback={<ServicesListFallback />}>
        <ListOfServices />
      </Suspense>
    </>
  );
}
