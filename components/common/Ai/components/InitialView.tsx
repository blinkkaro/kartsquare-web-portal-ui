import React, { useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  useTheme,
  Fade,
  Zoom,
  Typography,
  Chip,
} from "@mui/material";
import { Search, AutoAwesome } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";

interface InitialViewProps {
  onSearch: (query: string) => void;
  onSuggestionClick: (suggestion: string) => void;
  isLoading?: boolean;
}

export default function InitialView({
  onSearch,
  onSuggestionClick,
  isLoading,
}: InitialViewProps) {
  const theme = useTheme();
  const { t } = useTranslate();
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const suggestionChips = [
    t("plumber"),
    t("electrician"),
    t("cleaner"),
    t("gardener"),
    t("carpenter"),
    t("painter"),
  ];

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch(searchValue);
      setSearchValue("");
    }
  };

  const handleSearchClick = () => {
    onSearch(searchValue);
    setSearchValue("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        px: 3,
        pb: 3,
        overflowY: "auto",
      }}
    >
      {/* Animated Icon */}
      <Zoom in timeout={500}>
        <Box
          sx={{
            mb: 3,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background:
                theme.palette.mode === "dark"
                  ? COLORS.DARK_GRADIENT
                  : COLORS.PURPLECYAN,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "pulse 2s ease-in-out infinite",
              "@keyframes pulse": {
                "0%, 100%": {
                  transform: "scale(1)",
                  boxShadow: `0 0 20px ${COLORS.PRIMARY_PURPLE}40`,
                },
                "50%": {
                  transform: "scale(1.05)",
                  boxShadow: `0 0 40px ${COLORS.PRIMARY_PURPLE}60`,
                },
              },
            }}
          >
            <AutoAwesome
              sx={{
                fontSize: 40,
                color: COLORS.PRIMARY_PURPLE,
              }}
            />
          </Box>
        </Box>
      </Zoom>

      {/* Title */}
      <Fade in timeout={800}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 1,
            background:
              theme.palette.mode === "dark"
                ? `linear-gradient(135deg, ${COLORS.TEXT.PRIMARY_DARK} 0%, ${COLORS.PURPLE_ALPHA_20} 100%)`
                : `linear-gradient(135deg, ${COLORS.PRIMARY_PURPLE} 0%, ${COLORS.SECONDARY_ORANGE} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textAlign: "center",
          }}
        >
          {t("findYourServices")}
        </Typography>
      </Fade>

      {/* Subtitle */}
      <Fade in timeout={1000}>
        <Typography
          variant="body2"
          sx={{
            color:
              theme.palette.mode === "dark"
                ? COLORS.TEXT.SECONDARY_DARK
                : COLORS.TEXT.SECONDARY_LIGHT,
            mb: 3,
            textAlign: "center",
            maxWidth: 500,
          }}
        >
          {t("findYourServicesDescription")}
        </Typography>
      </Fade>

      {/* Search Input (Initial) */}
      <Fade in timeout={1200}>
        <Box sx={{ width: "100%", maxWidth: 600 }}>
          <TextField
            fullWidth
            placeholder={t("search_services_placeholder")}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search
                    sx={{
                      color: isFocused
                        ? COLORS.PRIMARY_PURPLE
                        : theme.palette.mode === "dark"
                          ? COLORS.TEXT.SECONDARY_DARK
                          : COLORS.TEXT.SECONDARY_LIGHT,
                      transition: "color 0.3s ease",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "50px",
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? COLORS.BACKGROUND.PRIMARY_DARK
                    : COLORS.WHITE,
                transition: "all 0.3s ease",
                boxShadow: isFocused
                  ? `0 8px 24px ${COLORS.PRIMARY_PURPLE}30`
                  : COLORS.SHADOW.LIGHT,
                "& fieldset": {
                  borderColor:
                    theme.palette.mode === "dark"
                      ? COLORS.BORDER.DEFAULT_DARK
                      : COLORS.BORDER.DEFAULT_LIGHT,
                  transition: "border-color 0.3s ease",
                },
                "&:hover fieldset": {
                  borderColor: COLORS.PRIMARY_PURPLE,
                },
                "&.Mui-focused fieldset": {
                  borderColor: COLORS.PRIMARY_PURPLE,
                  borderWidth: 2,
                },
              },
            }}
          />
        </Box>
      </Fade>

      {/* Suggestions (Initial) */}
      <Fade in timeout={1400}>
        <Box
          sx={{
            mt: 3,
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            justifyContent: "center",
            maxWidth: 600,
          }}
        >
          {suggestionChips.map((suggestion, index) => (
            <Zoom in timeout={1400 + index * 100} key={suggestion}>
              <Chip
                label={suggestion}
                onClick={() => {
                  setSearchValue(suggestion);
                  onSuggestionClick(suggestion);
                }}
                disabled={isLoading}
                sx={{
                  px: 2,
                  py: 2.5,
                  borderRadius: "25px",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? COLORS.BACKGROUND.PRIMARY_DARK
                      : COLORS.WHITE,
                  border: `1px solid ${
                    theme.palette.mode === "dark"
                      ? COLORS.BORDER.DEFAULT_DARK
                      : COLORS.BORDER.DEFAULT_LIGHT
                  }`,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: COLORS.PURPLE_ALPHA_10,
                    borderColor: COLORS.PRIMARY_PURPLE,
                    transform: "translateY(-2px)",
                    boxShadow: `0 4px 12px ${COLORS.PRIMARY_PURPLE}20`,
                  },
                  "& .MuiChip-label": {
                    color:
                      theme.palette.mode === "dark"
                        ? COLORS.TEXT.PRIMARY_DARK
                        : COLORS.TEXT.PRIMARY_LIGHT,
                    fontWeight: 500,
                    fontSize: "0.875rem",
                  },
                }}
              />
            </Zoom>
          ))}
        </Box>
      </Fade>
    </Box>
  );
}
