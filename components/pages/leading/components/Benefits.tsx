"use client";

import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import { getFreeListingBenefits, getBoostBenefits } from "./constants";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import Image from "next/image";

const BLUE = COLORS.BUSINESS_PROFILE_BLUE;
const BLUE_HOVER = COLORS.BUSINESS_PROFILE_BLUE_HOVER;

const Benefits = () => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const takeChargeItems = [
    {
      title: t("addEssentialInfo"),
      desc: t("addEssentialInfoDesc"),
      Icon: InfoOutlinedIcon,
    },
    {
      title: t("sharePhotosLogos"),
      desc: t("sharePhotosLogosDesc"),
      Icon: PhotoCameraOutlinedIcon,
    },
    {
      title: t("showWhoYouAre"),
      desc: t("showWhoYouAreDesc"),
      Icon: BadgeOutlinedIcon,
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : "#f8f9fa",
      }}
    >
      <Container maxWidth="xl">
        {/* Take charge of your first impression — Google-style */}
        <Box sx={{ mb: { xs: 8, md: 12 } }}>
          <Typography
            variant="h4"
            component="h2"
            fontWeight={400}
            sx={{
              color: isDark ? COLORS.TEXT.PRIMARY_DARK : "#202124",
              fontSize: { xs: "1.5rem", md: "1.75rem" },
              textAlign: "center",
              mb: 1,
            }}
          >
            {t("takeChargeTitle")}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: isDark ? COLORS.TEXT.SECONDARY_DARK : "#5f6368",
              textAlign: "center",
              maxWidth: 560,
              mx: "auto",
              mb: { xs: 4, md: 6 },
              lineHeight: 1.6,
            }}
          >
            {t("takeChargeSubtext")}
          </Typography>
          <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
            {takeChargeItems.map((item, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i}>
                <Box
                  sx={{
                    height: "100%",
                    p: 3,
                    borderRadius: 2,
                    bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "#fff",
                    border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "#dadce0"}`,
                    boxShadow: isDark ? "none" : "0 1px 2px rgba(60,64,67,.3)",
                    transition: "box-shadow 0.2s ease",
                    "&:hover": {
                      boxShadow: isDark ? "none" : "0 2px 6px rgba(60,64,67,.15)",
                    },
                  }}
                >
                  <item.Icon
                    sx={{
                      fontSize: 40,
                      color: BLUE,
                      mb: 1.5,
                    }}
                  />
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      fontSize: "1rem",
                      color: isDark ? COLORS.TEXT.PRIMARY_DARK : "#202124",
                      mb: 1,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDark ? COLORS.TEXT.SECONDARY_DARK : "#5f6368",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Easily connect with customers */}
        <Box sx={{ mb: { xs: 8, md: 12 } }}>
          <Typography
            variant="h4"
            component="h2"
            fontWeight={400}
            sx={{
              color: isDark ? COLORS.TEXT.PRIMARY_DARK : "#202124",
              fontSize: { xs: "1.5rem", md: "1.75rem" },
              textAlign: "center",
              mb: 1,
            }}
          >
            {t("connectWithCustomersTitle")}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: isDark ? COLORS.TEXT.SECONDARY_DARK : "#5f6368",
              textAlign: "center",
              maxWidth: 560,
              mx: "auto",
              mb: { xs: 4, md: 6 },
              lineHeight: 1.6,
            }}
          >
            {t("connectWithCustomersSubtext")}
          </Typography>
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "#fff",
                  border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "#dadce0"}`,
                  boxShadow: isDark ? "none" : "0 1px 2px rgba(60,64,67,.3)",
                }}
              >
                <Typography
                  variant="overline"
                  fontWeight={700}
                  sx={{
                    color: BLUE,
                    letterSpacing: 1.2,
                    display: "block",
                    mb: 1,
                  }}
                >
                  {t("yourFreeListingPage")}
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    mt: 0.75,
                    mb: 1.5,
                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : "#202124",
                    fontSize: "1.125rem",
                  }}
                >
                  {t("oneProfileMoreVisibility")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : "#5f6368",
                    mb: 2,
                    lineHeight: 1.6,
                  }}
                >
                  {t("completeBusinessProfile")}
                </Typography>
                <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
                  {getFreeListingBenefits(t).map((text: string, i: number) => (
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
                      <CheckCircleIcon
                        sx={{
                          color: "#34a853",
                          fontSize: 22,
                          flexShrink: 0,
                          mt: 0.15,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: isDark ? COLORS.TEXT.PRIMARY_DARK : "text.primary",
                          fontWeight: 500,
                          lineHeight: 1.5,
                        }}
                      >
                        {text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 280, sm: 340 },
                  position: "relative",
                  borderRadius: 2,
                  overflow: "hidden",
                  border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "#dadce0"}`,
                }}
              >
                <Image
                  src="/businessProfile.png"
                  alt="Business profile"
                  fill
                  style={{ objectFit: "contain", objectPosition: "center top" }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Want more visibility — optional CTA */}
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }} order={{ xs: 2, md: 1 }}>
            <Box sx={{ maxWidth: 480 }}>
              <Typography
                variant="overline"
                fontWeight={700}
                sx={{ color: BLUE, letterSpacing: 1.2, display: "block", mb: 1 }}
              >
                {t("wantMoreLeads")}
              </Typography>
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  mt: 0.75,
                  mb: 1.5,
                  color: isDark ? COLORS.TEXT.PRIMARY_DARK : "#202124",
                  letterSpacing: "-0.02em",
                }}
              >
                {t("getMoreVisibility")}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: isDark ? COLORS.TEXT.SECONDARY_DARK : "#5f6368",
                  mb: 2,
                  lineHeight: 1.6,
                }}
              >
                {t("promoteListingDesc")}
              </Typography>
              <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none", mb: 3 }}>
                {getBoostBenefits(t).map((text: string, i: number) => (
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
                    <CheckCircleIcon
                      sx={{
                        color: "#34a853",
                        fontSize: 22,
                        flexShrink: 0,
                        mt: 0.15,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDark ? COLORS.TEXT.PRIMARY_DARK : "text.primary",
                        fontWeight: 500,
                      }}
                    >
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
                  bgcolor: BLUE,
                  "&:hover": { bgcolor: BLUE_HOVER, boxShadow: "none" },
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3.5,
                  py: 1.5,
                  borderRadius: 1,
                  boxShadow: "none",
                }}
              >
                {t("getStartedFree")}
              </Button>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} order={{ xs: 1, md: 2 }}>
            <Box
              sx={{
                width: "100%",
                height: { xs: 260, sm: 320 },
                position: "relative",
                borderRadius: 2,
                overflow: "hidden",
                border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "#dadce0"}`,
              }}
            >
              <Image
                src="/serviceProfile.png"
                alt="Promoted listing"
                fill
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Benefits;
