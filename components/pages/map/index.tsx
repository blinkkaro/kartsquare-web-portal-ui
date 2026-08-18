"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Box,
  useTheme,
  IconButton,
  Avatar,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  useMediaQuery,
} from "@mui/material";
import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api";
import { ChevronLeft, ChevronRight, Close, HomeRepairService, ShoppingBag } from "@mui/icons-material";
import { Service } from "@/services/serviceList/listInteraface";
import { COLORS } from "@/constants/colors";
import ServiceProviderCard from "./components/ServiceProviderCard";
import StoreCard from "./components/StoreCard";
import MapPinMarker from "./components/MapPinMarker";
import { useAutoGeolocation } from "@/hooks/useGeolocation";
import { secureStorage } from "@/helper/SecureStorage";
import { useTranslate } from "@/hooks/useTranslate";
import { useMapDetails } from "@/hooks/useMapDetails";
import type { MapServiceItem, MapStoreItem, SelectedItem } from "@/services/map/mapInterface";
import ProfileDrawer from "@/components/common/ProfileDrawer";
import { AppUserType } from "@/services/auth/auth.interface";


const LIBRARIES: "places"[] = ["places"];
const SERVICE_COLOR = COLORS.PRIMARY_PURPLE;
const STORE_COLOR = COLORS.PRIMARY_BLUE;


