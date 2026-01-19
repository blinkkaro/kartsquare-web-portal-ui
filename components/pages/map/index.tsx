"use client";
import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { Box, useTheme, IconButton, Avatar } from "@mui/material";
import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api";
import { Close, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Service } from "@/services/profile/profileInterface";
import { COLORS } from "@/constants/colors";
import ServiceProviderCard from "./components/ServiceProviderCard";
import { dummyServiceProviders } from "@/data/dummyServiceProviders";
import { useAutoGeolocation } from "@/hooks/useGeolocation";
import { secureStorage } from "@/helper/SecureStorage";
import { useTranslate } from "@/hooks/useTranslate";

// Define libraries outside component to prevent recreation
const LIBRARIES: "places"[] = ["places"];

const MapView: React.FC = () => {
  const theme = useTheme();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const { coordinates } = useAutoGeolocation();
  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [userProfile, setUserProfile] = useState<string | null>(null);
  const [mapZoom, setMapZoom] = useState(12);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const {t} = useTranslate()

  // Load user profile from localStorage
  useEffect(() => {
    const profileData = secureStorage.getItem("user_details");
    if (profileData) {
      try {
        console.log("profileData", profileData.profile_pic);
        setUserProfile(profileData.profile_pic);
      } catch (error) {
        console.error("Error parsing user profile:", error);
        setUserProfile(null);
      }
    }
  }, []);

  // Set initial map center to user location
  useEffect(() => {
    if (coordinates?.latitude && coordinates?.longitude && !mapCenter) {
      setMapCenter({
        lat: coordinates.latitude,
        lng: coordinates.longitude,
      });
    }
  }, [coordinates, mapCenter]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: LIBRARIES,
  });

  const mapContainerStyle = {
    width: "100%",
    height: "calc(100vh - 10rem)",
  };

  const mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true, // Disable default UI
    zoomControl: false, // Enable zoom control
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    gestureHandling: "greedy", // Enable map interactions
    zoom: mapZoom,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  };

  const handleMarkerClick = useCallback((service: Service) => {
    setSelectedService(service);
    setMapCenter({
      lat: service.service_provider_latitude,
      lng: service.service_provider_longitude,
    });
    setMapZoom(15); // Zoom in when marker is clicked
  }, []);

  const handleCardClick = useCallback((service: Service) => {
    setSelectedService(service);
    setMapCenter({
      lat: service.service_provider_latitude,
      lng: service.service_provider_longitude,
    });
    setMapZoom(15); // Zoom in when card is clicked
  }, []);

  const handleCloseCard = useCallback(() => {
    setSelectedService(null);
  }, []);

  const handleScrollLeft = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -340, // Card width (320px) + gap (20px)
        behavior: "smooth",
      });
    }
  }, []);

  const handleScrollRight = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 340, // Card width (320px) + gap (20px)
        behavior: "smooth",
      });
    }
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

  if (loadError) {
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
        <p style={{ color: COLORS.TEXT.SECONDARY_LIGHT }}>Error loading maps</p>
      </Box>
    );
  }

  if (!isLoaded) {
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
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={
          mapCenter ||
          (coordinates?.latitude && coordinates?.longitude
            ? { lat: coordinates.latitude, lng: coordinates.longitude }
            : { lat: 0, lng: 0 })
        }
        options={mapOptions}
      >
        {/* Custom Markers for Service Providers */}
        {dummyServiceProviders.map((service) => (
          <OverlayView
            key={service.id}
            position={{
              lat: service.service_provider_latitude,
              lng: service.service_provider_longitude,
            }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <Box
              onClick={() => handleMarkerClick(service)}
              sx={{
                cursor: "pointer",
                transform: "translate(-50%, -50%)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translate(-50%, -50%) scale(1.1)",
                },
                position: "relative",
              }}
            >
              {/* Pulsing ring for selected service */}
              {selectedService?.id === service.id && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(138, 43, 226, 0.2)",
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
              )}
              <Box
                sx={{
                  width: selectedService?.id === service.id ? 56 : 48,
                  height: selectedService?.id === service.id ? 56 : 48,
                  borderRadius: "50%",
                  border: `3px solid ${
                    selectedService?.id === service.id
                      ? COLORS.PRIMARY_PURPLE
                      : "#ffffff"
                  }`,
                  boxShadow:
                    selectedService?.id === service.id
                      ? "0 4px 16px rgba(138, 43, 226, 0.5)"
                      : "0 2px 8px rgba(0, 0, 0, 0.3)",
                  overflow: "hidden",
                  backgroundColor: "#fff",
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
        ))}

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

      {/* Bottom Service Provider Cards Carousel */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        {/* Left Arrow */}
        <IconButton
          onClick={handleScrollLeft}
          sx={{
            position: "absolute",
            left: 8,
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor:
              theme.palette.mode === "light"
                ? COLORS.WHITE
                : COLORS.BACKGROUND.PAPER_DARK,

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

        {/* Scrollable Container */}
        <Box
          ref={scrollContainerRef}
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            overflowY: "hidden",
            scrollbarWidth: "none", // Firefox
            "&::-webkit-scrollbar": {
              display: "none", // Chrome, Safari, Edge
            },
            px: 6, // Padding for arrows
          }}
        >
          {dummyServiceProviders.map((service) => (
            <Box
              key={service.id}
              sx={{
                minWidth: "320px",
                maxWidth: "320px",
                border:
                  selectedService?.id === service.id
                    ? `2px solid ${COLORS.PRIMARY_PURPLE}`
                    : "2px solid transparent",
                borderRadius: "14px",
                transition: "all 0.3s ease",
                boxShadow:
                  selectedService?.id === service.id
                    ? "0 4px 16px rgba(138, 43, 226, 0.3)"
                    : "none",
              }}
            >
              <ServiceProviderCard
                service={service}
                size="large"
                showExpandIcon={false}
                onCardClick={handleCardClick}
              />
            </Box>
          ))}
        </Box>

        {/* Right Arrow */}
        <IconButton
          onClick={handleScrollRight}
          sx={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor:
              theme.palette.mode === "light"
                ? COLORS.WHITE
                : COLORS.BACKGROUND.PAPER_DARK,
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

      {/* Selected Service Card (Popup) */}
      {selectedService && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            width: "90%",
            maxWidth: "400px",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={handleCloseCard}
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                zIndex: 1,
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
              size="small"
            >
              <Close />
            </IconButton>
            <ServiceProviderCard
              service={selectedService}
              size="large"
              showExpandIcon={false}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MapView;
