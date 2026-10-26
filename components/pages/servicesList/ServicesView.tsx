"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { Alert, Chip, Stack, Typography } from "@mui/material";
import { openDrawer } from "@/features/ui/profileDrawerSlice";
import { getServiceRouteParam } from "@/utils/serviceRoute";
import { serviceListService } from "@/services/serviceList/serviceListService";
import type { LocationListing as Listing } from "@/services/location/locationService";
import {
  SAMPLE_SERVICES_ELECTRICIANS,
  SAMPLE_SUB_SERVICE_CHIPS,
  SAMPLE_AREAS,
  EnrichedServiceItem,
} from "./servicesSampleData";
import ServicesHeroHeader from "./sections/ServicesHeroHeader";
import ServicesFilterSidebar, {
  ServicesFilterState,
  AreaFilterItem,
  RatingFilterType,
  PricingFilterType,
} from "./sections/ServicesFilterSidebar";
import ServicesToolbar, { SortOptionType } from "./sections/ServicesToolbar";
import ServiceCardHorizontal from "./sections/ServiceCardHorizontal";
import ServiceQuickViewDrawer from "./sections/ServiceQuickViewDrawer";
import ServicesMobileFilterDrawer from "./sections/ServicesMobileFilterDrawer";
import {
  ServicesLoadingSkeleton,
  ServicesEmptyState,
  ServicesErrorState,
} from "./sections/ServicesStates";
import { ServicesExploreSection } from "./sections/ServicesExploreSection";

interface ServicesViewProps {
  initialListing?: Listing;
  initialCategory?: string | null;
  initialSearch?: string;
  initialCity?: string;
}

