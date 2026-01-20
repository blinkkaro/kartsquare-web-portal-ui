"use client";
import React from "react";
import {
  Box,
  TextField,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";

interface SearchBarProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslate();

  return (
    <Box
      component="form"
      onSubmit={onSearchSubmit}
      sx={{ minWidth: { xs: "100%", sm: "300px" } }}
    >
      <TextField
        fullWidth
        size="small"
        placeholder={t("search_services_placeholder")}
        value={searchInput}
        onChange={(e) => onSearchInputChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT }} />
            </InputAdornment>
          ),
        }}
        sx={{
          bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : COLORS.BACKGROUND.PRIMARY_LIGHT,
          borderRadius: "12px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            "& fieldset": {
              borderColor: isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT,
            },
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;