const MapView: React.FC = () => {
  const theme = useTheme();
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);
  const [filter, setFilter] = useState<"all" | "services" | "stores">("all");
  const {
    coordinates,
    isLoading: isGeoLoading,
  } = useAutoGeolocation();
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [userProfile, setUserProfile] = useState<string | null>(null);
  const [mapZoom, setMapZoom] = useState(12);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // const router = useRouter();
  const { t } = useTranslate();
  const tab =useMediaQuery(theme.breakpoints.down("md"));

  
  const {
    data: mapData,
    isLoading: isMapLoading,
  } = useMapDetails({ limit: 30 });

  const visibleCount =
    filter === "services" ? (mapData?.services?.length ?? 0)
    : filter === "stores"  ? (mapData?.stores?.length ?? 0)
    : (mapData?.services?.length ?? 0) + (mapData?.stores?.length ?? 0);
  const isShowArrows = tab ? false : visibleCount > 3;

  const services = mapData?.services ?? [];
  const stores = mapData?.stores ?? [];

  useEffect(() => {
    const profileData = secureStorage.getItem("user_details");
    if (profileData?.profile_pic) setUserProfile(profileData.profile_pic);
  }, []);

  useEffect(() => {
    if (coordinates?.latitude && coordinates?.longitude && !mapCenter) {
      setMapCenter({ lat: coordinates.latitude, lng: coordinates.longitude });
    }
  }, [coordinates, mapCenter]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: LIBRARIES,
  });

  const mapContainerStyle = {
    width: "100%",
    height: "calc(100vh - 10rem)",
  };

  const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    gestureHandling: "greedy",
    zoom: mapZoom,
    styles: [
      { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
    ],
  };

  const handleServiceMarkerClick = useCallback((service: MapServiceItem) => {
    setSelectedItem({ type: "service", data: service });
    if (service?.service_address?.latitude != null && service?.service_address?.longitude != null) {
      setMapCenter({
        lat: service.service_address.latitude,
        lng: service.service_address.longitude,
      });
      setMapZoom(15);
    }
  }, []);

  const handleStoreMarkerClick = useCallback((store: MapStoreItem) => {
    setSelectedItem({ type: "store", data: store });
    const addr = store.store_details?.store_address;
    if (addr?.latitude != null && addr?.longitude != null) {
      setMapCenter({ lat: Number(addr.latitude), lng: Number(addr.longitude) });
      setMapZoom(15);
    }
  }, []);

  const handleServiceCardClick = useCallback((service: Service) => {
    setSelectedItem({ type: "service", data: service as unknown as MapServiceItem });
    if (service?.service_address?.latitude != null && service?.service_address?.longitude != null) {
      setMapCenter({
        lat: service.service_address.latitude,
        lng: service.service_address.longitude,
      });
      setMapZoom(15);
    }
  }, []);

  const handleStoreCardClick = useCallback((store: MapStoreItem) => {
    setSelectedItem({ type: "store", data: store });
    const addr = store.store_details?.store_address;
    if (addr?.latitude != null && addr?.longitude != null) {
      setMapCenter({ lat: Number(addr.latitude), lng: Number(addr.longitude) });
      setMapZoom(15);
    }
  }, []);

  const handleScrollLeft = useCallback(() => {
    scrollContainerRef.current?.scrollBy({ left: -340, behavior: "smooth" });
  }, []);

  const handleScrollRight = useCallback(() => {
    scrollContainerRef.current?.scrollBy({ left: 340, behavior: "smooth" });
  }, []);

  if (!apiKey) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f5f5",
        }}
      >
        <p style={{ color: COLORS.TEXT.SECONDARY_LIGHT }}>
          Google Maps API key not configured
        </p>
      </Box>
    );
  }

  const isLoading = !isLoaded || isGeoLoading || (isMapLoading && !mapData);

  if (isLoading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: COLORS.BACKGROUND.PAPER_LIGHT,
        }}
      >
        {/* Google Maps only loads client-side, so this branch is what the
            server always renders — the H1 needs to live here too, not just
            in the loaded-map branch below. */}
        <Typography component="h1" sx={{ position: "absolute", width: 1, height: 1, p: 0, m: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
          Find businesses & services near you on the kartsquare map
        </Typography>
        <p>{t("loadingMap")}</p>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "calc(100vh - 10rem)",
      }}
    >
      <Typography component="h1" sx={{ position: "absolute", width: 1, height: 1, p: 0, m: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
        Find businesses & services near you on the kartsquare map
      </Typography>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={
          mapCenter ||
          (coordinates?.latitude && coordinates?.longitude
            ? { lat: coordinates.latitude, lng: coordinates.longitude }
            : { lat: 26.9167, lng: 75.7833 })
        }
        options={mapOptions}
      >
        {/* Service markers — teardrop pin + popup */}
        {(filter === "all" || filter === "services") &&
          services.map((service: MapServiceItem) => {
            const lat = service?.service_address?.latitude;
            const lng = service?.service_address?.longitude;
            if (lat == null || lng == null) return null;
            const isSelected =
              selectedItem?.type === "service" &&
              selectedItem.data.service_id === service.service_id;
            const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
            return (
              <OverlayView
                key={`s-${service.service_id}`}
                position={{ lat, lng }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <MapPinMarker
                  type="service"
                  color={SERVICE_COLOR}
                  imageUrl={service.provider_image_url || service.image_urls?.[0]}
                  name={service.service_name}
                  id={service.service_id}
                  role={AppUserType.SERVICE_PROVIDER}
                  selected={isSelected}
                  onClick={() => handleServiceMarkerClick(service)}
                  showPopup={true}
                  directionsUrl={directionsUrl}
                  setSelectedItem={setSelectedItem}
                />
              </OverlayView>
            );
          })}

        {/* Store markers — teardrop pin + popup */}
        {(filter === "all" || filter === "stores") &&
          stores.map((store: MapStoreItem) => {
            const addr = store.store_details?.store_address;
            const lat = addr?.latitude;
            const lng = addr?.longitude;
            if (lat == null || lng == null) return null;
            const isSelected =
              selectedItem?.type === "store" &&
              selectedItem.data.supplier_id === store.supplier_id;
            const directionsUrl =
              lat != null && lng != null
                ? `https://www.google.com/maps/dir/?api=1&destination=${Number(lat)},${Number(lng)}`
                : undefined;
            return (
              <OverlayView
                key={`st-${store.supplier_id}`}
                position={{ lat: Number(lat), lng: Number(lng) }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <MapPinMarker
                  type="store"
                  color={STORE_COLOR}
                  imageUrl={store.store_details?.logo_url}
                  name={store.store_details?.store_name || "Store"}
                  selected={isSelected}
                  onClick={() => handleStoreMarkerClick(store)}
                  showPopup={true}
                  directionsUrl={directionsUrl}
                  setSelectedItem={setSelectedItem}
                  username={store.store_details?.username}
                  id={store.supplier_id}
                  role={AppUserType.SUPPLIER}
                />
              </OverlayView>
            );
          })}

        {/* User Location Marker */}
        {coordinates?.latitude && coordinates?.longitude && (
          <OverlayView
            position={{
              lat: coordinates.latitude,
              lng: coordinates.longitude,
            }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <Box
              sx={{
                transform: "translate(-50%, -50%)",
                position: "relative",
              }}
            >
              {/* Outer pulsing ring */}
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(66, 133, 244, 0.2)",
                  animation: "pulse 2s infinite",
                  "@keyframes pulse": {
                    "0%": {
                      transform: "translate(-50%, -50%) scale(1)",
                      opacity: 1,
                    },
                    "100%": {
                      transform: "translate(-50%, -50%) scale(1.5)",
                      opacity: 0,
                    },
                  },
                }}
              />
              {/* User Avatar */}
              <Box
                sx={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  border: `3px solid ${COLORS.PRIMARY_BLUE}`,
                  boxShadow: `0 2px 8px ${COLORS.SHADOW.DEFAULT}`,
                  overflow: "hidden",
                  backgroundColor: COLORS.WHITE,
                }}
              >
                <Avatar
                  src={userProfile!}
                  alt="Your location"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Box>
          </OverlayView>
        )}
      </GoogleMap>

      {/* Filter: All / Services / Stores */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, v) => v != null && setFilter(v)}
          sx={{
            bgcolor: theme.palette.mode === "dark" ? COLORS.BACKGROUND.PAPER_DARK : COLORS.WHITE,
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
            borderRadius: 2,
            "& .MuiToggleButton-root": {
              px: 2,
              py: 1,
              textTransform: "none",
              fontWeight: 600,
              "&.Mui-selected": {
                bgcolor: `${COLORS.PRIMARY_PURPLE}18`,
                color: COLORS.PRIMARY_PURPLE,
                "&:hover": { bgcolor: `${COLORS.PRIMARY_PURPLE}25` },
              },
            },
          }}
        >
          <ToggleButton value="all">
            <Typography variant="body2" sx={{ mr: 0.5 }}>All</Typography>
          </ToggleButton>
          <ToggleButton value="services">
            <HomeRepairService sx={{ fontSize: 18, mr: 0.5 }} />
            <Typography variant="body2">Services</Typography>
          </ToggleButton>
          <ToggleButton value="stores">
            <ShoppingBag sx={{ fontSize: 18, mr: 0.5 }} />
            <Typography variant="body2">Stores</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Bottom carousel: Services + Stores */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <IconButton
          onClick={handleScrollLeft}
          sx={{
            position: "absolute",
            display: isShowArrows ? "flex" : "none",
            left: 8,
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor:
              theme.palette.mode === "light" ? COLORS.WHITE : COLORS.BACKGROUND.PAPER_DARK,
            boxShadow: `0 2px 8px ${COLORS.SHADOW.DEFAULT}`,
            zIndex: 2,
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "light" ? COLORS.WHITE : COLORS.BACKGROUND.PAPER_DARK,
              boxShadow: `0 4px 12px ${COLORS.SHADOW.DEFAULT}`,
            },
          }}
        >
          <ChevronLeft />
        </IconButton>

        <Box
          ref={scrollContainerRef}
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            overflowY: "hidden",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            px: 6,
          }}
        >
          {(filter === "all" || filter === "services") &&
            services.map((service: MapServiceItem) => (
              <Box
                key={service.service_id}
                sx={{
                  position: "relative",
                  minWidth: 280,
                  maxWidth: 280,
                  py: 1, // Space for the hover lift
                }}
              >
                <Chip
                  label="Service"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    zIndex: 2,
                    height: 20,
                    fontWeight: 700,
                    fontSize: "0.6rem",
                    bgcolor: SERVICE_COLOR,
                    color: COLORS.WHITE,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    border: `1px solid ${COLORS.WHITE}40`,
                  }}
                />
                <ServiceProviderCard
                  service={service as unknown as Service}
                  size="small"
                  showExpandIcon={false}
                  selected={
                    selectedItem?.type === "service" &&
                    selectedItem.data.service_id === service.service_id
                  }
                  onCardClick={handleServiceCardClick}
                />
              </Box>
            ))}
          {(filter === "all" || filter === "stores") &&
            stores.map((store: MapStoreItem) => (
              <Box
                key={store.supplier_id}
                sx={{
                  position: "relative",
                  minWidth: 280,
                  maxWidth: 280,
                  py: 1, // Space for the hover lift
                }}
              >
                <Chip
                  label="Store"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    zIndex: 2,
                    height: 20,
                    fontWeight: 700,
                    fontSize: "0.6rem",
                    bgcolor: STORE_COLOR,
                    color: COLORS.WHITE,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    border: `1px solid ${COLORS.WHITE}40`,
                  }}
                />
                <StoreCard
                  store={store}
                  size="small"
                  selected={
                    selectedItem?.type === "store" &&
                    selectedItem.data.supplier_id === store.supplier_id
                  }
                  onCardClick={handleStoreCardClick}
                />
              </Box>
            ))}
        </Box>

        <IconButton
          onClick={handleScrollRight}
          sx={{
            position: "absolute",
            display: isShowArrows ? "flex" : "none",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor:
              theme.palette.mode === "light" ? COLORS.WHITE : COLORS.BACKGROUND.PAPER_DARK,
            boxShadow: `0 2px 8px ${COLORS.SHADOW.DEFAULT}`,
            zIndex: 2,
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "light" ? COLORS.WHITE : COLORS.BACKGROUND.PAPER_DARK,
              boxShadow: `0 4px 12px ${COLORS.SHADOW.DEFAULT}`,
            },
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>

      <ProfileDrawer />
    </Box>
  );
};

export default MapView;
