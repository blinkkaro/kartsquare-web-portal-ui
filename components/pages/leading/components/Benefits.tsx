import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SearchIcon from "@mui/icons-material/Search";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { getFreeListingBenefits, getBoostBenefits } from "./constants";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import Image from "next/image";

const Benefits = () => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const freeListingIcons = [
    VerifiedUserIcon,
    SearchIcon,
    DashboardIcon,
  ];

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.BACKGROUND.SECONDARY_LIGHT,
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 }, maxWidth: 640, mx: "auto" }}>
          <Typography
            variant="overline"
            fontWeight={700}
            color={COLORS.PRIMARY_PURPLE}
            sx={{
              letterSpacing: 1.5,
              display: "block",
              mb: 1,
            }}
          >
            {t("forBusinessOwners")}
          </Typography>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              color: isDark
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
              fontSize: { xs: "1.75rem", md: "2rem" },
              letterSpacing: "-0.02em",
              lineHeight: 1.25,
            }}
          >
            {t("connectWithNewCustomers")}
          </Typography>
          <Typography
            variant="body1"
            color={isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT}
            sx={{ mt: 1.5, lineHeight: 1.6 }}
          >
            Register once. Reach more customers. Grow your business.
          </Typography>
        </Box>

        {/* Free listing benefits — card + value props */}
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center" sx={{ mb: { xs: 8, md: 12 } }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                overflow: "hidden",
                borderRadius: 3,
                border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.1)"}`,
                bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
                boxShadow: isDark ? "none" : "0 8px 32px rgba(94, 24, 233, 0.06)",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 320, sm: 380 },
                  position: "relative",
                  borderBottom: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.08)"}`,
                }}
              >
                <Image
                  src="/userProfile.png"
                  alt="Business profile on platform"
                  fill
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                />
              </Box>
              <Box sx={{ p: { xs: 2.5, md: 3 } }}>
                <Typography
                  variant="overline"
                  fontWeight={700}
                  color={COLORS.PRIMARY_PURPLE}
                  sx={{ letterSpacing: 1.2 }}
                >
                  {t("yourFreeListingPage")}
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    mt: 0.75,
                    mb: 1.5,
                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                    fontSize: "1.125rem",
                  }}
                >
                  {t("oneProfileMoreVisibility")}
                </Typography>
                <Typography
                  variant="body2"
                  color={isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT}
                  sx={{ mb: 2, lineHeight: 1.6 }}
                >
                  {t("completeBusinessProfile")}
                </Typography>
                <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
                  {getFreeListingBenefits(t).map((text: string, i: number) => {
                    const Icon = freeListingIcons[i] || CheckCircleIcon;
                    return (
                      <Box
                        key={i}
                        component="li"
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1.5,
                          mb: 1.25,
                        }}
                      >
                        <Icon
                          sx={{
                            color: COLORS.SUCCESS_GREEN,
                            fontSize: 22,
                            flexShrink: 0,
                            mt: 0.15,
                          }}
                        />
                        <Typography
                          variant="body2"
                          color={isDark ? COLORS.TEXT.PRIMARY_DARK : "text.primary"}
                          sx={{ fontWeight: 500, lineHeight: 1.5 }}
                        >
                          {text}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ maxWidth: 480 }}>
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                  mb: 2,
                  letterSpacing: "-0.02em",
                }}
              >
                Why businesses register with us
              </Typography>
              <Typography
                variant="body1"
                color={isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT}
                sx={{ mb: 3, lineHeight: 1.7 }}
              >
                A verified listing builds trust, improves discoverability, and gives you full control over how customers see your business — all from one dashboard.
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                }}
              >
                {[
                  { title: "Trust & credibility", desc: "Verified badge and complete profile increase customer confidence." },
                  { title: "Discoverability", desc: "Show up when customers search for your services in your area." },
                  { title: "One dashboard", desc: "Update hours, photos, and info anytime. No technical skills needed." },
                ].map((item, i) => (
                  <Paper
                    key={i}
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.08)"}`,
                      bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
                      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        borderColor: COLORS.PRIMARY_PURPLE,
                        boxShadow: isDark ? "none" : "0 4px 16px rgba(94, 24, 233, 0.08)",
                      },
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={700} color={isDark ? COLORS.TEXT.PRIMARY_DARK : "text.primary"} sx={{ mb: 0.5 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color={isDark ? COLORS.TEXT.SECONDARY_DARK : "text.secondary"}>
                      {item.desc}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Boost visibility (optional) */}
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }} order={{ xs: 2, md: 1 }}>
            <Box sx={{ maxWidth: 480 }}>
              <Typography
                variant="overline"
                fontWeight={700}
                color={COLORS.PRIMARY_PURPLE}
                sx={{ letterSpacing: 1.2 }}
              >
                {t("wantMoreLeads")}
              </Typography>
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  mt: 0.75,
                  mb: 1.5,
                  color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                  letterSpacing: "-0.02em",
                }}
              >
                {t("getMoreVisibility")}
              </Typography>
              <Typography
                variant="body1"
                color={isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT}
                sx={{ mb: 2, lineHeight: 1.6 }}
              >
                {t("promoteListingDesc")}
              </Typography>
              <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none", mb: 3 }}>
                {getBoostBenefits(t).map((text: string, i: number) => (
                  <Box
                    key={i}
                    component="li"
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 1.25 }}
                  >
                    <CheckCircleIcon sx={{ color: COLORS.SUCCESS_GREEN, fontSize: 22, flexShrink: 0, mt: 0.15 }} />
                    <Typography variant="body2" color={isDark ? COLORS.TEXT.PRIMARY_DARK : "text.primary"} sx={{ fontWeight: 500 }}>
                      {text}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Button
                variant="contained"
                startIcon={<TrendingUpIcon />}
                href="/supplier/register"
                component={Link}
                sx={{
                  bgcolor: COLORS.PRIMARY_PURPLE,
                  "&:hover": {
                    bgcolor: COLORS.PURPLE_HOVER,
                    boxShadow: "0 6px 20px rgba(94, 24, 233, 0.4)",
                  },
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3.5,
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: "0 4px 14px rgba(94, 24, 233, 0.35)",
                  transition: "all 0.2s ease",
                }}
              >
                {t("getStartedFree")}
              </Button>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} order={{ xs: 1, md: 2 }}>
            <Paper
              elevation={0}
              sx={{
                overflow: "hidden",
                borderRadius: 3,
                border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.1)"}`,
                bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
                boxShadow: isDark ? "none" : "0 8px 32px rgba(94, 24, 233, 0.06)",
              }}
            >
              <Box sx={{ width: "100%", height: { xs: 280, sm: 360 }, position: "relative" }}>
                <Image
                  src="/service.png"
                  alt="Promoted listing"
                  fill
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Benefits;
