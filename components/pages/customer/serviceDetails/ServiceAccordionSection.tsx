"use client";
import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { COLORS } from "../../../../constants/colors";

interface ServiceAccordionSectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const ServiceAccordionSection = ({
  title,
  icon,
  children,
  defaultExpanded,
}: ServiceAccordionSectionProps) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      disableGutters
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        backgroundImage: "none",
        border: "1px solid",
        borderColor: dark ? COLORS.NEW_UI.CARD_BORDER_DARK : COLORS.NEW_UI.CARD_BORDER_LIGHT,
        borderRadius: "16px !important",
        boxShadow: dark ? COLORS.NEW_UI.CARD_SHADOW_DARK : COLORS.NEW_UI.CARD_SHADOW_LIGHT,
        overflow: "hidden",
        transition: "border-color 180ms ease, box-shadow 180ms ease",
        "&:before": { display: "none" },
        "&.Mui-expanded": { margin: 0 },
        "&:hover": {
          borderColor: dark
            ? COLORS.NEW_UI.CARD_BORDER_HOVER_DARK
            : COLORS.NEW_UI.CARD_BORDER_HOVER_LIGHT,
        },
      }}
    >
      <AccordionSummary
        expandIcon={<KeyboardArrowDownRoundedIcon sx={{ color: "text.secondary" }} />}
        sx={{
          px: { xs: 2, sm: 2.5 },
          minHeight: 60,
          "&.Mui-expanded": { minHeight: 60 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          {icon && (
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: dark ? COLORS.NEW_UI.CHIP_BG_DARK : COLORS.PURPLE_ALPHA_10,
                color: dark ? COLORS.NEW_UI.ACCENT_TEXT_DARK : COLORS.PRIMARY_PURPLE,
              }}
            >
              {icon}
            </Box>
          )}
          <Typography
            component="h2"
            sx={{ fontWeight: 700, fontSize: "1rem", color: "text.primary" }}
          >
            {title}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ px: { xs: 2, sm: 2.5 }, pb: 2.5, pt: 0 }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

export default ServiceAccordionSection;
