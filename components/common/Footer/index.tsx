"use client";

import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  useTheme,
  IconButton,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  Language,
} from "@mui/icons-material";
import { COLORS } from "@/constants/colors";
import { useTranslate } from "@/hooks/useTranslate";
import { useRouter } from "next/navigation";
import NavLogo from "../Nav/components/NavLogo";

const Footer: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslate();
  const router = useRouter();
  const isDark = theme.palette.mode === "dark";
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: t("aboutUs"), href: "https://www.kartsquare.com/en/aboutus" },
      { label: t("careers"), href: "/careers" },
      { label: t("blogs"), href: "/blogs" },
      { label: t("contactUs"), href: "/contactUs" },
    ],
    services: [
      { label: t("services"), href: "/cus/servicesList" },
      //   { label: t("events"), href: "/events" },
      { label: t("store"), href: "/store" },
      { label: t("becomeServiceProvider"), href: "/supplier/register" },
    ],
    support: [
      // { label: t("helpSupport"), href: "/myAccount/helpSupport" },
      { label: t("faqs"), href: "/myAccount/FAQ" },
    ],
    legal: [
      { label: t("privacy_policy"), href: "/privacyPolicy" },
      { label: t("termsConditions"), href: "/termsConditions" },
      { label: t("cookiePolicy"), href: "/cookie-policy" },
    ],
  };

  const socialLinks = [
    { icon: <Facebook />, href: "https://www.facebook.com/people/Kart-Square/61586897253749/", label: "Facebook" },
    { icon: <Instagram />, href: "https://www.instagram.com/kartsquare/", label: "Instagram" },
    { icon: <LinkedIn />, href: "https://www.linkedin.com/company/kartsquare", label: "LinkedIn" },
    { icon: <YouTube />, href: "https://www.youtube.com/@kartsquare", label: "YouTube" },
  ];

  // Gradient definitions for light and dark modes with subtle brand color accent
  const footerGradient = isDark
    ? `linear-gradient(180deg, ${COLORS.BACKGROUND.SECONDARY_DARK} 0%, ${COLORS.BACKGROUND.PAPER_DARK} 50%, ${COLORS.BACKGROUND.PRIMARY_DARK} 100%)`
    : `linear-gradient(180deg, ${COLORS.BACKGROUND.SECONDARY_LIGHT} 0%, ${COLORS.BACKGROUND.PRIMARY_LIGHT} 50%, ${COLORS.LIGHT_GRAY} 100%)`;

  return (
    <Box
      component="footer"
      sx={{
        // mt: 2,
        background: footerGradient,
        borderTop: `1px solid ${
          isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT
        }`,
        pt: { xs: 4, md: 6 },
        pb: { xs: 3, md: 4 },
        position: "relative",
        "&::before": {
          content: '""',
          // position: "absolute",
          position: "relative",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: isDark
            ? `linear-gradient(90deg, transparent 0%, ${COLORS.PRIMARY_PURPLE}40 50%, transparent 100%)`
            : `linear-gradient(90deg, transparent 0%, ${COLORS.PURPLE_ALPHA_20} 50%, transparent 100%)`,
        },
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* Company Info & Logo */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                  cursor: "pointer",
                }}
                onClick={() => router.push("/")}
              >
                <NavLogo isMobile={false} mode={isDark ? "dark" : "light"} />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: isDark
                    ? COLORS.TEXT.SECONDARY_DARK
                    : COLORS.TEXT.SECONDARY_LIGHT,
                  mb: 2,
                  lineHeight: 1.6,
                }}
              >
                {t("brand_tagline")}
              </Typography>
              {/* Social Media Links */}
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    size="small"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: isDark
                        ? COLORS.TEXT.SECONDARY_DARK
                        : COLORS.TEXT.SECONDARY_LIGHT,
                      border: `1px solid ${
                        isDark
                          ? COLORS.BORDER.DEFAULT_DARK
                          : COLORS.BORDER.DEFAULT_LIGHT
                      }`,
                      "&:hover": {
                        color: COLORS.PRIMARY_PURPLE,
                        borderColor: COLORS.PRIMARY_PURPLE,
                        bgcolor: isDark
                          ? COLORS.BACKGROUND.SECONDARY_DARK
                          : COLORS.PURPLE_ALPHA_10,
                      },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Company Links */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
                mb: 2,
                fontSize: "0.875rem",
                textTransform: "uppercase",
              }}
            >
              {t("company")}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {footerLinks.company.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(link.href);
                  }}
                  sx={{
                    color: isDark
                      ? COLORS.TEXT.SECONDARY_DARK
                      : COLORS.TEXT.SECONDARY_LIGHT,
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color: COLORS.PRIMARY_PURPLE,
                      textDecoration: "underline",
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Services Links */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
                mb: 2,
                fontSize: "0.875rem",
                textTransform: "uppercase",
              }}
            >
              {t("services")}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {footerLinks.services.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(link.href);
                  }}
                  sx={{
                    color: isDark
                      ? COLORS.TEXT.SECONDARY_DARK
                      : COLORS.TEXT.SECONDARY_LIGHT,
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color: COLORS.PRIMARY_PURPLE,
                      textDecoration: "underline",
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Support Links */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
                mb: 2,
                fontSize: "0.875rem",
                textTransform: "uppercase",
              }}
            >
              {t("support")}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {footerLinks.support.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(link.href);
                  }}
                  sx={{
                    color: isDark
                      ? COLORS.TEXT.SECONDARY_DARK
                      : COLORS.TEXT.SECONDARY_LIGHT,
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color: COLORS.PRIMARY_PURPLE,
                      textDecoration: "underline",
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Legal Links */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
                mb: 2,
                fontSize: "0.875rem",
                textTransform: "uppercase",
              }}
            >
              {t("legal")}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {footerLinks.legal.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(link.href);
                  }}
                  sx={{
                    color: isDark
                      ? COLORS.TEXT.SECONDARY_DARK
                      : COLORS.TEXT.SECONDARY_LIGHT,
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color: COLORS.PRIMARY_PURPLE,
                      textDecoration: "underline",
                    },
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider
          sx={{
            my: { xs: 3, md: 4 },
            borderColor: isDark
              ? COLORS.BORDER.DEFAULT_DARK
              : COLORS.BORDER.DEFAULT_LIGHT,
          }}
        />

        {/* Bottom Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: isDark
                ? COLORS.TEXT.SECONDARY_DARK
                : COLORS.TEXT.SECONDARY_LIGHT,
              fontSize: "0.875rem",
            }}
          >
            © {currentYear} KartSquare. {t("allRightsReserved")}.
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: isDark
                  ? COLORS.TEXT.SECONDARY_DARK
                  : COLORS.TEXT.SECONDARY_LIGHT,
                cursor: "pointer",
                "&:hover": {
                  color: COLORS.PRIMARY_PURPLE,
                },
              }}
            >
              <Language sx={{ fontSize: 18 }} />
              <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                English (US)
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
