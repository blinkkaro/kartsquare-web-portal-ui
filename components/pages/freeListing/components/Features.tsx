"use client";

import React from "react";
import { Box, Typography, Container, Grid, Paper } from "@mui/material";
import { COLORS } from "@/constants/colors";
import { freeListingData } from "@/data/freeListingData";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Features = () => {
  return (
    <Box sx={{ bgcolor: COLORS.WHITE }}>
      <Box sx={{ padding: "2rem" }}>
        <Typography
          variant="h4"
          align="center"
          sx={{
            mb: { xs: 4, md: 8 },
            fontWeight: 700,
            color: COLORS.TEXT.PRIMARY_LIGHT,
            fontSize: { xs: "1.75rem", md: "2.125rem" },
          }}
        >
          Get a FREE Business Listing in 4 Simple Steps
        </Typography>

        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {freeListingData.steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <Grid size={{ xs: 12, md: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    position: "relative",
                    mb: { xs: 4, md: 0 }, // Add margin bottom on mobile to separate steps
                    py: 2,
                    borderRadius: "16px",
                    transition: "background-color 0.2s",
                    "&:hover": {
                      bgcolor: {
                        xs: "transparent",
                        md: COLORS.PURPLE_ALPHA_04,
                      },
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={step.icon}
                    alt={step.title}
                    sx={{
                      width: "100%",
                      maxWidth: { xs: 120, md: 160, lg: 500 }, // Reduced max width for cleaner look
                      height: { xs: 120, md: 160, lg: 300 }, // Fixed height
                      objectFit: "cover",
                      borderRadius: "12px",
                      mb: 3,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: COLORS.TEXT.SECONDARY_LIGHT,
                      mb: 1,
                      display: "block",
                      width: "100%",
                      textAlign: "left", // Keep left alignment as per design reference
                      pl: { xs: 2, md: 0 }, // Add slight padding on mobile
                    }}
                  >
                    Step {step.id}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      width: "100%",
                      textAlign: "left",
                      pl: { xs: 2, md: 0 },
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      width: "100%",
                      textAlign: "left",
                      pl: { xs: 2, md: 0 },
                    }}
                  >
                    {step.description}
                  </Typography>
                </Box>
              </Grid>

              {/* Arrow Separator (Desktop only) */}
              {index < freeListingData.steps.length - 1 && (
                <Grid
                  size={{ md: 1 }}
                  sx={{
                    display: { xs: "none", md: "flex" },
                    justifyContent: "center",
                  }}
                >
                  <Box sx={{ color: COLORS.PRIMARY_PURPLE, opacity: 0.5 }}>
                    »»»
                  </Box>
                </Grid>
              )}
            </React.Fragment>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Features;
