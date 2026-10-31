"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Alert,
  Chip,
  Stack,
  Typography,
  Snackbar,
  Button,
  useTheme,
} from "@mui/material";
import { openDrawer } from "@/features/ui/profileDrawerSlice";
import { getServiceRouteParam } from "@/utils/serviceRoute";
import { serviceListService } from "@/services/serviceList/serviceListService";
import type { LocationListing as Listing } from "@/services/location/locationService";
import { useAILocation } from "@/components/common/Ai/useAILocation";
import { AI_DEFAULT_CITY } from "@/constants/aiSearch";
import { COLORS } from "@/constants/colors";
import {
  mapRealServiceToEnriched,
  EnrichedServiceItem,
} from "./servicesSampleData";
import ServicesHeroHeader, { SubServiceChip } from "./sections/ServicesHeroHeader";
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
import { POPULAR_JAIPUR_AREAS, resolveMainArea } from "@/utils/mainAreaResolver";

interface ServicesViewProps {
  initialListing?: Listing;
  initialCategory?: string | null;
  initialSearch?: string;
  initialCity?: string;
  initialArea?: string;
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
  initialArea,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  // Location hook
  const { location: aiLoc, setLocation: setAILocation } = useAILocation();

  // Resolved dynamic location
  const [resolvedCity, setResolvedCity] = useState<string>("");
  const [resolvedLocality, setResolvedLocality] = useState<string>(initialArea || "");

  // Toast / feedback message
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  // Determine Category & City dynamically (no hardcoded fallback)
  const categoryName = useMemo(() => {
    if (initialListing?.category.name) return initialListing.category.name;
    if (initialCategory) {
      return initialCategory.charAt(0).toUpperCase() + initialCategory.slice(1);
    }
    return "";
  }, [initialListing, initialCategory]);

  const cityName = useMemo(() => {
    if (resolvedCity) return resolvedCity;
    if (initialListing?.city.name) return initialListing.city.name;
    if (initialCity) {
      return initialCity.charAt(0).toUpperCase() + initialCity.slice(1);
    }
    if (aiLoc.city) return aiLoc.city;
    return AI_DEFAULT_CITY;
  }, [resolvedCity, initialListing, initialCity, aiLoc.city]);

  const localityName = useMemo(() => {
    if (resolvedLocality) return resolvedLocality;
    if (initialListing?.location.kind === "locality") {
      return initialListing.location.name;
    }
    if (aiLoc.locality) return aiLoc.locality;
    return "";
  }, [resolvedLocality, initialListing, aiLoc.locality]);

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

  // Keep location input in sync when resolved location changes
  useEffect(() => {
    setLocationQuery(localityName ? `${localityName}, ${cityName}` : cityName);
  }, [localityName, cityName]);

  // Filters State
  const initialResolvedArea = useMemo(() => {
    if (!initialArea) return undefined;
    const r = resolveMainArea({ address: initialArea, city: initialCity || AI_DEFAULT_CITY });
    return r.mainArea || initialArea;
  }, [initialArea, initialCity]);

  const [filters, setFilters] = useState<ServicesFilterState>({
    rating: "any",
    verifiedOnly: false,
    pricing: "any",
    selectedAreas: initialResolvedArea ? [initialResolvedArea] : [],
    sortByDistance: false,
  });

  const [sortBy, setSortBy] = useState<SortOptionType>("recommended");

  // User location coordinates (set when user grants location or sets area)
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Dynamic server localities for active city
  const [serverLocalities, setServerLocalities] = useState<Array<{ name: string; total?: number }>>([]);

