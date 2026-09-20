import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Chip, Popover, TextField, Typography, useTheme } from "@mui/material";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { COLORS } from "@/constants/colors";
import { AI_CITIES, AI_LOCALITIES } from "@/constants/aiSearch";
import { AILocation } from "../useAILocation";
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

/** Editable "📍 Jaipur" chip: change city, change locality, or use current location (opt-in). */
export default function LocationChip({ location, onChange, onUseCurrent, locating, error, disabled, openSignal }: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const chipRef = useRef<HTMLDivElement | null>(null);
  const tint = useTheme().palette.mode === "dark" ? "#d6b8ff" : COLORS.PRIMARY_PURPLE;
  const [city, setCity] = useState(location.city);
  const [locality, setLocality] = useState(location.locality ?? "");

  const openAt = (el: HTMLElement | null) => {
    setCity(location.city);
    setLocality(location.locality ?? "");
    setAnchor(el);
  };
  const open = (e: React.MouseEvent<HTMLElement>) => openAt(e.currentTarget);
  useEffect(() => {
    if (openSignal) openAt(chipRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openSignal]);
  const close = () => setAnchor(null);
  const apply = () => {
    onChange({ city: city.trim() || location.city, locality: locality.trim() || null, coords: null });
    close();
  };

  const label = location.coords
    ? `Near you · ${location.city}`
    : location.locality
      ? `${location.locality}, ${location.city}`
      : location.city;
  const suggestions = AI_LOCALITIES[city] || [];

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
          {locating ? "Finding you…" : "Use current location"}
        </Button>
        {error && (
          <Typography role="alert" sx={{ color: "error.main", fontSize: "0.75rem", mb: 1 }}>
            {error}
          </Typography>
        )}

        <Typography sx={{ fontSize: "0.72rem", color: "text.secondary", mb: 0.5 }}>City</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 1.5 }}>
          {AI_CITIES.map((c) => (
            <Chip
              key={c}
              label={c}
              size="small"
              clickable
              onClick={() => {
                setCity(c);
                if (c !== city) setLocality("");
              }}
              color={c === city ? "primary" : "default"}
              variant={c === city ? "filled" : "outlined"}
              sx={{ height: 30 }}
            />
          ))}
        </Box>

        <Typography sx={{ fontSize: "0.72rem", color: "text.secondary", mb: 0.5 }}>Area (optional)</Typography>
        <TextField
          fullWidth
          size="small"
          value={locality}
          onChange={(e) => setLocality(e.target.value)}
          placeholder="e.g. Mansarovar"
          onKeyDown={(e) => e.key === "Enter" && apply()}
          slotProps={{ htmlInput: { "aria-label": "Area or locality", style: { fontSize: 16 } } }}
        />
        {suggestions.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1 }}>
            {suggestions.slice(0, 6).map((l) => (
              <Chip key={l} label={l} size="small" clickable onClick={() => setLocality(l)} sx={{ height: 28 }} />
            ))}
          </Box>
        )}

        <Button
          fullWidth
          variant="contained"
          onClick={apply}
          sx={{ mt: 2, minHeight: MIN_TOUCH, textTransform: "none", fontWeight: 700, borderRadius: 2 }}
        >
          Apply
        </Button>
      </Popover>
    </>
  );
}
