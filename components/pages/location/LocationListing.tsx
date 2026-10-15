"use client";

import React from "react";
import NextLink from "next/link";
import { Box, Typography, Grid, Chip, Alert, Stack, Divider } from "@mui/material";
import ServiceCard from "@/components/ServiceCard";
import type {
  LocationListing as Listing,
} from "@/services/location/locationService";

interface Props {
  listing: Listing;
  /** The place the URL asked for, which may differ from the one that answered. */
  requestedLocalitySlug?: string;
}

/**
 * A city x category listing page.
 *
 * Every cross-link here is a real `next/link` anchor rather than a router
 * push: these blocks are what make a hierarchy of thousands of pages
 * crawlable within a sane budget, and a crawler does not fire onClick.
 */
const LocationListing: React.FC<Props> = ({ listing }) => {
  const { location, city, category, services, pagination, siblings, fallback } =
    listing;

  const placeName =
    location.kind === "locality" ? `${location.name}, ${city.name}` : location.name;

  const cityPath = `/${city.slug}`;

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 2, md: 3 } }}>
      <Typography variant="h1" sx={{ fontSize: { xs: 24, md: 32 }, fontWeight: 600 }}>
        {category.name} in {placeName}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {pagination.total === 0
          ? `No ${category.name.toLowerCase()} providers listed here yet`
          : `${pagination.total} verified ${category.name.toLowerCase()} ${
              pagination.total === 1 ? "provider" : "providers"
            } in ${placeName}`}
      </Typography>

      {/* The page widened. Say so plainly rather than quietly showing the
          city's results as though the user had asked for the city. */}
      {fallback && (
        <Alert severity="info" sx={{ mt: 2 }}>
          {fallback.reason === "locality_unknown"
            ? `We don't have ${fallback.requested?.replace(/-/g, " ")} on the map yet — showing all of ${city.name}.`
            : `Not enough ${category.name.toLowerCase()} providers in ${fallback.requested?.replace(/-/g, " ")} yet — showing all of ${city.name}.`}
        </Alert>
      )}

      {siblings.localities.length > 0 && (
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2.5 }}>
          {siblings.localities
            .filter((l) => l.total > 0)
            .map((locality) => (
              <Chip
                key={locality.id}
                component={NextLink}
                href={`${cityPath}/${locality.slug}/${category.slug}`}
                clickable
                size="small"
                variant={location.slug === locality.slug ? "filled" : "outlined"}
                label={`${locality.name} (${locality.total})`}
              />
            ))}
        </Stack>
      )}

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {services.map((service) => (
          <Grid key={service.service_id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <ServiceCard service={service} />
          </Grid>
        ))}
      </Grid>

      {services.length === 0 && (
        <Typography variant="body1" sx={{ mt: 4 }}>
          Nothing listed here yet. Try a nearby city below.
        </Typography>
      )}

      {pagination.total_pages > 1 && (
        <Stack direction="row" gap={1} sx={{ mt: 3 }} flexWrap="wrap">
          {Array.from({ length: pagination.total_pages }, (_, i) => i + 1)
            .slice(0, 20)
            .map((pageNumber) => (
              <Chip
                key={pageNumber}
                component={NextLink}
                // Page 1 is the bare path so it never competes with itself.
                href={
                  pageNumber === 1
                    ? listing.canonical_path
                    : `${listing.canonical_path}?page=${pageNumber}`
                }
                clickable
                size="small"
                variant={pageNumber === pagination.page ? "filled" : "outlined"}
                label={pageNumber}
              />
            ))}
        </Stack>
      )}

      {siblings.nearby_cities.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h2" sx={{ fontSize: 18, fontWeight: 600 }}>
            {category.name} in nearby cities
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1.5 }}>
            {siblings.nearby_cities.map((nearby) => (
              <Chip
                key={nearby.id}
                component={NextLink}
                href={`/${nearby.slug}/${category.slug}`}
                clickable
                size="small"
                variant="outlined"
                label={`${category.name} in ${nearby.name} (${nearby.total})`}
              />
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
};

export default LocationListing;