  // Fetch localities dynamically for active city
  useEffect(() => {
    const slug = cityName.toLowerCase().replace(/\s+/g, "-");
    fetch(`/api/v1/locations/${encodeURIComponent(slug)}/localities`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data?.localities && Array.isArray(json.data.localities) && json.data.localities.length > 0) {
          setServerLocalities(json.data.localities);
        } else {
          setServerLocalities([]);
        }
      })
      .catch(() => setServerLocalities([]));
  }, [cityName]);

  // Silent background geolocation check if permission already granted (non-intrusive)
  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) return;
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((res) => {
          if (res.state === "granted") {
            navigator.geolocation.getCurrentPosition(
              async (pos) => {
                const { latitude, longitude } = pos.coords;
                setUserCoords({ lat: latitude, lng: longitude });
                try {
                  const resp = await fetch(`/api/v1/locations/resolve?lat=${latitude}&lng=${longitude}`);
                  if (resp.ok) {
                    const json = await resp.json();
                    if (json.data?.city?.name) {
                      setResolvedCity(json.data.city.name);
                      const loc = json.data.location?.kind === "locality" ? json.data.location.name : "";
                      setResolvedLocality(loc);
                      setAILocation({
                        city: json.data.city.name,
                        locality: loc || null,
                        coords: { latitude, longitude },
                      });
                    }
                  }
                } catch {
                  // silent fallback
                }
              },
              () => {},
              { timeout: 6000, maximumAge: 300000 }
            );
          }
        })
        .catch(() => {});
    }
  }, [setAILocation]);

  // Drawer states
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [quickViewService, setQuickViewService] = useState<EnrichedServiceItem | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState<boolean>(false);

  // Load Data
  const loadServicesData = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      // If initialListing provided with services (e.g. from SSR / location route), map them
      if (initialListing?.services && initialListing.services.length > 0) {
        const enriched: EnrichedServiceItem[] = initialListing.services.map(mapRealServiceToEnriched);
        setServices(enriched);
        return;
      }

      // Fetch live real providers from backend API
      const response = await serviceListService.getServices({
        limit: 50,
        page: 1,
        ...(searchQuery && { search: searchQuery }),
        ...(initialCategory && { category_id: initialCategory }),
      });

      const rawServices =
        response?.services ||
        (response as any)?.data?.services ||
        [];

      if (rawServices && rawServices.length > 0) {
        const mapped: EnrichedServiceItem[] = rawServices.map(mapRealServiceToEnriched);
        setServices(mapped);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error("Failed to load real services from backend API:", err);
      setError(true);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [initialListing, searchQuery, initialCategory]);

  useEffect(() => {
    loadServicesData();
  }, [loadServicesData]);

  // Handle Geolocation Distance Sort
  const handleSortByDistance = () => {
    if (userCoords) {
      const next = !filters.sortByDistance;
      setFilters((prev) => ({ ...prev, sortByDistance: next }));
      setToastMessage(next ? "Sorted by distance from your location." : "Restored recommended order.");
      setToastOpen(true);
      return;
    }

    if (typeof window === "undefined" || !navigator.geolocation) {
      setToastMessage("Location is not supported by your browser. You can type your area in the search bar above.");
      setToastOpen(true);
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        setFilters((prev) => ({ ...prev, sortByDistance: true }));
        setIsLocating(false);
        try {
          const resp = await fetch(`/api/v1/locations/resolve?lat=${latitude}&lng=${longitude}`);
          if (resp.ok) {
            const json = await resp.json();
            if (json.data?.city?.name) {
              setResolvedCity(json.data.city.name);
              const loc = json.data.location?.kind === "locality" ? json.data.location.name : "";
              setResolvedLocality(loc);
              setAILocation({
                city: json.data.city.name,
                locality: loc || null,
                coords: { latitude, longitude },
              });
            }
          }
        } catch {
          // ignore
        }
        setToastMessage("Sorted by distance from your current location.");
        setToastOpen(true);
      },
      (err) => {
        console.warn("Geolocation denied or unavailable:", err.message);
        setIsLocating(false);
        const displayLabel = categoryName ? categoryName.toLowerCase() : "services";
        setToastMessage(
          `Location access is turned off. We've shown ${displayLabel} in ${cityName}. You can also type your area in the search bar above.`
        );
        setToastOpen(true);
      },
      { timeout: 8000 }
    );
  };

  // Handle Location Search Input Submission
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = locationQuery.trim();
    if (!query) return;

    // Check if query matches a canonical Jaipur main area directly (Justdial style)
    const resolved = resolveMainArea({ address: query, city: cityName });
    if (resolved.mainArea && resolved.mainArea.toLowerCase() !== cityName.toLowerCase()) {
      setFilters((prev) => ({
        ...prev,
        selectedAreas: [resolved.mainArea],
      }));
      setResolvedLocality(resolved.mainArea);
      const displayLabel = categoryName ? categoryName.toLowerCase() : "services";
      setToastMessage(`Showing ${displayLabel} in ${resolved.mainArea}, ${cityName}`);
      setToastOpen(true);
      return;
    }

    setIsLocating(true);
    try {
      const resp = await fetch(`/api/v1/locations/resolve?q=${encodeURIComponent(query)}`);
      if (resp.ok) {
        const json = await resp.json();
        const data = json.data;
        if (data?.city?.name) {
          setResolvedCity(data.city.name);
          const loc = data.location?.kind === "locality" ? data.location.name : "";
          setResolvedLocality(loc);
          if (loc) {
            setFilters((prev) => ({
              ...prev,
              selectedAreas: [loc],
            }));
          }
          setAILocation({
            city: data.city.name,
            locality: loc || null,
            coords:
              data.location?.latitude && data.location?.longitude
                ? { latitude: data.location.latitude, longitude: data.location.longitude }
                : null,
          });
          if (data.location?.latitude && data.location?.longitude) {
            setUserCoords({ lat: data.location.latitude, lng: data.location.longitude });
          }
          const displayLabel = categoryName ? categoryName.toLowerCase() : "services";
          setToastMessage(
            `Showing ${displayLabel} in ${loc ? `${loc}, ${data.city.name}` : data.city.name}`
          );
          setToastOpen(true);
        }
      }
    } catch (err) {
      console.warn("Location query resolve failed:", err);
    } finally {
      setIsLocating(false);
    }
  };

  const handleFilterChange = (key: keyof ServicesFilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

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
  };

  const hasActiveFilters =
    filters.rating !== "any" ||
    filters.verifiedOnly ||
    filters.pricing !== "any" ||
    filters.selectedAreas.length > 0 ||
    filters.sortByDistance ||
    selectedSubService !== "all" ||
    Boolean(searchQuery);

  // Dynamically compute sub-service / specialty chips from real loaded providers
  const dynamicChips: SubServiceChip[] = useMemo(() => {
    const baseLabel = categoryName ? `All ${categoryName.toLowerCase()}` : "All services";
    const chips: SubServiceChip[] = [{ id: "all", label: baseLabel }];
    const seen = new Set<string>();

    services.forEach((s) => {
      const candidates = [
        ...(s.sub_services || []),
        ...(s.sub_category_name || []),
        ...(s.category_name || []),
      ];
      candidates.forEach((name) => {
        if (name && typeof name === "string") {
          const trimmed = name.trim();
          const slug = trimmed.toLowerCase();
          if (trimmed && !seen.has(slug) && slug !== "all" && slug !== baseLabel.toLowerCase()) {
            seen.add(slug);
            chips.push({
              id: slug.replace(/[^a-z0-9]+/g, "-"),
              label: trimmed,
            });
          }
        }
      });
    });

    return chips.slice(0, 12);
  }, [categoryName, services]);

  // Filter and Sort Services
  const filteredServices = useMemo(() => {
    let result = [...services];

    // Text search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
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
      const chip = dynamicChips.find((c) => c.id === selectedSubService);
      if (chip) {
        const chipLabel = chip.label.toLowerCase();
        result = result.filter(
          (s) =>
            s.sub_services?.some((sub) => sub.toLowerCase().includes(chipLabel)) ||
            s.sub_category_name?.some((sub) => sub.toLowerCase().includes(chipLabel)) ||
            s.category_name?.some((cat) => cat.toLowerCase().includes(chipLabel)) ||
            s.service_name?.toLowerCase().includes(chipLabel) ||
            s.service_desc?.toLowerCase().includes(chipLabel)
        );
      }
    }

    // Rating filter
    if (filters.rating === "4.0") {
      result = result.filter((s) => (s.avg_service_rating ?? 0) >= 4.0);
    } else if (filters.rating === "4.5") {
      result = result.filter((s) => (s.avg_service_rating ?? 0) >= 4.5);
    }

    // Verified only filter
    if (filters.verifiedOnly) {
      result = result.filter((s) => s.is_verified);
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
        const area = s.area_name || s.service_address?.city_town || "";
        return filters.selectedAreas.some(
          (a) => area.toLowerCase().includes(a.toLowerCase()) || a.toLowerCase().includes(area.toLowerCase())
        );
      });
    }

    // Calculate distance if coordinates available
    if (userCoords) {
      result = result.map((s) => {
        const sLat = s.service_address?.latitude ?? 26.9124;
        const sLng = s.service_address?.longitude ?? 75.7873;
        const dist = calculateHaversineDistance(
          userCoords.lat,
          userCoords.lng,
          sLat,
          sLng
        );
        return { ...s, distance_km: dist };
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
      // "recommended": preserve initial curated order from SAMPLE_SERVICES_ELECTRICIANS
      return 0;
    });

    return result;
  }, [
    services,
    searchQuery,
    selectedSubService,
    dynamicChips,
    filters,
    userCoords,
    sortBy,
  ]);

  // Area Counts for Sidebar & Drawer (Dynamic for Active City from Real Main Areas)
  const areaOptions: AreaFilterItem[] = useMemo(() => {
    // Count services grouped by their resolved main_area
    const countsMap = new Map<string, number>();
    services.forEach((s) => {
      const area = s.area_name || s.service_address?.city_town || "";
      if (area && area !== "Central" && area.toLowerCase() !== cityName.toLowerCase()) {
        countsMap.set(area, (countsMap.get(area) || 0) + 1);
      }
    });

    // Build complete list of recognized popular main areas (Justdial style)
    const combinedAreas = new Set<string>();

    // First add areas that currently have active providers (sorted by count desc)
    const activeAreas = Array.from(countsMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);
    activeAreas.forEach((name) => combinedAreas.add(name));

    // Then add other recognized major city areas
    POPULAR_JAIPUR_AREAS.forEach((name) => combinedAreas.add(name));

    return Array.from(combinedAreas).map((name) => ({
      name,
      count: countsMap.get(name) || 0,
    }));
  }, [cityName, services]);

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

  return (
    <Box
      sx={{
        bgcolor: dark ? "background.default" : "#FCFBF9",
        minHeight: "100vh",
        pb: 10,
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 2.5, md: 3, lg: 4 } }}>
        {/* 1. Hero Header */}
        <ServicesHeroHeader
          categoryName={categoryName}
          cityName={cityName}
          localityName={localityName}
          searchQuery={searchQuery}
          locationQuery={locationQuery}
          selectedChipId={selectedSubService}
          chips={dynamicChips}
          onSearchChange={setSearchQuery}
          onLocationChange={setLocationQuery}
          onSelectChip={setSelectedSubService}
          onSubmitSearch={handleSearchSubmit}
        />

        {/* Location fallback alert (if locality was widened to full city) */}
        {initialListing?.fallback && (
          <Box sx={{ mb: 3 }}>
            <Alert severity="info" sx={{ borderRadius: "14px" }}>
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
          </Box>
        )}

        {/* Sibling Localities Pills for Location SEO */}
        {initialListing?.siblings?.localities && initialListing.siblings.localities.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: "text.secondary",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                display: "block",
                mb: 1,
              }}
            >
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
                    sx={{
                      cursor: "pointer",
                      fontWeight: 600,
                      borderRadius: "8px",
                      transition: "all 0.18s ease",
                    }}
                  />
                ))}
            </Stack>
          </Box>
        )}
        {/* Popular Area Chips for Services screen (Justdial style) */}
        {!initialListing && areaOptions.length > 0 && (
          <Box sx={{ mb: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Popular Areas in {cityName}
              </Typography>
              {filters.selectedAreas.length > 0 && (
                <Button
                  size="small"
                  onClick={() => setFilters((prev) => ({ ...prev, selectedAreas: [] }))}
                  sx={{
                    p: 0,
                    minWidth: "auto",
                    textTransform: "none",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: COLORS.PRIMARY_PURPLE,
                  }}
                >
                  Clear area filter
                </Button>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                overflowX: "auto",
                pb: 0.5,
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
                WebkitOverflowScrolling: "touch",
              }}
            >
              {areaOptions.slice(0, 10).map((area) => {
                const isSelected = filters.selectedAreas.includes(area.name);
                return (
                  <Chip
                    key={area.name}
                    clickable
                    size="small"
                    variant={isSelected ? "filled" : "outlined"}
                    color={isSelected ? "primary" : "default"}
                    label={`${area.name}${(area.count ?? 0) > 0 ? ` (${area.count})` : ""}`}
                    onClick={() => {
                      setFilters((prev) => {
                        const exists = prev.selectedAreas.includes(area.name);
                        return {
                          ...prev,
                          selectedAreas: exists ? [] : [area.name],
                        };
                      });
                    }}
                    sx={{
                      cursor: "pointer",
                      fontWeight: 600,
                      borderRadius: "8px",
                      flexShrink: 0,
                      transition: "all 0.15s ease",
                      "&:active": { transform: "scale(0.95)" },
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        )}

        {/* 2. Content Layout (Sidebar + Results) */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "280px 1fr" },
            gap: { xs: 2.5, lg: 3.5 },
            alignItems: "flex-start",
            mt: 2,
          }}
        >
          {/* Desktop Filter Sidebar */}
          <Box sx={{ display: { xs: "none", lg: "block" } }}>
            <ServicesFilterSidebar
              filters={filters}
              onChangeFilter={handleFilterChange}
              onResetFilters={handleResetFilters}
              areaItems={areaOptions}
              onTriggerDistanceSort={handleSortByDistance}
              isLocating={isLocating}
            />
          </Box>

          {/* Results Column */}
          <Box sx={{ minWidth: 0, width: "100%" }}>
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
            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
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
            </Box>

            {/* Nearby Cities SEO Links */}
            {initialListing?.siblings?.nearby_cities &&
              initialListing.siblings.nearby_cities.length > 0 && (
                <Box
                  sx={{
                    mt: 6,
                    p: 3,
                    bgcolor: "background.paper",
                    borderRadius: "16px",
                    border: "1px solid",
                    borderColor: dark ? "rgba(255,255,255,0.08)" : "#ede9f2",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "0.98rem",
                      fontWeight: 800,
                      color: "text.primary",
                      mb: 1.5,
                    }}
                  >
                    {categoryName} in nearby cities
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {initialListing.siblings.nearby_cities.map((nearby) => (
                      <Chip
                        key={nearby.id}
                        component={NextLink}
                        href={`/${nearby.slug}/${initialListing.category.slug}`}
                        clickable
                        size="small"
                        variant="outlined"
                        label={`${categoryName} in ${nearby.name} (${nearby.total})`}
                        sx={{
                          cursor: "pointer",
                          fontWeight: 500,
                          borderRadius: "8px",
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
          </Box>
        </Box>

        {/* 3. Explore Section */}
        <ServicesExploreSection categoryName={categoryName} cityName={cityName} />
      </Container>

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

      {/* User-friendly Location & Action Notification Toast */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={4500}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity="info"
          sx={{
            bgcolor: dark ? "#262332" : "#ffffff",
            color: dark ? "#ffffff" : "#1c1924",
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            borderRadius: "12px",
            fontWeight: 600,
            fontSize: "0.86rem",
            border: "1px solid",
            borderColor: dark ? "rgba(255,255,255,0.1)" : "#e2deea",
            "& .MuiAlert-icon": { color: "#6927da" },
          }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
