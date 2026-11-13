"use client";

import React from "react";
import MainLayout from "@/app/mainLayout";
import { ServicesView } from "@/components/pages/servicesList/ServicesView";
import type { LocationListing as Listing } from "@/services/location/locationService";

interface Props {
  listing: Listing;
  /** The place the URL asked for, which may differ from the one that answered. */
  requestedLocalitySlug?: string;
}

/**
 * A city x category listing page.
 *
 * Fully integrated with the Services 2.0 redesigned responsive layout matching Claude artboard specs:
 * - Location-based routing preserved
 * - Real next/link anchors for sibling localities and nearby cities to support crawler indexation
 * - Interactive hero header, filter sidebar, horizontal pro cards, quick-view drawer, and explore section
 */
const LocationListing: React.FC<Props> = ({ listing }) => {
  return (
    <MainLayout>
      <ServicesView initialListing={listing} />
    </MainLayout>
  );
};

export default LocationListing;
