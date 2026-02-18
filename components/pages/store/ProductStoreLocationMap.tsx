"use client";

 

import React, { useState, useCallback, useEffect } from "react";

import {

  Box,

  Typography,

  Card,

  CardContent,

  useTheme,

  IconButton,

  Chip,

  Avatar,

} from "@mui/material";

import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";

import { Store, Phone, Star, LocationOn, CheckCircle } from "@mui/icons-material";

import { COLORS } from "@/constants/colors";

// Define libraries outside component to prevent recreation
const LIBRARIES: ("places" | "maps")[] = ["places", "maps"];

const mapContainerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
  overflow: "hidden",
};

 

interface ProductStoreLocationMapProps {

  location: string;

  storeName?: string;

  storeAddress?: string;

  storePhone?: string;

  storeRating?: number;

  storeLogo?: string;

}

 

const ProductStoreLocationMap: React.FC<ProductStoreLocationMapProps> = ({

  location,

  storeName = "Kartsquare Store",

  storeAddress = location,

  storePhone = "+91-141-1234567",

  storeRating = 4.5,

  storeLogo,

}) => {

  const theme = useTheme();

  const isDark = theme.palette.mode === "dark";

  const [mapCenter, setMapCenter] = useState({ lat: 26.9124, lng: 75.7873 }); // Default: Jaipur

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const [showInfoWindow, setShowInfoWindow] = useState(true);

 

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const { isLoaded, loadError } = useJsApiLoader({
    id: "script-loader",
    googleMapsApiKey: apiKey,
    libraries: LIBRARIES,
  });

 

  const onLoad = useCallback((map: google.maps.Map) => {

    setMap(map);

  }, []);

 

  const onUnmount = useCallback(() => {

    setMap(null);

  }, []);

 

  // Geocode location to get coordinates

  const geocodeLocation = useCallback(async (locationName: string) => {

    if (!window.google || !window.google.maps) return { lat: 26.9124, lng: 75.7873 };

 

    const geocoder = new window.google.maps.Geocoder();

 

    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {

      geocoder.geocode(

        { address: locationName },

        (results, status) => {

          if (status === "OK" && results && results[0]) {

            const location = results[0].geometry.location;

            resolve({

              lat: location.lat(),

              lng: location.lng(),

            });

          } else {

            // Fallback to Jaipur coordinates if geocoding fails

            resolve({ lat: 26.9124, lng: 75.7873 });

          }

        }

      );

    });

  }, []);

 

  // Update map center when location changes

  useEffect(() => {

    if (location && isLoaded) {

      geocodeLocation(location).then(setMapCenter);

    }

  }, [location, isLoaded, geocodeLocation]);

  // Auto-open InfoWindow when map loads and location is set
  useEffect(() => {
    if (isLoaded && mapCenter.lat !== 26.9124) {
      setShowInfoWindow(true);
    }
  }, [isLoaded, mapCenter]);

 

  useEffect(() => {

    if (isLoaded) {

      const style = document.createElement('style');

      style.innerHTML = `
        /* Force InfoWindow to be light mode in dark mode */
        .gm-style .gm-style-iw-c,
        .gm-style .gm-style-iw-d,
        .gm-style .gm-style-iw {
          background-color: #ffffff !important;
          background: #ffffff !important;
          color: #000000 !important;
        }
        
        /* Force all text inside InfoWindow to be black */
        .gm-style .gm-style-iw-c *,
        .gm-style .gm-style-iw-d *,
        .gm-style .gm-style-iw *,
        .gm-style .gm-style-iw div,
        .gm-style .gm-style-iw span,
        .gm-style .gm-style-iw p,
        .gm-style .gm-style-iw h1,
        .gm-style .gm-style-iw h2,
        .gm-style .gm-style-iw h3,
        .gm-style .gm-style-iw h4,
        .gm-style .gm-style-iw h5,
        .gm-style .gm-style-iw h6 {
          color: #000000 !important;
        }
        
        /* Force all backgrounds inside InfoWindow to be white */
        .gm-style .gm-style-iw-c div,
        .gm-style .gm-style-iw-d div,
        .gm-style .gm-style-iw div {
          background-color: #ffffff !important;
          background: #ffffff !important;
        }
        
        /* InfoWindow container */
        .gm-style .gm-style-iw-tc {
          background-color: #ffffff !important;
        }
        
        /* InfoWindow content container */
        .gm-style .gm-style-iw-t {
          background-color: #ffffff !important;
        }
      `;
      style.id = 'infowindow-fix';
      document.head.appendChild(style);
      
      return () => {
        const existingStyle = document.getElementById('infowindow-fix');
        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
      };
    }
  }, [isLoaded]);

 

  // Custom marker icon

  const createCustomMarkerIcon = () => {

    return {

      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`

        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">

          <circle cx="16" cy="16" r="8" fill="${COLORS.PRIMARY_PURPLE}" stroke="white" stroke-width="2"/>

          <circle cx="16" cy="16" r="4" fill="white"/>

        </svg>

      `)}`,

      scaledSize: new window.google.maps.Size(32, 32),

      anchor: new window.google.maps.Point(16, 16),

    };

  };

 

  if (loadError) {
    return (
      <Card
        sx={{
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#f5f5f5",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
        }}
      >
        <Box sx={{ textAlign: "center", p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            📍 {location}
          </Typography>
          <Typography variant="caption" color="error">
            Map unavailable - API key missing
          </Typography>
        </Box>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card
        sx={{
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: isDark ? "rgba(255,255,255,0.05)" : "#f5f5f5",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Loading map...
        </Typography>
      </Card>
    );
  }

 

  return (

    <Card

      sx={{

        border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,

        bgcolor: isDark ? "rgba(255,255,255,0.02)" : "white",

        overflow: "hidden",

      }}

    >

      <CardContent sx={{ p: 2, pb: 1 }}>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>

          <LocationOn sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 20 }} />

          <Typography

            variant="subtitle2"

            sx={{

              fontWeight: 600,

              color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,

            }}

          >

            Store Location

          </Typography>

        </Box>

 

        <GoogleMap

          mapContainerStyle={mapContainerStyle}

          center={mapCenter}

          zoom={14}

          onLoad={onLoad}

          onUnmount={onUnmount}

          options={{

            styles: isDark ? [

              {

                featureType: "all",

                elementType: "geometry",

                stylers: [{ color: "#212121" }],

              },

              {

                featureType: "all",

                elementType: "labels.text.fill",

                stylers: [{ color: "#757575" }],

              },

              {

                featureType: "all",

                elementType: "labels.text.stroke",

                stylers: [{ color: "#212121" }],

              },

              {

                featureType: "water",

                elementType: "geometry",

                stylers: [{ color: "#000000" }],

              },

            ] : [],

            disableDefaultUI: false,

            zoomControl: true,

            mapTypeControl: false,

            streetViewControl: false,

            fullscreenControl: false,

          }}

        >

          <Marker

            position={mapCenter}

            title={storeName}

            icon={createCustomMarkerIcon()}

            onClick={() => setShowInfoWindow(!showInfoWindow)}

          />

 

          {/* Info Window */}

          {showInfoWindow && (

            <InfoWindow

              position={mapCenter}

              onCloseClick={() => setShowInfoWindow(false)}

              options={{
                pixelOffset: new window.google.maps.Size(0, -40)
              }}

            >

              <Box sx={{ p: 1.5, minWidth: "250px", bgcolor: "#ffffff", color: "#000000" }}>
                <Box
                  sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 1 }}
                >
                  <Avatar
                    src={storeLogo || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop"}
                    sx={{
                      width: 48,
                      height: 48,
                      border: `2px solid ${COLORS.PRIMARY_PURPLE}`,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      objectFit: "cover",
                      "& img": {
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      },
                    }}
                  >
                    {!storeLogo && storeName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          lineHeight: 1.2,
                          color: "#000000",
                        }}
                      >
                        {storeName}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Chip
                          icon={<CheckCircle sx={{ fontSize: 12 }} />}
                          label="Verified"
                          size="small"
                          sx={{
                            bgcolor: "#e8f5e8",
                            color: "#2e7d32",
                            fontSize: "10px",
                            height: "20px",
                            "& .MuiChip-icon": {
                              fontSize: "12px",
                            },
                          }}
                        />
                        <Chip
                          label="Trust"
                          size="small"
                          sx={{
                            bgcolor: "#e3f2fd",
                            color: "#1565c0",
                            fontSize: "10px",
                            height: "20px",
                          }}
                        />
                      </Box>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mb: 0.5, color: "#000000" }}
                    >
                      📍 {storeAddress}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Phone sx={{ fontSize: 14, color: COLORS.PRIMARY_PURPLE }} />
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 500,
                          color: "#000000",
                        }}
                      >
                        {storePhone}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
              </Box>

            </InfoWindow>

          )}

        </GoogleMap>

 

        <Box sx={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          <Chip

            label={location}

            size="small"

            sx={{

              bgcolor: COLORS.PRIMARY_PURPLE,

              color: "white",

              fontWeight: 500,

            }}

          />

          <Typography variant="caption" color="text.secondary">

            Click marker for details

          </Typography>

        </Box>

      </CardContent>

    </Card>

  );

};

 

export default ProductStoreLocationMap;