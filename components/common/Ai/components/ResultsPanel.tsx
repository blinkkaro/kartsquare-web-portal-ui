import React, { useMemo, useRef, useState } from "react";
import { Box, Skeleton, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import { COLORS } from "@/constants/colors";
import { AIService } from "@/services/ai/aiInterface";
import AIProviderCard from "./AIProviderCard";
import AIResultsMap, { coordsOf } from "./AIResultsMap";
import { MIN_TOUCH, reducedMotion } from "./motion";

interface Props {
  services: AIService[];
  requestedLocality?: string | null;
  userCoords?: { latitude: number; longitude: number } | null;
  onViewProfile: (s: AIService) => void;
}

export function ResultsSkeleton() {
  return (
    <Box aria-hidden sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
      {[0, 1].map((i) => (
        <Box key={i} sx={{ p: 1.5, borderRadius: 3, border: `1px solid ${COLORS.PURPLE_ALPHA_10}`, bgcolor: "background.paper" }}>
          <Box sx={{ display: "flex", gap: 1.25 }}>
            <Skeleton variant="rounded" width={52} height={52} sx={{ ...reducedMotion }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="60%" height={20} />
              <Skeleton width="80%" height={16} />
            </Box>
          </Box>
          <Skeleton width="45%" height={18} sx={{ mt: 1 }} />
          <Skeleton variant="rounded" height={44} sx={{ mt: 1.25 }} />
        </Box>
      ))}
    </Box>
  );
}

/** List / Map toggle over one shared selection. Map only mounts when asked for (no blank map before results). */
export default function ResultsPanel({ services, requestedLocality, userCoords, onViewProfile }: Props) {
  const [view, setView] = useState<"list" | "map">("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const mappable = useMemo(() => services.filter((s) => coordsOf(s)).length, [services]);

  // A new result set starts fresh because the parent keys this panel by message id.
  // Marker click -> bring its card into view.
  const select = (id: string) => {
    setSelectedId(id);
    cardRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  const cards = (compact: boolean) =>
    services.map((s) => (
      <AIProviderCard
        key={s.service_id}
        ref={(el) => {
          cardRefs.current[s.service_id] = el;
        }}
        service={s}
        compact={compact}
        selected={selectedId === s.service_id}
        requestedLocality={requestedLocality}
        onSelect={() => select(s.service_id)}
        onViewProfile={() => onViewProfile(s)}
      />
    ));

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }} aria-live="polite">
          {services.length} {services.length === 1 ? "provider" : "providers"}
        </Typography>
        {mappable > 0 && (
          <ToggleButtonGroup
            exclusive
            size="small"
            value={view}
            onChange={(_, v) => v && setView(v)}
            aria-label="Results view"
            sx={{ "& .MuiToggleButton-root": { minHeight: MIN_TOUCH, minWidth: MIN_TOUCH, px: 1.5, textTransform: "none", fontWeight: 600, "&.Mui-selected": { color: COLORS.PRIMARY_PURPLE, bgcolor: COLORS.PURPLE_ALPHA_10 } } }}
          >
            <ToggleButton value="list" aria-label="List view">
              <ViewListRoundedIcon sx={{ fontSize: 18, mr: 0.5 }} /> List
            </ToggleButton>
            <ToggleButton value="map" aria-label="Map view">
              <MapRoundedIcon sx={{ fontSize: 18, mr: 0.5 }} /> Map
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      </Box>

      {view === "map" && mappable > 0 ? (
        <Box>
          <AIResultsMap services={services} selectedId={selectedId} onSelect={select} userCoords={userCoords} height={260} />
          {/* Results sheet under the map: snap-scrolls, tracks the selected marker */}
          <Box
            sx={{
              display: "flex",
              gap: 1.25,
              mt: 1.25,
              pb: 0.5,
              overflowX: "auto",
              scrollSnapType: "x proximity",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {cards(true)}
          </Box>
          {mappable < services.length && (
            <Typography sx={{ fontSize: "0.72rem", color: "text.disabled", mt: 0.5 }}>
              {services.length - mappable} provider{services.length - mappable === 1 ? "" : "s"} without a map location are in the list view.
            </Typography>
          )}
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>{cards(false)}</Box>
      )}
    </Box>
  );
}
