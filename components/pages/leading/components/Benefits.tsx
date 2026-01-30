import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Chip,
  Button,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { getFreeListingBenefits, getBoostBenefits } from "./constants";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import Image from "next/image";

const Benefits = () => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{ py: 8, bgcolor: isDark ? COLORS.BACKGROUND.PRIMARY_DARK : "white" }}
    >
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="overline"
            fontWeight={700}
            color={isDark ? COLORS.TEXT.SECONDARY_DARK : "text.secondary"}
            sx={{ letterSpacing: 1 }}
          >
            {t("forBusinessOwners")}
          </Typography>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              mt: 1,
              color: isDark
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
            }}
          >
            {t("connectWithNewCustomers")}
          </Typography>
        </Box>

        {/* Free listing benefits */}
        <Grid container spacing={4} alignItems="center" sx={{ mb: 8 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                width: 260,
                height: 460,
                position: "relative",
                mx: "auto",
                border: `12px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "#1a1a1a"}`,
                borderRadius: "28px",
                overflow: "hidden",
                boxShadow: isDark ? "none" : "0 20px 40px rgba(0,0,0,0.1)",
              }}
            >
              <Image
                src="/userProfile.png"
                alt="User Profile"
                fill
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="overline"
              fontWeight={700}
              color={isDark ? COLORS.TEXT.SECONDARY_DARK : "text.secondary"}
              sx={{ letterSpacing: 1 }}
            >
              {t("yourFreeListingPage")}
            </Typography>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                mt: 1,
                mb: 2,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
              }}
            >
              {t("oneProfileMoreVisibility")}
            </Typography>
            <Typography
              variant="body1"
              color={isDark ? COLORS.TEXT.SECONDARY_DARK : "text.secondary"}
              sx={{ mb: 2 }}
            >
              {t("completeBusinessProfile")}
            </Typography>
            {getFreeListingBenefits(t).map((text: string, i: number) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  mb: 1.5,
                }}
              >
                <CheckCircleIcon
                  sx={{ color: COLORS.SUCCESS_GREEN, fontSize: 24, mt: 0.25 }}
                />
                <Typography
                  variant="body2"
                  color={isDark ? COLORS.TEXT.PRIMARY_DARK : "text.primary"}
                >
                  {text}
                </Typography>
              </Box>
            ))}
          </Grid>
        </Grid>

        {/* Boost visibility (optional) */}
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }} order={{ xs: 2, md: 1 }}>
            <Typography
              variant="overline"
              fontWeight={700}
              color={isDark ? COLORS.TEXT.SECONDARY_DARK : "text.secondary"}
              sx={{ letterSpacing: 1 }}
            >
              {t("wantMoreLeads")}
            </Typography>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                mt: 1,
                mb: 2,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
              }}
            >
              {t("getMoreVisibility")}
            </Typography>
            <Typography
              variant="body1"
              color={isDark ? COLORS.TEXT.SECONDARY_DARK : "text.secondary"}
              sx={{ mb: 2 }}
            >
              {t("promoteListingDesc")}
            </Typography>
            {getBoostBenefits(t).map((text: string, i: number) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  mb: 1.5,
                }}
              >
                <CheckCircleIcon
                  sx={{ color: COLORS.SUCCESS_GREEN, fontSize: 24, mt: 0.25 }}
                />
                <Typography
                  variant="body2"
                  color={isDark ? COLORS.TEXT.PRIMARY_DARK : "text.primary"}
                >
                  {text}
                </Typography>
              </Box>
            ))}
            <Button
              variant="contained"
              startIcon={<TrendingUpIcon />}
              href="/supplier/register"
              component={Link}
              sx={{
                mt: 2,
                bgcolor: COLORS.PRIMARY_PURPLE,
                "&:hover": { bgcolor: COLORS.PURPLE_HOVER },
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              {t("getStartedFree")}
            </Button>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} order={{ xs: 1, md: 2 }}>
            <Box
              sx={{
                width: 230,
                height: 460,
                mx: "auto",
                position: "relative",
                border: `12px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "#1a1a1a"}`,
                borderRadius: "28px",
                overflow: "hidden",
                boxShadow: isDark ? "none" : "0 20px 40px rgba(0,0,0,0.1)",
              }}
            >
              <Image
                src="/service.png"
                alt="Service Listing"
                fill
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Benefits;
