"use client";
import React, { useState } from "react";
import { Box, Typography, useTheme, Paper, Fade } from "@mui/material";
import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api";
import { COLORS } from "@/constants/colors";
import { Storefront, LocationOn, Directions } from "@mui/icons-material";
import { useTranslationContext } from "../../../features/i18n/TranslationContext";
import { keyframes } from "@mui/system";

const LIBRARIES: "places"[] = ["places"];

// Pulse animation for the marker
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(94, 24, 233, 0.4);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(94, 24, 233, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(94, 24, 233, 0);
  }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

interface ProductMapProps {
    latitude: number;
    longitude: number;
    storeName?: string;
    height?: string;
    address?: string; // Added address prop for more info
}

const ProductMap: React.FC<ProductMapProps> = ({
    latitude,
    longitude,
    storeName,
    height = "400px",
    address,
}) => {
    const { t } = useTranslationContext();
    const displayStoreName = storeName || t("storeLocation");
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const [mapLoaded, setMapLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: apiKey,
        libraries: LIBRARIES,
    });

    const mapContainerStyle = {
        width: "100%",
        height: height,
        borderRadius: "24px",
    };

    // Custom map styles to match the "trending" and "unique" vibe
    // Removing default POIs to focus on the store
    const mapOptions: google.maps.MapOptions = {
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        gestureHandling: "cooperative",
        zoom: 15,
        styles: isDark
            ? [
                { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                {
                    featureType: "administrative.locality",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#d59563" }],
                },
                {
                    featureType: "poi",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#d59563" }],
                },
                {
                    featureType: "poi.park",
                    elementType: "geometry",
                    stylers: [{ color: "#263c3f" }],
                },
                {
                    featureType: "poi.park",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#6b9a76" }],
                },
                {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [{ color: "#38414e" }],
                },
                {
                    featureType: "road",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#212a37" }],
                },
                {
                    featureType: "road",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#9ca5b3" }],
                },
                {
                    featureType: "road.highway",
                    elementType: "geometry",
                    stylers: [{ color: "#746855" }],
                },
                {
                    featureType: "road.highway",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#1f2835" }],
                },
                {
                    featureType: "road.highway",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#f3d19c" }],
                },
                {
                    featureType: "transit",
                    elementType: "geometry",
                    stylers: [{ color: "#2f3948" }],
                },
                {
                    featureType: "transit.station",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#d59563" }],
                },
                {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [{ color: "#17263c" }],
                },
                {
                    featureType: "water",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#515c6d" }],
                },
                {
                    featureType: "water",
                    elementType: "labels.text.stroke",
                    stylers: [{ color: "#17263c" }],
                },
            ]
            : [
                // Light mode custom styles - clean and modern
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }],
                },
                {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [{ color: "#ffffff" }]
                },
                {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [{ color: "#e9e9e9" }]
                },
                {
                    featureType: "landscape",
                    elementType: "geometry",
                    stylers: [{ color: "#f5f5f5" }]
                }
            ],
    };

    const center = {
        lat: latitude || 26.9124,
        lng: longitude || 75.7873,
    };

    const handleGetDirections = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        window.open(url, '_blank');
    };

    if (loadError) {
        return (
            <Box
                sx={{
                    width: "100%",
                    height: height,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: isDark ? "rgba(255, 255, 255, 0.05)" : "#f8f9fa",
                    borderRadius: "24px",
                    border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"}`,
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    Map could not be loaded.
                </Typography>
            </Box>
        )
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
                    bgcolor: isDark ? "rgba(255, 255, 255, 0.05)" : "#f8f9fa",
                    borderRadius: "24px",
                    border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"}`,
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    Loading Store Location...
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                position: "relative",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header "In Map" Look - Styled Card above map */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    borderRadius: "20px",
                    border: `1.5px solid ${COLORS.PRIMARY_PURPLE}`, // Brand color border
                    bgcolor: isDark ? "rgba(94, 24, 233, 0.06)" : "#f5f3ff", // Subtle purple tint
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    position: "relative",
                    overflow: "hidden"
                }}
            >
                {/* Decorative background element */}
                <Box sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    bgcolor: COLORS.PRIMARY_PURPLE,
                    opacity: 0.05
                }} />

                <Box
                    sx={{
                        width: 52,
                        height: 52,
                        borderRadius: "16px",
                        bgcolor: COLORS.PRIMARY_PURPLE,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: "0 8px 16px rgba(94, 24, 233, 0.25)"
                    }}
                >
                    <Storefront sx={{ color: "white", fontSize: 26 }} />
                </Box>
                <Box>
                    <Typography
                        variant="subtitle1"
                        fontWeight={800}
                        sx={{
                            color: isDark ? "text.primary" : "#1a1a2e",
                            lineHeight: 1.2,
                            mb: 0.5
                        }}
                    >
                        {t("storeLocation")}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: isDark ? "text.secondary" : "#64748b",
                            fontWeight: 500,
                            fontSize: "0.85rem"
                        }}
                    >
                        {displayStoreName} Location
                    </Typography>
                </Box>
            </Paper>

            <Box
                sx={{
                    borderRadius: "24px",
                    overflow: "hidden",
                    boxShadow: isDark
                        ? "0 8px 32px rgba(0, 0, 0, 0.4)"
                        : "0 8px 32px rgba(0, 0, 0, 0.08)",
                    border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.8)"}`,
                    position: "relative",
                }}
            >
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    options={mapOptions}
                    onLoad={() => setMapLoaded(true)}
                >
                    {/* Custom Store Marker Overlay */}
                    {mapLoaded && (
                        <OverlayView
                            position={center}
                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                        >
                            <Box
                                sx={{
                                    transform: "translate(-50%, -100%)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    position: "relative",
                                    top: -10, // Adjust to point exactly at location
                                }}
                                onClick={handleGetDirections}
                            >
                                {/* Floating Info Card (always visible or on hover, let's make it always visible but stylish) */}
                                <Fade in={true}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1.5,
                                            p: "8px 14px",
                                            mb: 1.5,
                                            borderRadius: "14px",
                                            bgcolor: isDark ? "rgba(30, 30, 30, 0.95)" : "rgba(255, 255, 255, 0.95)",
                                            backdropFilter: "blur(8px)",
                                            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
                                            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                                            maxWidth: "220px",
                                            animation: `${bounce} 2s infinite ease-in-out`,
                                            animationPlayState: isHovered ? "paused" : "running",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 50,
                                                height: 50,
                                                borderRadius: "10px",
                                                bgcolor: COLORS.PRIMARY_PURPLE + "15",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: COLORS.PRIMARY_PURPLE,
                                                flexShrink: 0,
                                            }}
                                        >
                                            <Storefront fontSize="small" />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2, fontSize: "0.85rem" }}>
                                                {displayStoreName}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: "0.7rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 0.5, mt: 0.2 }}>
                                                {t("directions")} <Directions sx={{ fontSize: 11 }} />
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Fade>

                                {/* Pin Head */}
                                <Box
                                    sx={{
                                        width: "52px",
                                        height: "52px",
                                        borderRadius: "50%",
                                        background: `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE}, ${COLORS.PURPLE_HOVER})`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: "0 4px 15px rgba(94, 24, 233, 0.5)",
                                        border: "4px solid white",
                                        zIndex: 2,
                                        animation: `${pulse} 2s infinite`,
                                        position: "relative",
                                    }}
                                >
                                    <Storefront sx={{ color: "white", fontSize: 26 }} />
                                </Box>

                                {/* Pin Stick/Needle */}
                                <Box
                                    sx={{
                                        width: 0,
                                        height: 0,
                                        borderLeft: "11px solid transparent",
                                        borderRight: "11px solid transparent",
                                        borderTop: `15px solid ${COLORS.PRIMARY_PURPLE}`,
                                        mt: -0.5, // Overlap slightly
                                        zIndex: 1,
                                        filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.1))"
                                    }}
                                />

                                {/* Ground Shadow */}
                                <Box
                                    sx={{
                                        width: "22px",
                                        height: "7px",
                                        borderRadius: "50%",
                                        bgcolor: "rgba(0,0,0,0.3)",
                                        mt: 0.5,
                                        filter: "blur(2px)"
                                    }}
                                />
                            </Box>
                        </OverlayView>
                    )}
                </GoogleMap>

                {/* Overlay Gradient for "Premium" look at the bottom */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "60px",
                        background: isDark
                            ? "linear-gradient(to top, rgba(0,0,0,0.8), transparent)"
                            : "linear-gradient(to top, rgba(255,255,255,0.8), transparent)",
                        pointerEvents: "none",
                        borderRadius: "0 0 24px 24px",
                    }}
                />
            </Box>
        </Box>
    );
};

export default ProductMap;
