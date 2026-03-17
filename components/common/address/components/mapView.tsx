"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Box, CircularProgress } from "@mui/material";
import { keyframes } from "@mui/system";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";

// Define libraries outside component to prevent recreation
const LIBRARIES: "places"[] = ["places"];

interface MapViewProps {
  latitude?: number;
  longitude?: number;
  onLocationChange?: (lat: number, lng: number) => void;
  height?: string;
}

const MapView: React.FC<MapViewProps> = ({
  latitude = 28.6139, // Default to New Delhi
  longitude = 77.209,
  onLocationChange,
  height = "200px",
}) => {
  const [center, setCenter] = useState({
    lat: latitude,
    lng: longitude,
  });
  const mapRef = useRef<google.maps.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { t } = useTranslate();

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  // Use useJsApiLoader instead of LoadScript to prevent duplicate loading
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: LIBRARIES,
  });

  // Update center when props change
  useEffect(() => {
    if (latitude && longitude) {
      setCenter({ lat: latitude, lng: longitude });
      if (mapRef.current) {
        mapRef.current.panTo({ lat: latitude, lng: longitude });
      }
    }
  }, [latitude, longitude]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setIsMapLoaded(true);
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
    setIsMapLoaded(false);
  }, []);

  // Handle map idle event (when user stops dragging)
  const handleMapIdle = useCallback(() => {
    if (mapRef.current) {
      const newCenter = mapRef.current.getCenter();
      if (newCenter) {
        const lat = newCenter.lat();
        const lng = newCenter.lng();
        onLocationChange?.(lat, lng);
      }
    }
  }, [onLocationChange]);

  const mapContainerStyle = {
    width: "100%",
    height: height,
  };

  const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    gestureHandling: "greedy",
    zoomControlOptions: {
      position: 7, // RIGHT_CENTER
    },
  };

  if (!apiKey) {
    return (
      <Box
        sx={{
          width: "100%",
          height: height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: COLORS.BACKGROUND.PAPER_LIGHT,
          borderRadius: "12px",
        }}
      >
        <p style={{ color: COLORS.TEXT.SECONDARY_LIGHT }}>
          {t("googleMapsApiKeyNotConfigured")}
        </p>
      </Box>
    );
  }

  if (loadError) {
    return (
      <Box
        sx={{
          width: "100%",
          height: height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: COLORS.BACKGROUND.PAPER_LIGHT,
          borderRadius: "12px",
        }}
      >
        <p style={{ color: COLORS.TEXT.SECONDARY_LIGHT }}>
          {t("errorLoadingMap")}
        </p>
      </Box>
    );
  }

  if (!isLoaded) {
    return (
      <Box
        sx={{
          width: "100%",
          height: height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: COLORS.BACKGROUND.PAPER_LIGHT,
          borderRadius: "12px",
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", width: "100%", height: height }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onIdle={handleMapIdle}
        options={mapOptions}
      />

      {/* Fixed Center Marker */}
      {isMapLoaded && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -100%)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          {/* Marker Pin */}
          <Box
            sx={{
              position: "relative",
              width: "40px",
              height: "50px",
            }}
          >
            {/* Pin Shape */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                width: "40px",
                height: "40px",
                bgcolor: COLORS.PRIMARY_PURPLE,
                borderRadius: "50% 50% 50% 0",
                transform: "translateX(-50%) rotate(-45deg)",
                boxShadow: `0 4px 12px ${COLORS.SHADOW.DEFAULT}`,
                border: `3px solid ${COLORS.WHITE}`,
              }}
            >
              {/* Inner Dot */}
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "12px",
                  height: "12px",
                  bgcolor: COLORS.WHITE,
                  borderRadius: "50%",
                }}
              />
            </Box>

            {/* Shadow/Pulse Effect */}
            <Box
              sx={{
                position: "absolute",
                bottom: "-8px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "20px",
                height: "8px",
                bgcolor: COLORS.SHADOW.DEFAULT,
                borderRadius: "50%",
                filter: "blur(4px)",
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MapView;
