"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Chip,
  InputAdornment,
  useTheme,
  Paper,
} from "@mui/material";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import { Search, MyLocation, Place } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { useTranslationContext } from "@/features/i18n/TranslationContext";
import { SearchResult } from "@/services/map/mapInterface";

interface MapSearchSuggestionsProps {
  currentLocation: { lat: number; lng: number };
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    address: string;
    placeId: string;
    addressComponents?: any;
  }) => void;
}

const MapSearchSuggestions: React.FC<MapSearchSuggestionsProps> = ({
  currentLocation,
  onLocationSelect,
}) => {
  const { t } = useTranslationContext();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [lastSelectedQuery, setLastSelectedQuery] = useState<string | null>(
    null,
  ); // Track last selected suggestion
  const isSelectingRef = React.useRef(false); // Track if we're selecting a suggestion

  // Fixed radius for nearby search (10km)
  const SEARCH_RADIUS_KM = 10;

  // Debounce function
  const debounce = <T extends (...args: any[]) => any>(
    func: T,
    delay: number,
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Search function - searches for places near current location using Google Maps SDK
  const performSearch = useCallback(
    async (query: string) => {
      // Don't search if we're in the middle of selecting a suggestion
      if (isSelectingRef.current) {
        return;
      }

      // Don't search if this is the last selected query
      if (lastSelectedQuery && query === lastSelectedQuery) {
        return;
      }

      if (!query.trim() || query.length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Check if Google Maps API is loaded
        if (!window.google || !window.google.maps) {
          throw new Error("Google Maps API not loaded");
        }

        // Use AutocompleteService from Google Maps JavaScript SDK
        const service = new google.maps.places.AutocompleteService();
        const request: google.maps.places.AutocompletionRequest = {
          input: query,
          locationBias: {
            radius: SEARCH_RADIUS_KM * 1000, // Convert km to meters
            center: new google.maps.LatLng(
              currentLocation.lat,
              currentLocation.lng,
            ),
          },
        };

        service.getPlacePredictions(request, (predictions, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            // Transform predictions to match SearchResult interface
            const results: SearchResult[] = predictions.map((prediction) => ({
              place_id: prediction.place_id,
              description: prediction.description,
              distance: null, // Distance calculation would require additional API calls
              location: null,
            }));
            setSuggestions(results);
            setShowSuggestions(true);
          } else if (
            status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS
          ) {
            setSuggestions([]);
            setShowSuggestions(true);
          } else {
            console.error("Place search failed:", status);
            setError("Failed to search locations");
            setSuggestions([]);
          }
          setIsLoading(false);
        });
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to search locations");
        setSuggestions([]);
        setIsLoading(false);
      }
    },
    [currentLocation, lastSelectedQuery],
  );

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce(performSearch, 1000),
    [performSearch],
  );

  // Effect to trigger search when query changes
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  // Handle suggestion selection using Google Maps SDK
  const handleSuggestionClick = async (suggestion: SearchResult) => {
    // Set flag to prevent search from running when we update searchQuery
    isSelectingRef.current = true;

    // Close suggestions immediately and clear the list
    setShowSuggestions(false);
    setSuggestions([]);
    setIsLoading(true);

    try {
      // Check if Google Maps API is loaded
      if (!window.google || !window.google.maps) {
        throw new Error("Google Maps API not loaded");
      }

      // If we already have location data from the search, use it
      if (suggestion.location) {
        onLocationSelect({
          lat: suggestion.location.lat,
          lng: suggestion.location.lng,
          address:
            suggestion.location.formatted_address || suggestion.description,
          placeId: suggestion.place_id,
          addressComponents: suggestion.location.address_components,
        });
        setSearchQuery(suggestion.description);
        setLastSelectedQuery(suggestion.description); // Remember this selection
        setIsLoading(false);

        // Reset flag after a short delay to allow state updates
        setTimeout(() => {
          isSelectingRef.current = false;
        }, 100);
      } else {
        // Use PlacesService to get place details
        // We need a map div for PlacesService, create a temporary one
        const mapDiv = document.createElement("div");
        const placesService = new google.maps.places.PlacesService(mapDiv);

        const request: google.maps.places.PlaceDetailsRequest = {
          placeId: suggestion.place_id,
          fields: ["geometry", "formatted_address", "address_components"],
        };

        placesService.getDetails(request, (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            const lat = place.geometry?.location?.lat();
            const lng = place.geometry?.location?.lng();

            if (lat !== undefined && lng !== undefined) {
              onLocationSelect({
                lat,
                lng,
                address: place.formatted_address || suggestion.description,
                placeId: suggestion.place_id,
                addressComponents: place.address_components,
              });
              setSearchQuery(suggestion.description);
              setLastSelectedQuery(suggestion.description); // Remember this selection
            } else {
              setError(t("failedToGetLocation"));
            }
          } else {
            console.error("Place details request failed:", status);
            setError(t("failedToSelectLocation"));
          }
          setIsLoading(false);

          // Reset flag after a short delay
          setTimeout(() => {
            isSelectingRef.current = false;
          }, 100);
        });
      }
    } catch (err) {
      console.error("Error selecting location:", err);
      setError(t("failedToSelectLocation"));
      setIsLoading(false);

      // Reset flag on error
      setTimeout(() => {
        isSelectingRef.current = false;
      }, 100);
    }
  };

  // Format distance for display
  const formatDistance = (distance?: number | null): string => {
    if (distance === null || distance === undefined) return "";
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
        {/* Search Input */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => {
            const newValue = e.target.value;
            setSearchQuery(newValue);
            // Clear last selected query if user is typing something different
            if (lastSelectedQuery && newValue !== lastSelectedQuery) {
              setLastSelectedQuery(null);
            }
          }}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search
                  sx={{
                    color:
                      theme.palette.mode === "dark"
                        ? COLORS.TEXT.SECONDARY_DARK
                        : COLORS.TEXT.SECONDARY_LIGHT,
                  }}
                />
              </InputAdornment>
            ),
            endAdornment: isLoading && (
              <InputAdornment position="end">
                <LogoLoader size={20} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? COLORS.BACKGROUND.PAPER_DARK
                  : COLORS.WHITE,
              boxShadow: `0 2px 8px ${COLORS.SHADOW.DEFAULT}`,
              "& fieldset": {
                borderColor: COLORS.SHADOW.DEFAULT,
              },
              "&:hover fieldset": {
                borderColor: COLORS.PRIMARY_PURPLE,
              },
              "&.Mui-focused fieldset": {
                borderColor: COLORS.PRIMARY_PURPLE,
              },
            },
          }}
        />
      </Box>

      {/* Error Message */}
      {error && (
        <Typography
          variant="caption"
          sx={{
            color: COLORS.SECONDARY_ORANGE,
            display: "block",
            mb: 1,
          }}
        >
          {error}
        </Typography>
      )}

      {/* Suggestions List */}
      {showSuggestions && suggestions.length > 0 && (
        <Paper
          elevation={8}
          sx={{
            maxHeight: "300px",
            overflowY: "auto",
            borderRadius: "12px",
            backgroundColor:
              theme.palette.mode === "dark"
                ? COLORS.BACKGROUND.PAPER_DARK
                : COLORS.WHITE,
            boxShadow: `0 4px 16px ${COLORS.SHADOW.DEFAULT}`,
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: COLORS.SHADOW.DEFAULT,
              borderRadius: "4px",
            },
          }}
        >
          <List disablePadding>
            {suggestions.map((suggestion, index) => (
              <ListItem
                key={suggestion.place_id}
                disablePadding
                divider={index < suggestions.length - 1}
              >
                <ListItemButton
                  onClick={() => handleSuggestionClick(suggestion)}
                  sx={{
                    py: 1.5,
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? COLORS.PURPLE_ALPHA_10
                          : COLORS.PURPLE_ALPHA_04,
                    },
                  }}
                >
                  <Box
                    sx={{
                      mr: 2,
                      color:
                        theme.palette.mode === "dark"
                          ? COLORS.TEXT.SECONDARY_DARK
                          : COLORS.TEXT.SECONDARY_LIGHT,
                    }}
                  >
                    <Place />
                  </Box>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color:
                            theme.palette.mode === "dark"
                              ? COLORS.TEXT.PRIMARY_DARK
                              : COLORS.TEXT.PRIMARY_LIGHT,
                        }}
                      >
                        {suggestion.description}
                      </Typography>
                    }
                  />
                  {suggestion.distance !== null &&
                    suggestion.distance !== undefined && (
                      <Chip
                        icon={<MyLocation sx={{ fontSize: 16 }} />}
                        label={formatDistance(suggestion.distance)}
                        size="small"
                        sx={{
                          ml: 1,
                          backgroundColor: COLORS.PRIMARY_PURPLE,
                          color: COLORS.WHITE,
                          fontWeight: 600,
                          fontSize: "0.75rem",
                        }}
                      />
                    )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* No Results Message */}
      {showSuggestions &&
        !isLoading &&
        searchQuery.length >= 3 &&
        suggestions.length === 0 && (
          <Paper
            sx={{
              p: 2,
              borderRadius: "12px",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? COLORS.BACKGROUND.PAPER_DARK
                  : COLORS.BACKGROUND.PAPER_LIGHT,
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color:
                  theme.palette.mode === "dark"
                    ? COLORS.TEXT.SECONDARY_DARK
                    : COLORS.TEXT.SECONDARY_LIGHT,
              }}
            >
              {t("noLocationsFound")}
            </Typography>
          </Paper>
        )}
    </Box>
  );
};

export default MapSearchSuggestions;
