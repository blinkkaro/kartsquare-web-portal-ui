"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { useCategories } from "@/hooks/useCategories";
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
import { listAreaCounts, resolveText, toSlug, type AreaCount } from "@/services/location/locationClient";
import { useAILocation, placeLabel } from "@/components/common/Ai/useAILocation";
import { COLORS } from "@/constants/colors";
import { DEFAULT_LOCATION } from "@/constants/aiSearch";
import {
  mapRealServiceToEnriched,
  EnrichedServiceItem,
} from "./servicesSampleData";
import ServicesHeroHeader, { SubServiceChip } from "./sections/ServicesHeroHeader";
import ServicesFilterSidebar, {
  ServicesFilterState,
  AreaFilterItem,
} from "./sections/ServicesFilterSidebar";
import ServicesToolbar, { SortOptionType } from "./sections/ServicesToolbar";
import ServiceCardHorizontal from "./sections/ServiceCardHorizontal";
import ServiceQuickViewDrawer from "./sections/ServiceQuickViewDrawer";
import ServicesMobileFilterDrawer from "./sections/ServicesMobileFilterDrawer";
import {
  ServicesLoadingSkeleton,
  ServicesEmptyState,
  ServicesErrorState,
  ServicesLocationPrompt,
} from "./sections/ServicesStates";
import { ServicesExploreSection } from "./sections/ServicesExploreSection";

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

function hasRealCoords(lat: unknown, lng: unknown): boolean {
  const la = Number(lat);
  const ln = Number(lng);
  // 0,0 was the column default for addresses: it means "not set".
  return Number.isFinite(la) && Number.isFinite(ln) && !(la === 0 && ln === 0);
}

