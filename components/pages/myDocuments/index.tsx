"use client";

import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import BackButton from "@/components/common/BackButton";
import ProfileWrapper from "@/components/common/profile/profileWrapper";
import DocumentCard from "./components/DocumentCard";
import { useTranslationContext } from "@/features/i18n/TranslationContext";
import PageHeading from "@/components/common/PageHeading";

// Dummy data based on the user's provided image
const DUMMY_DOCUMENTS = [
  {
    image:
      "https://images.unsplash.com/photo-1637070155805-e6fbee6ec2cf?q=80&w=1498&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Placeholder for ID card front
    fileName: "ID.jpg",
    key: "frontSide",
  },
  {
    image:
      "https://images.unsplash.com/photo-1637070155805-e6fbee6ec2cf?q=80&w=1498&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Placeholder for ID card back, reused for now
    fileName: "ID.jpg",
    key: "backSide",
  },
];

function MyDocumentsView() {
  const { t } = useTranslationContext();

  return (
    <ProfileWrapper showBackButton>
      <Box sx={{ mb: 4 }}>
        <PageHeading title={t("myDocuments")} component="h1" />
      </Box>

      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {t("nationalIdCopy")}
        </Typography>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", letterSpacing: 1, mb: 3 }}
        >
          987 - 6543 - 2109876 - 5
        </Typography>

        <Box
          sx={{ borderBottom: "1px solid", borderColor: "divider", mb: 3 }}
        />

        <Grid container spacing={3}>
          {DUMMY_DOCUMENTS.map((doc, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <DocumentCard
                image={doc.image}
                fileName={doc.fileName}
                label={t(doc.key as any)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </ProfileWrapper>
  );
}

export default MyDocumentsView;
