"use client";
import React from "react";
import { Box, ButtonBase, Typography } from "@mui/material";
import { COLORS } from "@/constants/colors";

export interface FilterChipOption {
  key: string;
  label: string;
  count: number;
}

interface FilterChipsProps {
  options: FilterChipOption[];
  value: string;
  onChange: (key: string) => void;
  ariaLabel: string;
}

/** Status filters as pills with live counts. One is selected; they scroll sideways on a phone. */
const FilterChips = ({ options, value, onChange, ariaLabel }: FilterChipsProps) => (
  <Box
    role="group"
    aria-label={ariaLabel}
    sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 0.5 }}
  >
    {options.map((o) => {
      const selected = o.key === value;
      return (
        <ButtonBase
          key={o.key}
          onClick={() => onChange(o.key)}
          aria-pressed={selected}
          sx={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 1,
            minHeight: 44,
            px: 2,
            borderRadius: "30px",
            fontWeight: 600,
            bgcolor: selected ? COLORS.PRIMARY_PURPLE : COLORS.WHITE,
            color: selected ? COLORS.WHITE : COLORS.TEXT.PRIMARY_LIGHT,
            border: `1px solid ${selected ? COLORS.PRIMARY_PURPLE : COLORS.NEW_UI.CARD_BORDER_HOVER_LIGHT}`,
            transition: "background-color 200ms ease-out, border-color 200ms ease-out",
            "&:hover": { borderColor: COLORS.PRIMARY_PURPLE },
            "&.Mui-focusVisible": {
              outline: `3px solid ${COLORS.PRIMARY_PURPLE}`,
              outlineOffset: 2,
            },
          }}
        >
          <Typography variant="body2" component="span" sx={{ fontWeight: 600 }}>
            {o.label}
          </Typography>
          <Typography
            variant="caption"
            component="span"
            sx={{ fontVariantNumeric: "tabular-nums", opacity: selected ? 0.9 : 0.7 }}
          >
            {o.count}
          </Typography>
        </ButtonBase>
      );
    })}
  </Box>
);

export default FilterChips;
