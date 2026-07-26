"use client";

import React, { useState } from "react";
import { Box, Typography, Tabs, Tab, Container, Grid } from "@mui/material";
import BackButton from "@/components/common/BackButton";
import PageHeading from "@/components/common/PageHeading";
import SavedCard from "./components/SavedCard";
import {
  useTranslationContext,
  TranslationKey,
} from "@/features/i18n/TranslationContext";

// Dummy data based on the user's provided image
const DUMMY_DATA = Array(8).fill({
  image:
    "https://plus.unsplash.com/premium_photo-1661963320607-aebac6fcb40d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Fallback or placeholder
  rating: 4.5,
  reviewCount: 396,
  category: "Beauty",
  title: "Haircut & Ayurveda Spa",
  description: "Revitalize your senses and unwind with a rejuvenating...",
  price: 50.0,
  providerName: "Turfa al-Shah",
  providerAvatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Placeholder user image
});

function SavedView() {
  const [value, setValue] = useState(0);
  const { t } = useTranslationContext();

  const tabKeys: TranslationKey[] = [
    "services",
    "products",
    "serviceProviders",
    "suppliers",
    "brands",
    "events",
    "blogs",
  ];

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <BackButton sx={{ mb: 2 }} />
        <PageHeading title={t("saved")} component="h1" sx={{ mb: 3 }} />

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="saved categories tabs"
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: "medium",
                fontSize: "1rem",
                minWidth: "auto",
                mr: 3,
                color: "text.secondary",
                "&.Mui-selected": {
                  color: "primary.main",
                  fontWeight: "bold",
                },
              },
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
            }}
          >
            {tabKeys.map((key, index) => (
              <Tab key={index} label={t(key)} />
            ))}
          </Tabs>
        </Box>
      </Box>

      <Box role="tabpanel" hidden={value !== 0}>
        {value === 0 && (
          <Grid container spacing={3}>
            {DUMMY_DATA.map((item, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                <SavedCard {...item} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Placeholders for other tabs */}
      {value !== 0 && (
        <Box sx={{ py: 4, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            {t("noItemsSaved")} {t(tabKeys[value])}
          </Typography>
        </Box>
      )}
    </Container>
  );
}

export default SavedView;
