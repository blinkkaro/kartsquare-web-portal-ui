"use client";
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRouter } from "next/navigation";
import { COLORS } from "@/constants/colors";
import { useAutoGeolocation } from "@/hooks/useGeolocation";
import { useMapDetails } from "@/hooks/useMapDetails";
import type { MapServiceItem, MapStoreItem } from "@/services/map/mapInterface";
import MapPinMarker from "@/components/pages/map/components/MapPinMarker";
import SectionCard from "@/components/common/SectionCard";

const LIBRARIES: "places"[] = ["places"];
const SERVICE_MARKER_COLOR = COLORS.PRIMARY_PURPLE;
const STORE_MARKER_COLOR = COLORS.PRIMARY_BLUE;

const MAP_HEIGHT = { xs: 360, md: 460 };

const NearbyExpertsSection = () => {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { coordinates, isLoading: isGeoLoading } = useAutoGeolocation();
  const { data: mapData, isLoading: isMapLoading } = useMapDetails({ limit: 20 });

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: LIBRARIES,
  });

  const services = mapData?.services ?? [];
  const stores = mapData?.stores ?? [];
  const totalExperts = services.length + stores.length;

  const mapContainerStyle = { width: "100%", height: "100%" };
  const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    gestureHandling: "greedy",
    zoom: 12,
    styles: [
      { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
    ],
  };

  const isLoading = !isLoaded || isGeoLoading || isMapLoading;
  const center =
    coordinates?.latitude && coordinates?.longitude
      ? { lat: coordinates.latitude, lng: coordinates.longitude }
      : { lat: 26.9167, lng: 75.7833 };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1,
          mb: 2,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.5 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: COLORS.SUCCESS_GREEN,
                boxShadow: `0 0 0 3px ${COLORS.SUCCESS_GREEN}30`,
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              {totalExperts} Experts Live Now
            </Typography>
          </Box>
          <Typography variant="h5">Nearby Experts</Typography>
        </Box>

        <Box
          onClick={() => router.push("/map")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            cursor: "pointer",
            color: COLORS.PRIMARY_BLUE,
            fontWeight: 600,
            fontSize: "0.85rem",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          View List View <ArrowForwardIcon sx={{ fontSize: 16 }} />
        </Box>
      </Box>

      <SectionCard
        size="lg"
        sx={{
          position: "relative",
          width: "100%",
          height: MAP_HEIGHT,
          overflow: "hidden",
          p: 0,
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: COLORS.BACKGROUND.PAPER_LIGHT,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Loading map…
            </Typography>
          </Box>
        ) : (
          <GoogleMap mapContainerStyle={mapContainerStyle} center={center} options={mapOptions}>
            {services.map((service: MapServiceItem) => {
              const lat = service?.service_address?.latitude;
              const lng = service?.service_address?.longitude;
              if (lat == null || lng == null) return null;
              const id = `s-${service.service_id}`;
              const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
              return (
                <OverlayView key={id} position={{ lat, lng }} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                  <Box onMouseEnter={() => setHoveredId(id)} onMouseLeave={() => setHoveredId(null)}>
                    <MapPinMarker
                      type="service"
                      color={SERVICE_MARKER_COLOR}
                      imageUrl={service.provider_image_url || service.image_urls?.[0]}
                      name={service.service_name}
                      selected={hoveredId === id}
                      showPopup
                      directionsUrl={directionsUrl}
                      size="compact"
                    />
                  </Box>
                </OverlayView>
              );
            })}
            {stores.map((store: MapStoreItem) => {
              const addr = store.store_details?.store_address;
              const lat = addr?.latitude;
              const lng = addr?.longitude;
              if (lat == null || lng == null) return null;
              const id = `st-${store.supplier_id}`;
              const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${Number(lat)},${Number(lng)}`;
              return (
                <OverlayView
                  key={id}
                  position={{ lat: Number(lat), lng: Number(lng) }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  <Box onMouseEnter={() => setHoveredId(id)} onMouseLeave={() => setHoveredId(null)}>
                    <MapPinMarker
                      type="store"
                      color={STORE_MARKER_COLOR}
                      imageUrl={store.store_details?.logo_url}
                      name={store.store_details?.store_name || "Store"}
                      selected={hoveredId === id}
                      showPopup
                      directionsUrl={directionsUrl}
                      size="compact"
                    />
                  </Box>
                </OverlayView>
              );
            })}
          </GoogleMap>
        )}
      </SectionCard>
    </Box>
  );
};

export default NearbyExpertsSection;
