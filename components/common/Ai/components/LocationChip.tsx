import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Chip, Popover, TextField, Typography, useTheme } from "@mui/material";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { COLORS } from "@/constants/colors";
import { AILocation, placeLabel } from "../useAILocation";
import { listActiveCities, resolveText } from "@/services/location/locationClient";
import type { PublicLocation } from "@/services/location/locationService";
import { MIN_TOUCH } from "./motion";

interface Props {
  location: AILocation;
  onChange: (next: AILocation) => void;
  onUseCurrent: () => void;
  locating: boolean;
  error: string | null;
  disabled?: boolean;
  /** Increment to open the editor from elsewhere (e.g. a "Search another location" button) */
  openSignal?: number;
}

/**
 * Editable location chip: use the exact current location, or type an area,
 * city or pincode. Typed text is resolved by the backend to a real place, and
 * that place's centre becomes the point results are searched around.
 */
export default function LocationChip({ location, onChange, onUseCurrent, locating, error, disabled, openSignal }: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const chipRef = useRef<HTMLDivElement | null>(null);
  const tint = useTheme().palette.mode === "dark" ? COLORS.NEW_UI.CHIP_TEXT_DARK : COLORS.PRIMARY_PURPLE;
  const [query, setQuery] = useState("");
  const [resolving, setResolving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [cities, setCities] = useState<PublicLocation[]>([]);

  const openAt = (el: HTMLElement | null) => {
    setQuery("");
    setNotFound(false);
    setAnchor(el);
  };
  const open = (e: React.MouseEvent<HTMLElement>) => openAt(e.currentTarget);
  useEffect(() => {
    if (openSignal) openAt(chipRef.current);
  }, [openSignal]);
  const close = () => setAnchor(null);

  // Live cities as suggestions only — loaded the first time the picker opens.
  useEffect(() => {
    if (!anchor || cities.length > 0) return;
    let cancelled = false;
    listActiveCities().then((rows) => {
      if (!cancelled) setCities(rows);
    });
    return () => {
      cancelled = true;
    };
  }, [anchor, cities.length]);

  const pick = async (text: string) => {
    const q = text.trim();
    if (!q || resolving) return;
    setResolving(true);
    setNotFound(false);
    const place = await resolveText(q);
    setResolving(false);
    const point = place?.location;
    if (!point || point.latitude == null || point.longitude == null) {
      setNotFound(true);
      return;
    }
    onChange({
      city: place.city?.name ?? (point.kind === "city" ? point.name : null),
      locality: point.kind === "locality" ? point.name : null,
      coords: { latitude: point.latitude, longitude: point.longitude },
      source: "picked",
    });
    close();
  };

  // While the position and its area name are being worked out, show one loading
  // label; then the final place ("Jhotwara, Jaipur"). "Near you" only when GPS
  // worked but no known city matched.
  const label = locating
    ? "Finding your location…"
    : location.coords
      ? location.source === "gps" && !location.locality && !location.city
        ? "Near you"
        : placeLabel(location)
      : "Set your location";

  return (
    <>
      <Chip
        ref={chipRef}
        icon={<LocationOnRoundedIcon sx={{ fontSize: 16 }} />}
        deleteIcon={<KeyboardArrowDownRoundedIcon />}
        onDelete={open}
        onClick={open}
        disabled={disabled}
        label={label}
        aria-label={`Location: ${label}. Change location`}
        sx={{
          height: 32,
          maxWidth: "100%",
          // Stable width so swapping "Finding your location…" / "Jaipur" / "Alwar" doesn't shift neighbours
          minWidth: 112,
          "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
          fontWeight: 600,
          fontSize: "0.78rem",
          bgcolor: COLORS.PURPLE_ALPHA_10,
          color: tint,
          "& .MuiChip-icon": { color: tint },
          "& .MuiChip-deleteIcon": { color: tint },
          // 44px hit area without changing the visual size
          position: "relative",
          "&::after": { content: '""', position: "absolute", inset: `-${(MIN_TOUCH - 32) / 2}px 0` },
        }}
      />
      <Popover
        open={!!anchor}
        anchorEl={anchor}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        slotProps={{ paper: { sx: { p: 2, width: 300, maxWidth: "calc(100vw - 32px)", borderRadius: 3 } } }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", mb: 1 }}>Where do you need the service?</Typography>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<MyLocationRoundedIcon />}
          disabled={locating}
          onClick={() => {
            onUseCurrent();
            close();
          }}
          sx={{ minHeight: MIN_TOUCH, textTransform: "none", fontWeight: 600, mb: 1.5, borderRadius: 2 }}
        >
          {locating ? "Finding you…" : "Use my current location"}
        </Button>
        {error && (
          <Typography role="alert" sx={{ color: "error.main", fontSize: "0.75rem", mb: 1 }}>
            {error}
          </Typography>
        )}

        <Typography sx={{ fontSize: "0.72rem", color: "text.secondary", mb: 0.5 }}>Or search an area, city or pincode</Typography>
        <TextField
          fullWidth
          size="small"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setNotFound(false);
          }}
          placeholder="Area, city or pincode"
          onKeyDown={(e) => e.key === "Enter" && pick(query)}
          error={notFound}
          helperText={notFound ? "We couldn't find that place. Try a nearby area or city." : undefined}
          slotProps={{ htmlInput: { "aria-label": "Area, city or pincode", style: { fontSize: 16 } } }}
        />

        {cities.length > 0 && (
          <>
            <Typography sx={{ fontSize: "0.72rem", color: "text.secondary", mt: 1.5, mb: 0.5 }}>Cities on Kartsquare</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {cities.map((c) => (
                <Chip
                  key={c.id}
                  label={c.name}
                  size="small"
                  clickable
                  disabled={resolving}
                  onClick={() => pick(c.name)}
                  sx={{ height: 30 }}
                />
              ))}
            </Box>
          </>
        )}

        <Button
          fullWidth
          variant="contained"
          disabled={!query.trim() || resolving}
          onClick={() => pick(query)}
          sx={{ mt: 2, minHeight: MIN_TOUCH, textTransform: "none", fontWeight: 700, borderRadius: 2 }}
        >
          {resolving ? "Finding…" : "Apply"}
        </Button>
      </Popover>
    </>
  );
}
