"use client";

import React from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import {
  Box,
  Typography,
  Button,
  InputBase,
  Skeleton,
  useTheme,
} from "@mui/material";
import MyLocationRoundedIcon from "@mui/icons-material/MyLocationRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { openAiWithQuery } from "@/features/ui/uiSlice";
import { COLORS } from "@/constants/colors";
import { RELATED_CATEGORIES_FOR_EMPTY } from "../servicesSampleData";

interface ServicesLoadingSkeletonProps {
  count?: number;
}

export const ServicesLoadingSkeleton: React.FC<ServicesLoadingSkeletonProps> = ({
  count = 3,
}) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2.5, width: "100%" }}
      aria-label="Loading services"
      role="status"
    >
      {Array.from({ length: count }).map((_, i) => (
        <Box
          key={i}
          sx={{
            bgcolor: "background.paper",
            borderRadius: "16px",
            border: "1px solid",
            borderColor: dark ? "rgba(255,255,255,0.08)" : "#ede9f2",
            p: 2.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2.5,
            }}
          >
            {/* Avatar & cover placeholder */}
            <Skeleton
              variant="rounded"
              width={220}
              height={160}
              sx={{
                borderRadius: "12px",
                width: { xs: "100%", sm: 220 },
                height: { xs: 180, sm: 160 },
                flexShrink: 0,
              }}
            />

            {/* Info placeholder */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Skeleton variant="text" width={180} height={28} />
                <Skeleton variant="circular" width={18} height={18} />
              </Box>
              <Skeleton variant="text" width={220} height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="90%" height={20} sx={{ mb: 2 }} />

              {/* Recent works placeholder */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Skeleton variant="rounded" width={42} height={42} sx={{ borderRadius: "8px" }} />
                <Skeleton variant="rounded" width={42} height={42} sx={{ borderRadius: "8px" }} />
                <Skeleton variant="rounded" width={42} height={42} sx={{ borderRadius: "8px" }} />
                <Skeleton variant="text" width={100} height={22} sx={{ ml: 1 }} />
              </Box>
            </Box>

            {/* Price & action placeholder */}
            <Box
              sx={{
                width: { xs: "100%", sm: 160 },
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "stretch", sm: "flex-end" },
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                <Skeleton variant="text" width={70} height={16} />
                <Skeleton variant="text" width={100} height={32} />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%" }}>
                <Skeleton variant="rounded" height={38} sx={{ borderRadius: "10px" }} />
                <Skeleton variant="text" height={24} sx={{ width: "60%", mx: "auto" }} />
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

interface ServicesEmptyStateProps {
  categoryName?: string;
  cityName?: string;
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
  /** What the person typed, if anything: handed to Kart AI so it can understand Hinglish and typos. */
  searchText?: string;
}

export const ServicesEmptyState: React.FC<ServicesEmptyStateProps> = ({
  categoryName = "electricians",
  cityName,
  onResetFilters,
  hasActiveFilters = false,
  searchText,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const dark = theme.palette.mode === "dark";
  const aiQuery = (searchText?.trim() || [categoryName, cityName].filter(Boolean).join(" ")).trim();

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: "20px",
        border: "1px solid",
        borderColor: dark ? "rgba(255,255,255,0.08)" : "#ede9f2",
        p: { xs: 4, sm: 6 },
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "16px",
          bgcolor: dark ? "rgba(245,158,11,0.15)" : "#fef3c7",
          color: "#d97706",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 2.5,
          border: "1px solid",
          borderColor: dark ? "rgba(245,158,11,0.25)" : "#fde68a",
        }}
      >
        <SearchOffRoundedIcon sx={{ fontSize: 32 }} />
      </Box>

      <Typography
        component="h3"
        sx={{
          fontSize: { xs: "1.25rem", sm: "1.45rem" },
          fontWeight: 700,
          color: "text.primary",
          letterSpacing: "-0.01em",
          mb: 1,
        }}
      >
        No {categoryName} found {cityName ? `in ${cityName}` : ""} matching your filters
      </Typography>

      <Typography
        sx={{
          fontSize: "0.92rem",
          color: "text.secondary",
          maxWidth: 520,
          mx: "auto",
          lineHeight: 1.6,
          mb: 3,
        }}
      >
        {hasActiveFilters
          ? "Try clearing some filters, widening your rating range, or expanding your search to all nearby localities."
          : `We couldn't find active verified ${categoryName} in this area right now. Browse related services or explore all categories.`}
      </Typography>

      {hasActiveFilters && onResetFilters && (
        <Button
          variant="contained"
          onClick={onResetFilters}
          startIcon={<RefreshRoundedIcon sx={{ fontSize: 18 }} />}
          sx={{
            bgcolor: dark ? "#ffffff" : "#1e1b2e",
            color: dark ? "#1e1b2e" : "#ffffff",
            borderRadius: "12px",
            px: 3,
            py: 1,
            fontWeight: 700,
            textTransform: "none",
            "&:hover": {
              bgcolor: dark ? "#e2e0e8" : "#0f0d17",
            },
          }}
        >
          Reset all filters
        </Button>
      )}

      {aiQuery && (
        <Button
          variant="outlined"
          onClick={() => dispatch(openAiWithQuery(aiQuery))}
          startIcon={<AutoAwesomeRoundedIcon sx={{ fontSize: 18 }} />}
          sx={{
            ml: hasActiveFilters && onResetFilters ? 1.5 : 0,
            mt: hasActiveFilters && onResetFilters ? { xs: 1.5, sm: 0 } : 0,
            borderRadius: "12px",
            px: 3,
            py: 1,
            fontWeight: 700,
            textTransform: "none",
            borderColor: COLORS.PRIMARY_PURPLE,
            color: COLORS.PRIMARY_PURPLE,
          }}
        >
          Ask Kart AI to find it
        </Button>
      )}

      {/* Related categories */}
      <Box sx={{ mt: 4, pt: 4, borderTop: "1px solid", borderColor: dark ? "rgba(255,255,255,0.06)" : "#ede9f2" }}>
        <Typography
          sx={{
            fontSize: "0.74rem",
            fontWeight: 700,
            color: "text.secondary",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            mb: 2,
          }}
        >
          Popular related categories {cityName ? `in ${cityName}` : ""}
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 1 }}>
          {RELATED_CATEGORIES_FOR_EMPTY.map((cat) => (
            <Box
              key={cat.name}
              component={Link}
              href={cat.path}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: 2,
                py: 0.75,
                borderRadius: "999px",
                border: "1px solid",
                borderColor: dark ? "rgba(255,255,255,0.12)" : "#e2deea",
                bgcolor: dark ? "rgba(255,255,255,0.03)" : "#faf8fc",
                color: "text.primary",
                textDecoration: "none",
                fontSize: "0.82rem",
                fontWeight: 600,
                transition: "all 0.18s ease",
                "&:hover": {
                  borderColor: COLORS.PRIMARY_PURPLE,
                  color: COLORS.PRIMARY_PURPLE,
                  bgcolor: dark ? "rgba(130,72,247,0.1)" : "#f3effa",
                },
              }}
            >
              <span>{cat.name}</span>
              <ArrowForwardRoundedIcon sx={{ fontSize: 13, color: "text.secondary" }} />
            </Box>
          ))}
        </Box>
      </Box>

      {/* Merchant / Provider Callout */}
      <Box
        sx={{
          mt: 4,
          p: 2.5,
          borderRadius: "14px",
          bgcolor: dark ? "rgba(130,72,247,0.08)" : "#f6f2fc",
          border: "1px solid",
          borderColor: dark ? "rgba(130,72,247,0.2)" : "#e8dff7",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
          textAlign: "left",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "0.92rem",
              fontWeight: 700,
              color: "text.primary",
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 0.25,
            }}
          >
            <AddCircleOutlineRoundedIcon sx={{ fontSize: 18, color: COLORS.PRIMARY_PURPLE }} />
            Run a business or provide services here?
          </Typography>
          <Typography sx={{ fontSize: "0.82rem", color: "text.secondary" }}>
            List your business on Kartsquare for free and start receiving verified customer leads today.
          </Typography>
        </Box>
        <Button
          component={Link}
          href="/auth/register"
          variant="contained"
          endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 15 }} />}
          sx={{
            bgcolor: COLORS.PRIMARY_PURPLE,
            color: "#ffffff",
            borderRadius: "10px",
            px: 2.5,
            py: 0.8,
            fontSize: "0.82rem",
            fontWeight: 700,
            textTransform: "none",
            whiteSpace: "nowrap",
            boxShadow: "none",
            "&:hover": {
              bgcolor: COLORS.PURPLE_HOVER,
            },
          }}
        >
          List your business
        </Button>
      </Box>
    </Box>
  );
};