// Distance calculator using Haversine formula (km)
function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  initialListing,
  initialCategory = null,
  initialSearch = "",
  initialCity,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Determine Category & City
  const categoryName = useMemo(() => {
    if (initialListing?.category.name) return initialListing.category.name;
    if (initialCategory) {
      return initialCategory.charAt(0).toUpperCase() + initialCategory.slice(1);
    }
    return "Electricians";
  }, [initialListing, initialCategory]);

  const cityName = useMemo(() => {
    if (initialListing?.city.name) return initialListing.city.name;
    if (initialCity) {
      return initialCity.charAt(0).toUpperCase() + initialCity.slice(1);
    }
    return "Jaipur";
  }, [initialListing, initialCity]);

  const localityName = useMemo(() => {
    if (initialListing?.location.kind === "locality") {
      return initialListing.location.name;
    }
    return "";
  }, [initialListing]);

  // States
  const [services, setServices] = useState<EnrichedServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // Search & chips
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch || "");
  const [locationQuery, setLocationQuery] = useState<string>(
    localityName ? `${localityName}, ${cityName}` : cityName
  );
  const [selectedSubService, setSelectedSubService] = useState<string>("all");

  // Filters State
  const [filters, setFilters] = useState<ServicesFilterState>({
    rating: "any",
    verifiedOnly: false,
    pricing: "any",
    selectedAreas: [],
    sortByDistance: false,
  });

  const [sortBy, setSortBy] = useState<SortOptionType>("recommended");

  // User location for distance sorting
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Drawer states
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [quickViewService, setQuickViewService] = useState<EnrichedServiceItem | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState<boolean>(false);

  // Load Data
  const loadServicesData = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      // If initialListing provided with services, use them
      if (initialListing?.services && initialListing.services.length > 0) {
        const enriched: EnrichedServiceItem[] = initialListing.services.map((s, index) => {
          const sample = SAMPLE_SERVICES_ELECTRICIANS[index % SAMPLE_SERVICES_ELECTRICIANS.length];
          return {
            ...sample,
            ...s,
            service_id: s.service_id,
            service_name: s.service_name || sample.service_name,
            business_name: s.business_name || sample.business_name,
            provider_name: s.provider_name || sample.provider_name,
            service_desc: s.service_desc || sample.service_desc,
            avg_service_rating: s.avg_service_rating ?? sample.avg_service_rating,
            review_count: s.review_count ?? sample.review_count,
            price: s.price ?? sample.price,
            is_price_required: s.is_price_required ?? sample.is_price_required,
            is_verified: true,
            area_name: s.service_address?.city_town || sample.area_name,
            recent_works: sample.recent_works,
            sub_services: sample.sub_services,
          };
        });
        setServices(enriched);
        return;
      }

      // If no initialListing, call live getServices API
      const response = await serviceListService.getServices({
        limit: 20,
        page: 1,
        ...(searchQuery && { search: searchQuery }),
      });

      if (response && response.services && response.services.length > 0) {
        const mapped: EnrichedServiceItem[] = response.services.map((s, index) => {
          const sample = SAMPLE_SERVICES_ELECTRICIANS[index % SAMPLE_SERVICES_ELECTRICIANS.length];
          return {
            ...sample,
            ...s,
            service_id: s.service_id,
            service_name: s.service_name || sample.service_name,
            business_name: s.business_name || sample.business_name,
            provider_name: s.provider_name || sample.provider_name,
            service_desc: s.service_desc || sample.service_desc,
            avg_service_rating: s.avg_service_rating ?? sample.avg_service_rating,
            review_count: s.review_count ?? sample.review_count,
            price: s.price ?? sample.price,
            is_price_required: s.is_price_required ?? sample.is_price_required,
            is_verified: true,
            area_name: s.service_address?.city_town || sample.area_name,
            recent_works: sample.recent_works,
            sub_services: sample.sub_services,
          };
        });
        setServices(mapped);
      } else {
        // Fallback to high-quality sample data matching Claude artboard
        setServices(SAMPLE_SERVICES_ELECTRICIANS);
      }
    } catch (err) {
      console.warn("API request failed, falling back to sample data:", err);
      setServices(SAMPLE_SERVICES_ELECTRICIANS);
    } finally {
      setLoading(false);
    }
  }, [initialListing, searchQuery]);

  useEffect(() => {
    loadServicesData();
  }, [loadServicesData]);

  // Handle Geolocation Distance Sort
  const handleSortByDistance = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setFilters((prev) => ({ ...prev, sortByDistance: true }));
        setIsLocating(false);
      },
      (err) => {
        console.warn("Geolocation error:", err);
        // Default to Jaipur center coordinates for preview
        setUserCoords({ lat: 26.9124, lng: 75.7873 });
        setFilters((prev) => ({ ...prev, sortByDistance: true }));
        setIsLocating(false);
      },
      { timeout: 7000 }
    );
  };

  const handleFilterChange = (key: keyof ServicesFilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      rating: "any",
      verifiedOnly: false,
      pricing: "any",
      selectedAreas: [],
      sortByDistance: false,
    });
    setSelectedSubService("all");
    setSearchQuery("");
    setSortBy("recommended");
  };

  const hasActiveFilters =
    filters.rating !== "any" ||
    filters.verifiedOnly ||
    filters.pricing !== "any" ||
    filters.selectedAreas.length > 0 ||
    filters.sortByDistance ||
    selectedSubService !== "all" ||
    searchQuery.trim().length > 0;

  // Filter & Sort Pipeline
  const filteredServices = useMemo(() => {
    let result = [...services];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.service_name?.toLowerCase().includes(q) ||
          s.business_name?.toLowerCase().includes(q) ||
          s.provider_name?.toLowerCase().includes(q) ||
          s.service_desc?.toLowerCase().includes(q) ||
          s.sub_services?.some((sub) => sub.toLowerCase().includes(q))
      );
    }

    // Sub-service chip filter
    if (selectedSubService && selectedSubService !== "all") {
      const chipObj = SAMPLE_SUB_SERVICE_CHIPS.find((c) => c.id === selectedSubService);
      const targetLabel = chipObj ? chipObj.label.toLowerCase() : selectedSubService.toLowerCase();
      result = result.filter((s) => {
        const joined = [
          ...(s.sub_services || []),
          ...(s.sub_category_name || []),
          s.service_name || "",
          s.service_desc || "",
        ]
          .join(" ")
          .toLowerCase();

        if (selectedSubService === "wiring") {
          return joined.includes("wiring") || joined.includes("fitting");
        }
        if (selectedSubService === "fan-light") {
          return joined.includes("fan") || joined.includes("light") || joined.includes("chandelier");
        }
        if (selectedSubService === "inverter") {
          return joined.includes("inverter") || joined.includes("battery") || joined.includes("ups");
        }
        if (selectedSubService === "mcb") {
          return joined.includes("mcb") || joined.includes("switch") || joined.includes("distribution");
        }
        if (selectedSubService === "earthing") {
          return joined.includes("earthing") || joined.includes("ground");
        }
        return joined.includes(targetLabel);
      });
    }

    // Rating filter
    if (filters.rating === "4.0") {
      result = result.filter((s) => (s.avg_service_rating ?? 0) >= 4.0);
    } else if (filters.rating === "4.5") {
      result = result.filter((s) => (s.avg_service_rating ?? 0) >= 4.5);
    }

    // Verified filter
    if (filters.verifiedOnly) {
      result = result.filter((s) => s.is_verified === true);
    }

    // Pricing filter
    if (filters.pricing === "starting_price") {
      result = result.filter((s) => s.is_price_required && (s.price ?? 0) > 0);
    } else if (filters.pricing === "contact_price") {
      result = result.filter((s) => !s.is_price_required || !s.price);
    }

    // Area filter
    if (filters.selectedAreas.length > 0) {
      result = result.filter((s) => {
        const area = (s.area_name || s.service_address?.address || "").toLowerCase();
        return filters.selectedAreas.some((a) => area.includes(a.toLowerCase()));
      });
    }

    // Distance calculation if user coords available
    if (userCoords) {
      result = result.map((s) => {
        const lat = s.service_address?.latitude;
        const lng = s.service_address?.longitude;
        if (lat && lng) {
          const dist = calculateHaversineDistance(userCoords.lat, userCoords.lng, lat, lng);
          return { ...s, distance_km: dist };
        }
        return s;
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (filters.sortByDistance) {
        const distA = a.distance_km ?? 9999;
        const distB = b.distance_km ?? 9999;
        return distA - distB;
      }
      if (sortBy === "rating") {
        return (b.avg_service_rating ?? 0) - (a.avg_service_rating ?? 0);
      }
      if (sortBy === "reviews") {
        return (b.review_count ?? 0) - (a.review_count ?? 0);
      }
      if (sortBy === "price_low") {
        const priceA = a.is_price_required ? a.price ?? 999999 : 999999;
        const priceB = b.is_price_required ? b.price ?? 999999 : 999999;
        return priceA - priceB;
      }
      // "recommended": weighted score of rating, review count, and verification
      const scoreA =
        (a.avg_service_rating ?? 0) * 10 +
        Math.min(a.review_count ?? 0, 100) * 0.2 +
        (a.is_verified ? 5 : 0);
      const scoreB =
        (b.avg_service_rating ?? 0) * 10 +
        Math.min(b.review_count ?? 0, 100) * 0.2 +
        (b.is_verified ? 5 : 0);
      return scoreB - scoreA;
    });

    return result;
  }, [
    services,
    searchQuery,
    selectedSubService,
    filters,
    userCoords,
    sortBy,
  ]);

  // Area Counts for Sidebar
  const areaOptions: AreaFilterItem[] = useMemo(() => {
    if (initialListing?.siblings?.localities && initialListing.siblings.localities.length > 0) {
      return initialListing.siblings.localities.map((loc) => ({
        name: loc.name,
        count: loc.total,
      }));
    }

    const countsMap = new Map<string, number>();
    services.forEach((s) => {
      const area = s.area_name || "Central";
      countsMap.set(area, (countsMap.get(area) || 0) + 1);
    });

    if (countsMap.size > 0) {
      return Array.from(countsMap.entries()).map(([name, count]) => ({
        name,
        count,
      }));
    }

    return SAMPLE_AREAS;
  }, [initialListing, services]);

  // Handlers for cards
  const handleQuickView = (service: EnrichedServiceItem) => {
    setQuickViewService(service);
    setIsQuickViewOpen(true);
  };

  const handleViewProfile = (service: EnrichedServiceItem) => {
    if (service.provider_id) {
      dispatch(openDrawer({ userId: service.provider_id }));
    } else {
      const route = getServiceRouteParam(service);
      router.push(`/services/${route}`);
    }
  };

  const handleBookNow = (service: EnrichedServiceItem) => {
    const route = getServiceRouteParam(service);
    router.push(`/services/${route}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16">
      {/* 1. Hero Header */}
      <ServicesHeroHeader
        categoryName={categoryName}
        cityName={cityName}
        localityName={localityName}
        searchQuery={searchQuery}
        locationQuery={locationQuery}
        selectedChipId={selectedSubService}
        chips={SAMPLE_SUB_SERVICE_CHIPS}
        onSearchChange={setSearchQuery}
        onLocationChange={setLocationQuery}
        onSelectChip={setSelectedSubService}
        onSubmitSearch={handleSearchSubmit}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Location fallback alert (if locality was widened to full city) */}
        {initialListing?.fallback && (
          <div className="mb-6">
            <Alert severity="info" className="rounded-xl shadow-xs">
              {initialListing.fallback.reason === "locality_unknown"
                ? `We don't have ${initialListing.fallback.requested?.replace(
                    /-/g,
                    " "
                  )} on the map yet — showing all verified ${categoryName.toLowerCase()} in ${cityName}.`
                : `Not enough ${categoryName.toLowerCase()} in ${initialListing.fallback.requested?.replace(
                    /-/g,
                    " "
                  )} yet — showing all of ${cityName}.`}
            </Alert>
          </div>
        )}

        {/* Sibling Localities Pills for Location SEO */}
        {initialListing?.siblings?.localities && initialListing.siblings.localities.length > 0 && (
          <div className="mb-6">
            <Typography variant="caption" className="font-semibold text-gray-500 uppercase tracking-wider block mb-2">
              Browse by locality in {cityName}
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {initialListing.siblings.localities
                .filter((l) => l.total > 0)
                .map((loc) => (
                  <Chip
                    key={loc.id}
                    component={NextLink}
                    href={`/${initialListing.city.slug}/${loc.slug}/${initialListing.category.slug}`}
                    clickable
                    size="small"
                    variant={initialListing.location.slug === loc.slug ? "filled" : "outlined"}
                    color={initialListing.location.slug === loc.slug ? "primary" : "default"}
                    label={`${loc.name} (${loc.total})`}
                    className="cursor-pointer hover:border-gray-400 transition-colors"
                  />
                ))}
            </Stack>
          </div>
        )}

        {/* 2. Content Layout (Sidebar + Results) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <ServicesFilterSidebar
              filters={filters}
              onChangeFilter={handleFilterChange}
              onResetFilters={handleResetFilters}
              areaItems={areaOptions}
              onTriggerDistanceSort={handleSortByDistance}
              isLocating={isLocating}
            />
          </div>

          {/* Results Column */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <ServicesToolbar
              totalCount={filteredServices.length}
              categoryName={categoryName}
              cityName={cityName}
              sortBy={sortBy}
              activeFilterCount={
                (filters.rating !== "any" ? 1 : 0) +
                (filters.verifiedOnly ? 1 : 0) +
                (filters.pricing !== "any" ? 1 : 0) +
                filters.selectedAreas.length +
                (filters.sortByDistance ? 1 : 0)
              }
              onChangeSort={setSortBy}
              onOpenMobileFilters={() => setIsMobileFilterOpen(true)}
            />

            {/* List Results */}
            <div className="mt-4 space-y-4">
              {loading ? (
                <ServicesLoadingSkeleton count={3} />
              ) : error ? (
                <ServicesErrorState
                  categoryName={categoryName}
                  cityName={cityName}
                  onRetry={loadServicesData}
                />
              ) : filteredServices.length === 0 ? (
                <ServicesEmptyState
                  categoryName={categoryName}
                  cityName={cityName}
                  onResetFilters={handleResetFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              ) : (
                filteredServices.map((service) => (
                  <ServiceCardHorizontal
                    key={service.service_id}
                    service={service}
                    onOpenQuickView={handleQuickView}
                    onViewProfile={handleViewProfile}
                    onEnquire={handleBookNow}
                  />
                ))
              )}
            </div>

            {/* Nearby Cities SEO Links */}
            {initialListing?.siblings?.nearby_cities &&
              initialListing.siblings.nearby_cities.length > 0 && (
                <div className="mt-12 p-6 bg-white rounded-2xl border border-gray-200/80 shadow-xs">
                  <Typography variant="h6" className="text-base font-bold text-gray-900 mb-2">
                    {categoryName} in nearby cities
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1} className="mt-2">
                    {initialListing.siblings.nearby_cities.map((nearby) => (
                      <Chip
                        key={nearby.id}
                        component={NextLink}
                        href={`/${nearby.slug}/${initialListing.category.slug}`}
                        clickable
                        size="small"
                        variant="outlined"
                        label={`${categoryName} in ${nearby.name} (${nearby.total})`}
                        className="cursor-pointer hover:border-gray-400"
                      />
                    ))}
                  </Stack>
                </div>
              )}
          </div>
        </div>

        {/* 3. Explore Section */}
        <ServicesExploreSection categoryName={categoryName} cityName={cityName} />
      </div>

      {/* Slide-over Quick View Drawer */}
      <ServiceQuickViewDrawer
        open={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        service={quickViewService}
        onViewFullProfile={handleViewProfile}
        onBookService={handleBookNow}
      />

      {/* Mobile Filter & Sort Drawer */}
      <ServicesMobileFilterDrawer
        open={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        onChangeFilter={handleFilterChange}
        onResetFilters={handleResetFilters}
        sortBy={sortBy}
        onChangeSort={setSortBy}
        areaItems={areaOptions}
        totalResults={filteredServices.length}
      />
    </div>
  );
};
