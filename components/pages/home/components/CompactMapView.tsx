"use client";
import React, { useState } from "react";
import { Box, useTheme, IconButton, Typography } from "@mui/material";
import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api";
import { OpenInFull } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { useRouter } from "next/navigation";
import { useAutoGeolocation } from "@/hooks/useGeolocation";
import { useTranslate } from "@/hooks/useTranslate";
import { useMapDetails } from "@/hooks/useMapDetails";
import type { MapServiceItem, MapStoreItem } from "@/services/map/mapInterface";
import MapPinMarker from "@/components/pages/map/components/MapPinMarker";

// Define libraries outside component to prevent recreation
const LIBRARIES: "places"[] = ["places"];

const SERVICE_MARKER_COLOR = COLORS.PRIMARY_PURPLE;
const STORE_MARKER_COLOR = COLORS.PRIMARY_BLUE;

interface CompactMapViewProps {
  height?: string;
}

const CompactMapView: React.FC<CompactMapViewProps> = ({
  height = "300px",
}) => {
  const theme = useTheme();
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const {
    coordinates,
    isLoading: isGeoLoading,
    error: geoError,
  } = useAutoGeolocation();
  const { t } = useTranslate();

  const {
    data: mapData,
    isLoading: isMapLoading,
    error: mapError,
  } = useMapDetails({ limit: 20 });

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: LIBRARIES,
  });

  const mapContainerStyle = {
    width: "100%",
    height: height,
    borderRadius: "12px",
  };

  const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    gestureHandling: "greedy",
    zoom: 12,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  };

  const handleMapClick = () => {
    router.push("/map");
  };

  const isLoading = !isLoaded || isGeoLoading || isMapLoading;

  if (isLoading) {
    return (
      <Box
        onClick={handleMapClick}
        sx={{
          width: "100%",
          height: height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: COLORS.BACKGROUND.PAPER_LIGHT,
          borderRadius: "12px",
          cursor: "pointer",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {t("loadingMap")}
        </Typography>
      </Box>
    );
  }

  const services = mapData?.services ?? [];
  const stores = mapData?.stores ?? [];

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: height,
        borderRadius: "12px",
        overflow: "hidden",
        cursor: "pointer",
        "&:hover .expand-button": { opacity: 1 },
      }}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={
          coordinates?.latitude && coordinates?.longitude
            ? { lat: coordinates.latitude, lng: coordinates.longitude }
            : { lat: 26.9167, lng: 75.7833 }
        }
        options={mapOptions}
      >
        {/* Service markers — teardrop pin + popup on hover */}
        {services.map((service: MapServiceItem) => {
          const lat = service?.service_address?.latitude;
          const lng = service?.service_address?.longitude;
          if (lat == null || lng == null) return null;
          const isHovered = hoveredId === `s-${service.service_id}`;
          const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
          return (
            <OverlayView
              key={`s-${service.service_id}`}
              position={{ lat, lng }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <Box
                onMouseEnter={() => setHoveredId(`s-${service.service_id}`)}
                onMouseLeave={() => setHoveredId(null)}
                sx={{ display: "inline-block" }}
              >
                <MapPinMarker
                  type="service"
                  color={SERVICE_MARKER_COLOR}
                  imageUrl={service.provider_image_url || service.image_urls?.[0]}
                  name={service.service_name}
                  selected={isHovered}
                  showPopup={true}
                  directionsUrl={directionsUrl}
                  size="compact"
                />
              </Box>
            </OverlayView>
          );
        })}

        {/* Store markers — teardrop pin + popup on hover */}
        {stores.map((store: MapStoreItem) => {
          const addr = store.store_details?.store_address;
          const lat = addr?.latitude;
          const lng = addr?.longitude;
          if (lat == null || lng == null) return null;
          const isHovered = hoveredId === `st-${store.supplier_id}`;
          const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${Number(lat)},${Number(lng)}`;
          return (
            <OverlayView
              key={`st-${store.supplier_id}`}
              position={{ lat: Number(lat), lng: Number(lng) }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <Box
                onMouseEnter={() => setHoveredId(`st-${store.supplier_id}`)}
                onMouseLeave={() => setHoveredId(null)}
                sx={{ display: "inline-block" }}
              >
                <MapPinMarker
                  type="store"
                  color={STORE_MARKER_COLOR}
                  imageUrl={store.store_details?.logo_url}
                  name={store.store_details?.store_name || "Store"}
                  selected={isHovered}
                  showPopup={true}
                  directionsUrl={directionsUrl}
                  size="compact"
                />
              </Box>
            </OverlayView>
          );
        })}

        {/* User location */}
        {coordinates?.latitude && coordinates?.longitude && (
          <OverlayView
            position={{
              lat: coordinates.latitude,
              lng: coordinates.longitude,
            }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <Box sx={{ transform: "translate(-50%, -50%)" }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  bgcolor: COLORS.PRIMARY_BLUE,
                  border: `3px solid ${COLORS.WHITE}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              />
            </Box>
          </OverlayView>
        )}
      </GoogleMap>

      {/* Legend: Services (purple) / Stores (blue) */}
      <Box
        sx={{
          position: "absolute",
          bottom: 12,
          left: 12,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          zIndex: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.9)",
              bgcolor: SERVICE_MARKER_COLOR,
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            }}
          />
          <Typography variant="caption" sx={{ color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.6)", fontWeight: 600 }}>
            Services
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.9)",
              bgcolor: STORE_MARKER_COLOR,
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            }}
          />
          <Typography variant="caption" sx={{ color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.6)", fontWeight: 600 }}>
            Stores
          </Typography>
        </Box>
      </Box>

      <Box
        className="expand-button"
        sx={{ position: "absolute", top: 12, right: 12 }}
      >
        <IconButton
          size="small"
          sx={{
            backgroundColor: COLORS.WHITE,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            color: COLORS.PRIMARY_PURPLE,
            "&:hover": { backgroundColor: COLORS.BACKGROUND.PAPER_LIGHT },
          }}
          onClick={handleMapClick}
        >
          <OpenInFull fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CompactMapView;