interface ServicesErrorStateProps {
  categoryName?: string;
  cityName?: string;
  onRetry?: () => void;
}

export const ServicesErrorState: React.FC<ServicesErrorStateProps> = ({
  categoryName = "services",
  cityName,
  onRetry,
}) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: "20px",
        border: "1px solid",
        borderColor: dark ? "rgba(239,68,68,0.2)" : "#fee2e2",
        p: { xs: 4, sm: 6 },
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "16px",
          bgcolor: dark ? "rgba(239,68,68,0.15)" : "#fee2e2",
          color: "#dc2626",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 2.5,
          border: "1px solid",
          borderColor: dark ? "rgba(239,68,68,0.25)" : "#fecaca",
        }}
      >
        <WarningAmberRoundedIcon sx={{ fontSize: 32 }} />
      </Box>

      <Typography
        component="h3"
        sx={{
          fontSize: { xs: "1.25rem", sm: "1.45rem" },
          fontWeight: 700,
          color: "text.primary",
          letterSpacing: "-0.01em",
          mb: 1,
        }}
      >
        Couldn&apos;t load {categoryName} {cityName ? `in ${cityName}` : ""}
      </Typography>

      <Typography
        sx={{
          fontSize: "0.92rem",
          color: "text.secondary",
          maxWidth: 480,
          mx: "auto",
          lineHeight: 1.6,
          mb: 3,
        }}
      >
        Something went wrong while connecting to our servers. Your connection might be unstable, or our team is updating services.
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 1.5 }}>
        {onRetry && (
          <Button
            variant="contained"
            onClick={onRetry}
            startIcon={<RefreshRoundedIcon sx={{ fontSize: 18 }} />}
            sx={{
              bgcolor: dark ? "#ffffff" : "#1e1b2e",
              color: dark ? "#1e1b2e" : "#ffffff",
              borderRadius: "12px",
              px: 3,
              py: 1,
              fontWeight: 700,
              textTransform: "none",
              "&:hover": {
                bgcolor: dark ? "#e2e0e8" : "#0f0d17",
              },
            }}
          >
            Try again
          </Button>
        )}
        <Button
          component={Link}
          href="/"
          variant="outlined"
          sx={{
            borderColor: dark ? "rgba(255,255,255,0.15)" : "#e2deea",
            color: "text.primary",
            borderRadius: "12px",
            px: 3,
            py: 1,
            fontWeight: 700,
            textTransform: "none",
            "&:hover": {
              borderColor: COLORS.PRIMARY_PURPLE,
              color: COLORS.PRIMARY_PURPLE,
            },
          }}
        >
          Browse all categories
        </Button>
      </Box>
    </Box>
  );
};

