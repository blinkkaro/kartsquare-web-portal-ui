import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { COLORS } from "@/constants/colors";
import { AIService } from "@/services/ai/aiInterface";

// Must match the other map components so the Google script loads once.
const LIBRARIES: "places"[] = ["places"];

interface Props {
  services: AIService[];
  selectedId: string | null;
  onSelect: (serviceId: string) => void;
  userCoords?: { latitude: number; longitude: number } | null;
  height?: number | string;
}

export const coordsOf = (s: AIService): { lat: number; lng: number } | null => {
  const lat = Number(s.service_address?.latitude);
  const lng = Number(s.service_address?.longitude);
  return Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0) ? { lat, lng } : null;
};

/** Map of the current AI results only. Markers and the list share one selected id. */
export default function AIResultsMap({ services, selectedId, onSelect, userCoords, height = 280 }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: apiKey, libraries: LIBRARIES });
  const mapRef = useRef<google.maps.Map | null>(null);

  const points = useMemo(
    () => services.map((s) => ({ s, pos: coordsOf(s) })).filter((p): p is { s: AIService; pos: { lat: number; lng: number } } => !!p.pos),
    [services]
  );

  const fit = useCallback(() => {
    const map = mapRef.current;
    if (!map || points.length === 0) return;
    if (points.length === 1) {
      map.setCenter(points[0].pos);
      map.setZoom(15);
      return;
    }
    const b = new google.maps.LatLngBounds();
    points.forEach((p) => b.extend(p.pos));
    if (userCoords) b.extend({ lat: userCoords.latitude, lng: userCoords.longitude });
    map.fitBounds(b, 40);
  }, [points, userCoords]);

  useEffect(fit, [fit]);

  // Selecting a provider from the list pans the map to its marker.
  useEffect(() => {
    const map = mapRef.current;
    const p = points.find((x) => x.s.service_id === selectedId);
    if (map && p) map.panTo(p.pos);
  }, [selectedId, points]);

  if (!apiKey || loadError) {
    return (
      <Box sx={{ height, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 3, bgcolor: COLORS.PURPLE_ALPHA_04 }}>
        <Typography sx={{ fontSize: "0.85rem", color: "text.secondary" }}>Map isn&apos;t available right now.</Typography>
      </Box>
    );
  }
  if (!isLoaded) return <Skeleton variant="rounded" height={height} sx={{ borderRadius: 3 }} />;

  return (
    <Box sx={{ height, borderRadius: 3, overflow: "hidden", border: `1px solid ${COLORS.PURPLE_ALPHA_10}` }}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={points[0]?.pos}
        zoom={13}
        onLoad={(m) => {
          mapRef.current = m;
          fit();
        }}
        onUnmount={() => {
          mapRef.current = null;
        }}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
          styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }],
        }}
      >
        {points.map(({ s, pos }) => {
          const selected = s.service_id === selectedId;
          return (
            <MarkerF
              key={s.service_id}
              position={pos}
              title={s.business_name || s.service_name}
              zIndex={selected ? 10 : 1}
              onClick={() => onSelect(s.service_id)}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: selected ? 12 : 8,
                fillColor: selected ? COLORS.PRIMARY_PURPLE : "#8b5cf6",
                fillOpacity: 1,
                strokeColor: "#fff",
                strokeWeight: selected ? 3 : 2,
              }}
            />
          );
        })}
        {userCoords && (
          <MarkerF
            position={{ lat: userCoords.latitude, lng: userCoords.longitude }}
            title="You"
            icon={{ path: google.maps.SymbolPath.CIRCLE, scale: 7, fillColor: COLORS.PRIMARY_BLUE, fillOpacity: 1, strokeColor: "#fff", strokeWeight: 2 }}
          />
        )}
      </GoogleMap>
    </Box>
  );
}
