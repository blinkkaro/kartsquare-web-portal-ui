"use client";
import React from "react";
import { Accordion, AccordionSummary, AccordionDetails, Box, Typography, useTheme } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
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
  const isDark = theme.palette.mode === "dark";

  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      disableGutters
      elevation={0}
      sx={{
        bgcolor: isDark ? "rgba(255, 255, 255, 0.05)" : "white",
        border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)"}`,
        borderRadius: "16px !important",
        boxShadow: isDark ? "none" : "0 1px 3px rgba(30, 20, 60, 0.05), 0 8px 24px rgba(30, 20, 60, 0.04)",
        "&:before": { display: "none" },
        "&.Mui-expanded": { margin: 0 },
      }}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMore
            sx={{
              color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
            }}
          />
        }
        sx={{
          px: 2.5,
          py: 0.5,
          minHeight: 60,
          "&.Mui-expanded": { minHeight: 60 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          {icon && (
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: "9px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: isDark ? "rgba(130, 72, 247, 0.16)" : COLORS.PURPLE_ALPHA_10,
                color: isDark ? COLORS.ACCENT_BLUE_DARK : COLORS.PRIMARY_PURPLE,
              }}
            >
              {icon}
            </Box>
          )}
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.05rem",
              color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
            }}
          >
            {title}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

export default ServiceAccordionSection;
