"use client";
import React from "react";
import { CloseRounded, SearchRounded } from "@mui/icons-material";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import { COLORS } from "@/constants/colors";

interface ListSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  clearLabel: string;
}

/**
 * The compact search used above a list: a 40px pill, up to 320px wide on desktop and full width on phones.
 * Pages debounce it themselves, so it answers as you type. Escape or the clear button resets it.
 */
const ListSearchBar = ({
  value,
  onChange,
  placeholder,
  ariaLabel,
  clearLabel,
}: ListSearchBarProps) => (
  <Box
    component="form"
    role="search"
    onSubmit={(e) => e.preventDefault()}
    sx={{ width: "100%", maxWidth: { md: 320 } }}
  >
    <TextField
      fullWidth
      type="search"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Escape") onChange("");
      }}
      slotProps={{
        htmlInput: { "aria-label": ariaLabel, enterKeyHint: "search" },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchRounded sx={{ color: COLORS.TEXT.SECONDARY_LIGHT, fontSize: 20 }} />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton
                onClick={() => onChange("")}
                aria-label={clearLabel}
                edge="end"
                sx={{ width: 32, height: 32 }}
              >
                <CloseRounded sx={{ fontSize: 18 }} />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          minHeight: 40,
          fontSize: "0.875rem",
          borderRadius: "30px",
          bgcolor: COLORS.WHITE,
          pl: 1.5,
          "& fieldset": { borderColor: COLORS.NEW_UI.CARD_BORDER_HOVER_LIGHT },
          "&:hover fieldset": { borderColor: COLORS.PRIMARY_PURPLE },
          "&.Mui-focused fieldset": { borderColor: COLORS.PRIMARY_PURPLE, borderWidth: 2 },
        },
        // The browser's own clear icon is hidden: ours is always the same size.
        "& input[type=search]::-webkit-search-cancel-button": { display: "none" },
      }}
    />
  </Box>
);

export default ListSearchBar;
