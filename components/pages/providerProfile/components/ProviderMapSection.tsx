"use client";

import React, { useState } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api";
import { motion } from "framer-motion";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { LocationOn } from "@mui/icons-material";

const MotionBox = motion(Box) as any;

const LIBRARIES: "places"[] = ["places"];

interface ProviderMapSectionProps {
    latitude?: number;
    longitude?: number;
    providerImage?: string;
    address?: string;
}

const ProviderMapSection: React.FC<ProviderMapSectionProps> = ({
    latitude,
    longitude,
    providerImage,
    address,
}) => {
    const theme = useTheme();
    const { t } = useTranslate();
    const isDark = theme.palette.mode === "dark";
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.down("md"));
    const [hovered, setHovered] = useState(false);

    const mapHeight = isMobile ? 220 : isTablet ? 300 : 450;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: apiKey,
        libraries: LIBRARIES,
    });

    const mapContainerStyle = {
        width: "100%",
        height: "100%",
        borderRadius: "16px",
    };

    const mapOptions: google.maps.MapOptions = {
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
        zoom: 15,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
            },
        ],
    };

    if (!latitude || !longitude) {
        return null;
    }

    const containerVariants: any = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.6, ease: "easeOut" }
        },
    };

    return (
        <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            sx={{
                height: mapHeight,
                width: "100%",
                borderRadius: 4,
                overflow: "hidden",
                position: "relative",
                boxShadow: isDark
                    ? "0 10px 40px rgba(0,0,0,0.4)"
                    : "0 20px 40px rgba(0,0,0,0.08)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
            }}
        >
            {!isLoaded || loadError ? (
                <Box
                    sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PAPER_LIGHT,
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        {loadError ? t("errorLoadingMap") : t("loadingMap")}
                    </Typography>
                </Box>
            ) : (
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={{ lat: latitude, lng: longitude }}
                    options={mapOptions}
                >
                    <OverlayView
                        position={{ lat: latitude, lng: longitude }}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    >
                        <Box
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                            sx={{
                                transform: "translate(-50%, -100%)",
                                position: "relative",
                                cursor: "pointer",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            {/* Tooltip / Address Box */}
                            {hovered && address && (
                                <Box
                                    component={motion.div}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    sx={{
                                        position: "absolute",
                                        bottom: "120%",
                                        bgcolor: COLORS.WHITE,
                                        p: 1.5,
                                        borderRadius: 2,
                                        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                                        width: 200,
                                        textAlign: "center",
                                        zIndex: 10,
                                    }}
                                >
                                    <Typography variant="caption" sx={{ color: COLORS.TEXT.PRIMARY_LIGHT, fontWeight: 600 }}>
                                        {address}
                                    </Typography>
                                    {/* Triangle */}
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            bottom: -6,
                                            left: "50%",
                                            transform: "translateX(-50%) rotate(45deg)",
                                            width: 12,
                                            height: 12,
                                            bgcolor: COLORS.WHITE,
                                        }}
                                    />
                                </Box>
                            )}

                            {/* Marker Pin */}
                            <Box
                                sx={{
                                    position: "relative",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: "50% 50% 50% 0",
                                        transform: "rotate(-45deg)",
                                        bgcolor: COLORS.PRIMARY_PURPLE,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                                        border: `3px solid ${COLORS.WHITE}`,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: "50%",
                                            overflow: "hidden",
                                            transform: "rotate(45deg)",
                                            bgcolor: COLORS.WHITE,
                                            border: `2px solid ${COLORS.WHITE}`
                                        }}
                                    >
                                        {providerImage ? (
                                            <img
                                                src={providerImage}
                                                alt="Provider"
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                        ) : (
                                            <LocationOn sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 32 }} />
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </OverlayView>
                </GoogleMap>
            )}
        </MotionBox>
    );
};

export default ProviderMapSection;
