"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
} from "@mui/material";
import { useTranslate } from "@/hooks/useTranslate";
import Title from "@/components/auth/title";

const CookiePolicyView: React.FC = () => {
  const { t } = useTranslate();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Title
        title={t("cookiePolicy")}
        subtitle={t("lastUpdatedAt") + ": " + new Date().toLocaleDateString()}
      />

      <Box
        sx={{
          lineHeight: 1.7,
          color: "text.primary",
          "& h1": {
            fontSize: { xs: "1.75rem", md: "2.25rem" },
            fontWeight: 700,
            color: "text.primary",
            mt: { xs: 3, md: 4 },
            mb: { xs: 1.5, md: 2 },
            lineHeight: 1.3,
          },
          "& h2": {
            fontSize: { xs: "1.5rem", md: "1.875rem" },
            fontWeight: 600,
            color: "text.primary",
            mt: { xs: 2.5, md: 3.5 },
            mb: { xs: 1.25, md: 1.75 },
            lineHeight: 1.35,
          },
          "& h3": {
            fontSize: { xs: "1.25rem", md: "1.5rem" },
            fontWeight: 600,
            color: "text.primary",
            mt: { xs: 2, md: 3 },
            mb: { xs: 1, md: 1.5 },
            lineHeight: 1.4,
          },
          "& p": {
            fontSize: { xs: "0.9375rem", md: "1rem" },
            mb: { xs: 1.5, md: 2 },
            color: "text.secondary",
            lineHeight: 1.7,
          },
          "& ul, & ol": {
            mb: { xs: 2, md: 2.5 },
            pl: { xs: 2.5, md: 3 },
          },
          "& li": {
            fontSize: { xs: "0.9375rem", md: "1rem" },
            mb: { xs: 0.75, md: 1 },
            color: "text.secondary",
            lineHeight: 1.7,
            "& p": {
              mb: 0.5,
            },
          },
          "& a": {
            color: "primary.main",
            textDecoration: "underline",
            "&:hover": {
              color: "primary.dark",
            },
          },
          "& strong": {
            fontWeight: 600,
            color: "text.primary",
          },
          "& hr": {
            my: { xs: 2, md: 3 },
            borderColor: "divider",
          },
        }}
      >
        <Typography variant="h2" component="h2">
          {t("whatAreCookies")}
        </Typography>
        <Typography variant="body1" component="p">
          {t("cookiesDescription")}
        </Typography>

        <Typography variant="h2" component="h2">
          {t("howWeUseCookies")}
        </Typography>
        <Typography variant="body1" component="p">
          {t("cookiesUsageDescription")}
        </Typography>

        <Typography variant="h3" component="h3">
          {t("essentialCookies")}
        </Typography>
        <Typography variant="body1" component="p">
          {t("essentialCookiesDescription")}
        </Typography>

        <Typography variant="h3" component="h3">
          {t("analyticsCookies")}
        </Typography>
        <Typography variant="body1" component="p">
          {t("analyticsCookiesDescription")}
        </Typography>

        <Typography variant="h3" component="h3">
          {t("marketingCookies")}
        </Typography>
        <Typography variant="body1" component="p">
          {t("marketingCookiesDescription")}
        </Typography>

        <Typography variant="h3" component="h3">
          {t("preferenceCookies")}
        </Typography>
        <Typography variant="body1" component="p">
          {t("preferenceCookiesDescription")}
        </Typography>

        <Typography variant="h2" component="h2">
          {t("managingCookies")}
        </Typography>
        <Typography variant="body1" component="p">
          {t("managingCookiesDescription")}
        </Typography>

        <Typography variant="h2" component="h2">
          {t("thirdPartyCookies")}
        </Typography>
        <Typography variant="body1" component="p">
          {t("thirdPartyCookiesDescription")}
        </Typography>

        <Typography variant="h2" component="h2">
          {t("cookieConsent")}
        </Typography>
        <Typography variant="body1" component="p">
          {t("cookieConsentDescription")}
        </Typography>

        <Typography variant="h2" component="h2">
          {t("updatesToPolicy")}
        </Typography>
        <Typography variant="body1" component="p">
          {t("cookiePolicyUpdatesDescription")}
        </Typography>

        <Typography variant="h2" component="h2">
          {t("contactUs")}
        </Typography>
        <Typography variant="body1" component="p">
          {t("cookiePolicyContactDescription")}
        </Typography>
      </Box>
    </Container>
  );
};

export default CookiePolicyView;