interface ServicesLocationPromptProps {
  categoryName?: string;
  onUseMyLocation: () => void;
  onSubmitPlace: (text: string) => void;
  locating?: boolean;
}

/**
 * Shown when we don't know where the user is. Results are always around the
 * user's own location, so instead of guessing a city the page asks.
 */
export const ServicesLocationPrompt: React.FC<ServicesLocationPromptProps> = ({
  categoryName,
  onUseMyLocation,
  onSubmitPlace,
  locating = false,
}) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  const [place, setPlace] = React.useState("");
  const subject = categoryName ? categoryName.toLowerCase() : "services";

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRadius: "20px",
        border: "1px solid",
        borderColor: dark ? COLORS.NEW_UI.CARD_BORDER_DARK : COLORS.NEW_UI.CARD_BORDER_LIGHT,
        p: { xs: 4, sm: 6 },
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "16px",
          bgcolor: dark ? COLORS.NEW_UI.CHIP_BG_DARK : COLORS.PURPLE_ALPHA_10,
          color: dark ? COLORS.NEW_UI.ACCENT_TEXT_DARK : COLORS.PRIMARY_PURPLE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 2.5,
        }}
      >
        <PlaceRoundedIcon sx={{ fontSize: 32 }} />
      </Box>

      <Typography
        component="h3"
        sx={{
          fontSize: { xs: "1.25rem", sm: "1.45rem" },
          fontWeight: 700,
          color: "text.primary",
          letterSpacing: "-0.01em",
          mb: 1,
        }}
      >
        Where do you need {subject}?
      </Typography>

      <Typography
        sx={{
          fontSize: "0.92rem",
          color: "text.secondary",
          maxWidth: 480,
          mx: "auto",
          lineHeight: 1.6,
          mb: 3,
        }}
      >
        We show providers who serve your exact location. Share your location, or type your area, city or pincode.
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, maxWidth: 420, mx: "auto" }}>
        <Button
          variant="contained"
          fullWidth
          onClick={onUseMyLocation}
          disabled={locating}
          startIcon={<MyLocationRoundedIcon sx={{ fontSize: 18 }} />}
          sx={{
            bgcolor: COLORS.PRIMARY_PURPLE,
            color: COLORS.WHITE,
            borderRadius: "10px",
            py: 1.1,
            fontWeight: 700,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": { bgcolor: COLORS.PURPLE_HOVER, boxShadow: COLORS.NEW_UI.BUTTON_SHADOW_HOVER },
          }}
        >
          {locating ? "Finding your location…" : "Use my current location"}
        </Button>

        <Box
          component="form"
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            if (place.trim()) onSubmitPlace(place);
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            gap: 1,
            p: "4px 4px 4px 14px",
            borderRadius: "12px",
            border: "1.5px solid",
            borderColor: dark ? COLORS.NEW_UI.DIVIDER_DARK : COLORS.NEW_UI.DIVIDER_LIGHT,
            bgcolor: "background.paper",
          }}
        >
          <PlaceRoundedIcon sx={{ color: dark ? COLORS.NEW_UI.ACCENT_TEXT_DARK : COLORS.PRIMARY_PURPLE, fontSize: 19 }} />
          <InputBase
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="Area, city or pincode"
            inputProps={{ "aria-label": "Area, city or pincode" }}
            sx={{ flex: 1, fontSize: "0.9rem", fontWeight: 500, color: "text.primary", "& input": { p: 0 } }}
          />
          <Button
            type="submit"
            variant="outlined"
            disabled={!place.trim() || locating}
            sx={{
              borderColor: dark ? COLORS.NEW_UI.OUTLINE_DARK : COLORS.NEW_UI.OUTLINE_LIGHT,
              color: "text.primary",
              borderRadius: "10px",
              px: 2,
              py: 0.6,
              fontWeight: 700,
              fontSize: "0.85rem",
              textTransform: "none",
              flexShrink: 0,
              "&:hover": { borderColor: COLORS.PRIMARY_PURPLE, color: COLORS.PRIMARY_PURPLE },
            }}
          >
            Search
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
