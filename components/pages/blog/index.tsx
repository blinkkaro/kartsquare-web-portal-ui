"use client";

import React from "react";
import { Box, Typography, Container, Grid } from "@mui/material";
import BackButton from "@/components/common/BackButton";
import BlogCard from "./components/BlogCard";
import { useTranslationContext } from "@/features/i18n/TranslationContext";

// Dummy data based on the user's provided image
const DUMMY_BLOGS = Array(1).fill({
  id: "1",
  image:
    "https://plus.unsplash.com/premium_photo-1661963320607-aebac6fcb40d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  date: "Aug 10, 2023",
  title: "Exploring Culinary Delights",
  description:
    "Revitalize your senses and unwind with a rejuvenating experience that combines...",
});

function BlogView() {
  const { t } = useTranslationContext();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <BackButton sx={{ mb: 2 }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          {t("blogs")}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {DUMMY_BLOGS.map((item, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
            <BlogCard {...item} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default BlogView;