const titleCase = (value: string) =>
  value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase());

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

  // The user's location — exact GPS, or a place they picked. No default city.
  const {
    location: userLocation,
    setLocation,
    locateMe,
    locating,
    locateError,
    isDefaultLocation,
  } = useAILocation();
  // The default city is a whole-city view: every business located in it, not
  // only those whose radius reaches the city centre.
  const withinKm = isDefaultLocation ? DEFAULT_LOCATION.cityRadiusKm : undefined;

  // Toast / feedback message
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  const { data: allCategories } = useCategories();
  const categoryName = useMemo(() => {
    if (initialListing?.category.name) return initialListing.category.name;
    if (initialCategory) {
      // ?category= carries an id (UUID) from category cards; resolve it to the real name.
      const match = allCategories?.find(
        (c) => c.id === initialCategory || (c as { slug?: string }).slug === initialCategory,
      );
      if (match) return match.name;
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(initialCategory) || /^[0-9a-f]{24}$/i.test(initialCategory)) return "";
      return initialCategory.charAt(0).toUpperCase() + initialCategory.slice(1).replace(/-/g, " ");
    }
    return "";
  }, [initialListing, initialCategory, allCategories]);

  // On a city/area page the place comes from the URL; elsewhere from the user.
  const cityName = initialListing?.city.name ?? userLocation.city ?? "";
  const localityName =
    initialListing
      ? initialListing.location.kind === "locality"
        ? initialListing.location.name
        : ""
      : userLocation.locality ?? "";
  const searchPoint = initialListing ? null : userLocation.coords;
  const placeText = initialListing
    ? localityName
      ? `${localityName}, ${cityName}`
      : cityName
    : placeLabel(userLocation, "");

  // States
  const PAGE_SIZE = 50;
  const [services, setServices] = useState<EnrichedServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  /** The backend's total for the current place + filters (may exceed what is loaded). */
  const [serverTotal, setServerTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  // Search & chips
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch || "");
  const [locationQuery, setLocationQuery] = useState<string>(placeText);
  const [selectedSubService, setSelectedSubService] = useState<string>("all");

  // Keep the location input in sync when the location changes
  useEffect(() => {
    setLocationQuery(placeText);
  }, [placeText]);

  const [filters, setFilters] = useState<ServicesFilterState>({
    rating: "any",
    verifiedOnly: false,
    pricing: "any",
    selectedAreas: localityName ? [localityName] : [],
    sortByDistance: false,
  });

  const [sortBy, setSortBy] = useState<SortOptionType>("recommended");
  const [resolvingPlace, setResolvingPlace] = useState<boolean>(false);
  const isLocating = locating || resolvingPlace;

  // A link like ?city=<city>&area=<area> names a place: search around it.
  const urlPlaceApplied = useRef(false);
  useEffect(() => {
    if (initialListing || urlPlaceApplied.current) return;
    const text = [initialArea, initialCity].filter(Boolean).map((v) => titleCase(String(v))).join(", ");
    if (!text) return;
    urlPlaceApplied.current = true;
    setResolvingPlace(true);
    resolveText(text)
      .then((place) => {
        const point = place?.location;
        if (point && point.latitude != null && point.longitude != null) {
          setLocation({
            city: place.city?.name ?? (point.kind === "city" ? point.name : null),
            locality: point.kind === "locality" ? point.name : null,
            coords: { latitude: point.latitude, longitude: point.longitude },
            source: "picked",
          });
        }
      })
      .finally(() => setResolvingPlace(false));
  }, [initialListing, initialArea, initialCity, setLocation]);

  // Areas of the current city with live counts. The backend counts with the
  // same query and filters as the list, measured at each area's centre — and
  // tapping an area searches at exactly that centre — so a chip's number is
  // always the number of results it opens.
  const citySlug = initialListing?.city.slug ?? (userLocation.city ? toSlug(userLocation.city) : "");
  const [areaCounts, setAreaCounts] = useState<AreaCount[]>([]);
  const [countSearch, setCountSearch] = useState<string>(searchQuery);
  useEffect(() => {
    // Debounced so typing in the search box doesn't refetch on every key.
    const id = window.setTimeout(() => setCountSearch(searchQuery), 350);
    return () => window.clearTimeout(id);
  }, [searchQuery]);
  useEffect(() => {
    let cancelled = false;
    if (!citySlug || initialListing) {
      setAreaCounts([]);
      return;
    }
    listAreaCounts(citySlug, {
      category_id: initialCategory ?? undefined,
      search: countSearch,
    }).then((rows) => {
      if (!cancelled) setAreaCounts(rows);
    });
    return () => {
      cancelled = true;
    };
  }, [citySlug, initialListing, initialCategory, countSearch]);

  // Drawer states
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [quickViewService, setQuickViewService] = useState<EnrichedServiceItem | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState<boolean>(false);

  const needsLocation = !initialListing && !searchPoint;
  // Only the newest request may write results (an older one can finish last).
  const requestSeq = useRef(0);

  // Load Data
  const loadServicesData = useCallback(async () => {
    // City/area pages arrive with their rows from the server.
    if (initialListing) {
      setServices((initialListing.services ?? []).map(mapRealServiceToEnriched));
      setServerTotal(initialListing.pagination?.total ?? initialListing.services?.length ?? 0);
      setError(false);
      setLoading(false);
      return;
    }

    // No point to search around yet: the page asks for a location instead.
    if (!searchPoint) {
      requestSeq.current++;
      setServices([]);
      setServerTotal(0);
      setError(false);
      setLoading(false);
      return;
    }

    const seq = ++requestSeq.current;
    try {
      setLoading(true);
      setError(false);

      // Providers whose own service radius reaches the user, nearest first.
      const response = await serviceListService.getServices({
        limit: PAGE_SIZE,
        page: 1,
        latitude: searchPoint.latitude,
        longitude: searchPoint.longitude,
        ...(withinKm && { within_km: withinKm }),
        ...(searchQuery && { search: searchQuery }),
        ...(initialCategory && { category_id: initialCategory }),
      });

      const rawServices =
        response?.services ||
        (response as unknown as { data?: { services?: [] } })?.data?.services ||
        [];

      if (seq !== requestSeq.current) return;
      setServices(rawServices.map(mapRealServiceToEnriched));
      setServerTotal(response?.pagination?.total ?? rawServices.length);
      setPage(1);
    } catch (err) {
      if (seq !== requestSeq.current) return;
      console.error("Failed to load services:", err);
      setError(true);
      setServices([]);
      setServerTotal(0);
    } finally {
      if (seq === requestSeq.current) setLoading(false);
    }
  }, [initialListing, searchPoint, searchQuery, initialCategory, withinKm]);

  useEffect(() => {
    loadServicesData();
  }, [loadServicesData]);

  /** Next page of the same place + filters, appended (results stay nearest-first). */
  const loadMore = async () => {
    if (!searchPoint || loadingMore) return;
    const seq = requestSeq.current;
    setLoadingMore(true);
    try {
      const response = await serviceListService.getServices({
        limit: PAGE_SIZE,
        page: page + 1,
        latitude: searchPoint.latitude,
        longitude: searchPoint.longitude,
        ...(withinKm && { within_km: withinKm }),
        ...(searchQuery && { search: searchQuery }),
        ...(initialCategory && { category_id: initialCategory }),
      });
      if (seq !== requestSeq.current) return;
      const more = (response?.services ?? []).map(mapRealServiceToEnriched);
      setServices((prev) => {
        const seen = new Set(prev.map((s) => s.service_id));
        return [...prev, ...more.filter((s) => !seen.has(s.service_id))];
      });
      setPage((p) => p + 1);
    } catch (err) {
      console.error("Failed to load more services:", err);
      showToast("Couldn't load more providers. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastOpen(true);
  };

  // A typed area / city / pincode becomes the point we search around.
  const applyPlace = useCallback(
    async (text: string) => {
      const q = text.trim();
      if (!q) return false;
      setResolvingPlace(true);
      try {
        const place = await resolveText(q);
        const point = place?.location;
        if (!point || point.latitude == null || point.longitude == null) {
          showToast(`We couldn't find "${q}". Try a nearby area, city or pincode.`);
          return false;
        }
        setLocation({
          city: place.city?.name ?? (point.kind === "city" ? point.name : null),
          locality: point.kind === "locality" ? point.name : null,
          coords: { latitude: point.latitude, longitude: point.longitude },
          source: "picked",
        });
        return true;
      } finally {
        setResolvingPlace(false);
      }
    },
    [setLocation]
  );

  const goToMyLocation = () => {
    locateMe(() => {
      setFilters((prev) => ({ ...prev, selectedAreas: [] }));
      showToast("Showing services near your current location.");
    });
  };

  useEffect(() => {
    if (locateError) showToast(locateError);
  }, [locateError]);

  // Handle Geolocation Distance Sort
  const handleSortByDistance = () => {
    if (searchPoint) {
      const next = !filters.sortByDistance;
      setFilters((prev) => ({ ...prev, sortByDistance: next }));
      showToast(next ? "Sorted by distance." : "Restored recommended order.");
      return;
    }
    locateMe(() => setFilters((prev) => ({ ...prev, sortByDistance: true })));
  };

  // Handle Location Search Input Submission
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = locationQuery.trim();
    if (!query || query === placeText) {
      loadServicesData();
      return;
    }
    if (initialListing) {
      // Leave the city/area page for results around the place typed.
      if (await applyPlace(query)) router.push("/cus/services-list");
      return;
    }
    await applyPlace(query);
  };

  const handleFilterChange = (key: keyof ServicesFilterState, value: unknown) => {
    if (key === "selectedAreas") {
      // Picking an area searches at that area's own centre (the point its
      // count was measured at); clearing it goes back to "near me".
      const next = (value as string[]).filter((a) => !filters.selectedAreas.includes(a));
      const picked = next[next.length - 1];
      const area = picked ? areaCounts.find((a) => a.name === picked) : undefined;
      if (area) {
        setFilters((prev) => ({ ...prev, selectedAreas: [area.name] }));
        setLocation({
          city: cityName || null,
          locality: area.name,
          coords: { latitude: area.latitude, longitude: area.longitude },
          source: "picked",
        });
      } else if (picked) {
        setFilters((prev) => ({ ...prev, selectedAreas: [picked] }));
        void applyPlace(cityName ? `${picked}, ${cityName}` : picked);
      } else {
        setFilters((prev) => ({ ...prev, selectedAreas: [] }));
        goToMyLocation();
      }
      return;
    }
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      rating: "any",
      verifiedOnly: false,
      pricing: "any",
      selectedAreas: filters.selectedAreas,
      sortByDistance: false,
    });
    setSelectedSubService("all");
    setSearchQuery("");
  };

  const hasActiveFilters =
    filters.rating !== "any" ||
    filters.verifiedOnly ||
    filters.pricing !== "any" ||
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

    // Text search: the backend already filtered by it. Re-filtering here with
    // different rules would hide rows the counts include, so only the
    // server-rendered city/area pages (fetched without the search) filter here.
    if (initialListing && searchQuery.trim()) {
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

    // Rating filter (only rated services: a rating needs reviews behind it)
    if (filters.rating === "4.0") {
      result = result.filter((s) => (s.review_count ?? 0) > 0 && (s.avg_service_rating ?? 0) >= 4.0);
    } else if (filters.rating === "4.5") {
      result = result.filter((s) => (s.review_count ?? 0) > 0 && (s.avg_service_rating ?? 0) >= 4.5);
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

    // Distance from the point we searched around (real coordinates only)
    const origin =
      searchPoint ??
      (initialListing?.location.latitude != null && initialListing?.location.longitude != null
        ? { latitude: initialListing.location.latitude, longitude: initialListing.location.longitude }
        : null);
    if (origin) {
      result = result.map((s) => {
        const sLat = s.service_address?.latitude;
        const sLng = s.service_address?.longitude;
        if (!hasRealCoords(sLat, sLng)) return { ...s, distance_km: null };
        return {
          ...s,
          distance_km: calculateHaversineDistance(origin.latitude, origin.longitude, Number(sLat), Number(sLng)),
        };
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (filters.sortByDistance) {
        const distA = a.distance_km ?? Number.POSITIVE_INFINITY;
        const distB = b.distance_km ?? Number.POSITIVE_INFINITY;
        return distA - distB;
      }
      if (sortBy === "rating") {
        const ra = (a.review_count ?? 0) > 0 ? a.avg_service_rating ?? 0 : 0;
        const rb = (b.review_count ?? 0) > 0 ? b.avg_service_rating ?? 0 : 0;
        return rb - ra;
      }
      if (sortBy === "reviews") {
        return (b.review_count ?? 0) - (a.review_count ?? 0);
      }
      if (sortBy === "price_low") {
        const priceA = a.is_price_required ? a.price ?? Number.POSITIVE_INFINITY : Number.POSITIVE_INFINITY;
        const priceB = b.is_price_required ? b.price ?? Number.POSITIVE_INFINITY : Number.POSITIVE_INFINITY;
        return priceA - priceB;
      }
      // "recommended": keep the backend's order (nearest first around the user).
      return 0;
    });

    return result;
  }, [
    services,
    searchQuery,
    selectedSubService,
    dynamicChips,
    filters,
    searchPoint,
    initialListing,
    sortBy,
  ]);

  // Filters applied in the browser only (the backend doesn't know them), so
  // area counts can't include them: while any is on, areas show no number.
  const clientOnlyFilters =
    filters.rating !== "any" ||
    filters.verifiedOnly ||
    filters.pricing !== "any" ||
    selectedSubService !== "all";

  // Areas that have at least one service for the current filters, busiest
  // first. An area with 0 would only open an empty page, so it isn't offered.
  const areaOptions: AreaFilterItem[] = useMemo(
    () =>
      areaCounts
        .filter((a) => a.total > 0)
        .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name))
        .map((a) => ({ name: a.name, count: clientOnlyFilters ? undefined : a.total })),
    [areaCounts, clientOnlyFilters]
  );

  // What the toolbar says: the backend's total unless browser-only filters narrow it.
  const shownTotal = initialListing || clientOnlyFilters ? filteredServices.length : serverTotal;
  const canLoadMore = !initialListing && !!searchPoint && services.length < serverTotal;

  // Handlers for cards
  const handleQuickView = (service: EnrichedServiceItem) => {
    setQuickViewService(service);
    setIsQuickViewOpen(true);
  };

  /** A click on the service (photo, name, "View details") opens its details page. */
  const handleViewService = (service: EnrichedServiceItem) => {
    router.push(`/services/${getServiceRouteParam(service)}`);
  };

  /** A click on the provider's picture opens the provider's profile. */
  const handleViewProvider = (service: EnrichedServiceItem) => {
    if (service.provider_id) {
      dispatch(openDrawer({ userId: service.provider_id }));
    }
  };

  return (
    <Box
      sx={{
        bgcolor: dark ? "background.default" : COLORS.NEW_UI.PAGE_BG_LIGHT,
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

        {/* Default city notice: shown while the user's own location is unknown */}
        {!initialListing && isDefaultLocation && (
          <Alert
            severity="info"
            icon={false}
            sx={{
              mb: 2.5,
              borderRadius: "14px",
              alignItems: "center",
              bgcolor: dark ? COLORS.NEW_UI.CHIP_BG_DARK : COLORS.PURPLE_ALPHA_04,
              color: "text.primary",
              border: "1px solid",
              borderColor: dark ? COLORS.NEW_UI.CARD_BORDER_DARK : COLORS.NEW_UI.CARD_BORDER_LIGHT,
              "& .MuiAlert-message": { width: "100%" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5, flexWrap: "wrap" }}>
              <Typography sx={{ fontSize: "0.88rem", color: "text.primary" }}>
                Showing services in <strong>{DEFAULT_LOCATION.city}, {DEFAULT_LOCATION.state}</strong>. Turn on location to see providers near you.
              </Typography>
              <Button
                size="small"
                onClick={goToMyLocation}
                disabled={isLocating}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  color: dark ? COLORS.NEW_UI.ACCENT_TEXT_DARK : COLORS.PRIMARY_PURPLE,
                  px: 1,
                }}
              >
                {isLocating ? "Finding you…" : "Use my location"}
              </Button>
            </Box>
          </Alert>
        )}

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
        {/* Areas of the user's city (from the backend): tapping one searches there */}
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
                Areas in {cityName}
              </Typography>
              {filters.selectedAreas.length > 0 && (
                <Button
                  onClick={() => handleFilterChange("selectedAreas", [])}
                  size="small"
                  sx={{
                    p: 0,
                    minWidth: "auto",
                    textTransform: "none",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: COLORS.PRIMARY_PURPLE,
                  }}
                >
                  Back to near me
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
                    disabled={isLocating}
                    onClick={() =>
                      handleFilterChange("selectedAreas", isSelected ? [] : [...filters.selectedAreas, area.name])
                    }
                    size="small"
                    variant={isSelected ? "filled" : "outlined"}
                    color={isSelected ? "primary" : "default"}
                    label={`${area.name}${(area.count ?? 0) > 0 ? ` (${area.count})` : ""}`}
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
              totalCount={shownTotal}
              categoryName={categoryName}
              cityName={placeText}
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
              {loading || (needsLocation && isLocating) ? (
                <ServicesLoadingSkeleton count={3} />
              ) : needsLocation ? (
                <ServicesLocationPrompt
                  categoryName={categoryName}
                  onUseMyLocation={goToMyLocation}
                  onSubmitPlace={(text) => void applyPlace(text)}
                  locating={isLocating}
                />
              ) : error ? (
                <ServicesErrorState
                  categoryName={categoryName}
                  cityName={placeText}
                  onRetry={loadServicesData}
                />
              ) : filteredServices.length === 0 ? (
                <ServicesEmptyState
                  categoryName={categoryName}
                  cityName={placeText}
                  onResetFilters={handleResetFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              ) : (
                filteredServices.map((service) => (
                  <ServiceCardHorizontal
                    key={service.service_id}
                    service={service}
                    onOpenQuickView={handleQuickView}
                    onViewService={handleViewService}
                    onViewProvider={handleViewProvider}
                  />
                ))
              )}
            </Box>

            {/* More results for the same place and filters */}
            {!loading && !error && canLoadMore && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={loadMore}
                  disabled={loadingMore}
                  sx={{
                    borderColor: dark ? COLORS.NEW_UI.OUTLINE_DARK : COLORS.NEW_UI.OUTLINE_LIGHT,
                    color: "text.primary",
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    borderRadius: "10px",
                    px: 3,
                    py: 1,
                    textTransform: "none",
                    "&:hover": { borderColor: COLORS.PRIMARY_PURPLE, color: COLORS.PRIMARY_PURPLE },
                  }}
                >
                  {loadingMore
                    ? "Loading…"
                    : `Show more (${services.length} of ${serverTotal})`}
                </Button>
              </Box>
            )}

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
        <ServicesExploreSection categoryName={categoryName} cityName={placeText} />
      </Container>

      {/* Slide-over Quick View Drawer */}
      <ServiceQuickViewDrawer
        open={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        service={quickViewService}
        onViewService={handleViewService}
        onViewProvider={handleViewProvider}
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
        totalResults={shownTotal}
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
