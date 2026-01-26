"use client";
import React, { useState } from "react";
import { Box, useTheme, IconButton, Typography } from "@mui/material";
import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api";
import { OpenInFull } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { useRouter } from "next/navigation";
import { useAutoGeolocation } from "@/hooks/useGeolocation";
import { useTranslate } from "@/hooks/useTranslate";
import { useServicesList } from "@/hooks/useServicesList";

// Define libraries outside component to prevent recreation
const LIBRARIES: "places"[] = ["places"];

interface CompactMapViewProps {
  height?: string;
}

const CompactMapView: React.FC<CompactMapViewProps> = ({
  height = "300px",
}) => {
  const theme = useTheme();
  const router = useRouter();
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const {
    coordinates,
    isLoading: isGeoLoading,
    error: geoError,
  } = useAutoGeolocation();
  const { t } = useTranslate();

  // Fetch services using the new hook
  const {
    data: servicesData,
    isLoading: isServicesLoading,
    error: servicesError,
  } = useServicesList({
    limit: 10,
  });

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
    disableDefaultUI: true, // Disable default UI
    zoomControl: false, // Enable zoom control
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    gestureHandling: "greedy", // Enable map interactions
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

  const isLoading = !isLoaded || isGeoLoading || isServicesLoading;
  const error = loadError || geoError || servicesError;

  if (isLoading || error) {
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
          {error ? t("errorLoadingMap") : t("loadingMap")}
        </Typography>
      </Box>
    );
  }

  const services = servicesData?.services || [];

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: height,
        borderRadius: "12px",
        overflow: "hidden",
        cursor: "pointer",
        "&:hover .expand-button": {
          opacity: 1,
        },
      }}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={
          coordinates?.latitude && coordinates?.longitude
            ? { lat: coordinates.latitude, lng: coordinates.longitude }
            : { lat: 0, lng: 0 }
        }
        options={mapOptions}
      >
        {/* Custom Markers for Service Providers */}
        {services.map((service) =>
          service?.service_address?.latitude &&
          service?.service_address?.longitude ? (
            <OverlayView
              key={service.service_id}
              position={{
                lat: service.service_address.latitude || 0,
                lng: service.service_address.longitude || 0,
              }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <Box
                onMouseEnter={() => setHoveredMarkerId(service.service_id)}
                onMouseLeave={() => setHoveredMarkerId(null)}
                sx={{
                  transform: "translate(-50%, -50%)",
                  transition: "all 0.3s ease",
                }}
              >
                <Box
                  sx={{
                    width: hoveredMarkerId === service.service_id ? 44 : 36,
                    height: hoveredMarkerId === service.service_id ? 44 : 36,
                    borderRadius: "50%",
                    border: `2px solid ${COLORS.PRIMARY_PURPLE}`,
                    boxShadow: `0 2px 8px ${COLORS.SHADOW.DEFAULT}`,
                    overflow: "hidden",
                    backgroundColor: COLORS.WHITE,
                    transition: "all 0.3s ease",
                  }}
                >
                  <img
                    src={
                      service.provider_image_url || "https://i.pravatar.cc/150"
                    }
                    alt={service.provider_name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Box>
            </OverlayView>
          ) : null,
        )}

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
              {/* Inner blue dot */}
              <Box
                sx={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: COLORS.PRIMARY_BLUE,
                  border: `3px solid ${COLORS.WHITE}`,
                  boxShadow: `0 2px 8px ${COLORS.SHADOW.DEFAULT}`,
                }}
              />
            </Box>
          </OverlayView>
        )}
      </GoogleMap>

      {/* Expand Button Overlay */}
      <Box
        className="expand-button"
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          // transition: "opacity 0.3s ease",
        }}
      >
        <IconButton
          size="small"
          sx={{
            backgroundColor: COLORS.WHITE,
            boxShadow: `0 2px 8px ${COLORS.SHADOW.DEFAULT}`,
            color: COLORS.PRIMARY_PURPLE,
            "&:hover": {
              backgroundColor: COLORS.BACKGROUND.PAPER_LIGHT,
            },
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
