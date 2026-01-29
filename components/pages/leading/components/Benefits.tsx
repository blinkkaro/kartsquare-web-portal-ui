import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Chip,
  Button,
} from "@mui/material";
import Link from "next/link";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { LISTING, getFreeListingBenefits, getBoostBenefits } from "./constants";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import Image from "next/image";

const Benefits = () => {
  const { t } = useTranslate();
  return (
    <Box sx={{ py: 8, bgcolor: "white" }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="overline"
            fontWeight={700}
            color="text.secondary"
            sx={{ letterSpacing: 1 }}
          >
            {t("forBusinessOwners")}
          </Typography>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ mt: 1, color: LISTING.text }}
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
                border: "12px solid #1a1a1a",
                borderRadius: "28px",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
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
            {/* <Box
              sx={{
                width: 260,
                mx: "auto",
                border: "12px solid #1a1a1a",
                borderRadius: "28px",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              }}
            >
              <Box sx={{ height: 400, bgcolor: "#fafafa", p: 2 }}>
                <Box sx={{ display: "flex", gap: 0.5, mb: 1.5 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      bgcolor: "#e8e8e8",
                    }}
                  />
                  <Box
                    sx={{
                      flex: 1,
                      height: 24,
                      borderRadius: 2,
                      bgcolor: "#e8e8e8",
                    }}
                  />
                </Box>
                <Box
                  sx={{ height: 220, borderRadius: 2, bgcolor: "#e8e8e8" }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1.5 }}
                >
                  Your business profile
                </Typography>
              </Box>
            </Box> */}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="overline"
              fontWeight={700}
              color="text.secondary"
              sx={{ letterSpacing: 1 }}
            >
              {t("yourFreeListingPage")}
            </Typography>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ mt: 1, mb: 2, color: LISTING.text }}
            >
              {t("oneProfileMoreVisibility")}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
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
                  sx={{ color: LISTING.success, fontSize: 24, mt: 0.25 }}
                />
                <Typography variant="body2" color="text.primary">
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
              color="text.secondary"
              sx={{ letterSpacing: 1 }}
            >
              {t("wantMoreLeads")}
            </Typography>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ mt: 1, mb: 2, color: LISTING.text }}
            >
              {t("getMoreVisibility")}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
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
                  sx={{ color: LISTING.success, fontSize: 24, mt: 0.25 }}
                />
                <Typography variant="body2" color="text.primary">
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
                bgcolor: LISTING.primary,
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
                border: "12px solid #1a1a1a",
                borderRadius: "28px",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
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
            {/* <Box
              sx={{
                width: 260,
                mx: "auto",
                border: "12px solid #1a1a1a",
                borderRadius: "28px",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              }}
            >
              <Box sx={{ height: 400, bgcolor: "#fafafa", p: 2 }}>
                <Box sx={{ display: "flex", gap: 0.5, mb: 1.5 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      bgcolor: "#e8e8e8",
                    }}
                  />
                  <Box
                    sx={{
                      flex: 1,
                      height: 24,
                      borderRadius: 2,
                      bgcolor: "#e8e8e8",
                    }}
                  />
                </Box>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: `1px solid ${LISTING.border}`,
                    mt: 1,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 0.5, mb: 1 }}>
                    {[1, 2, 3].map((i) => (
                      <Box
                        key={i}
                        sx={{
                          flex: 1,
                          height: 36,
                          borderRadius: 1,
                          bgcolor: "#e8e8e8",
                        }}
                      />
                    ))}
                  </Box>
                  <Box sx={{ display: "flex", gap: 0.5, mb: 0.5 }}>
                    <Chip
                      label="Top rated"
                      size="small"
                      sx={{ bgcolor: LISTING.bgSoft, fontSize: "0.7rem" }}
                    />
                    <Chip
                      label="Popular"
                      size="small"
                      sx={{
                        bgcolor: LISTING.primaryLight,
                        color: LISTING.primary,
                        fontSize: "0.7rem",
                      }}
                    />
                  </Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Sample business
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    <Chip
                      label="4.1 ★"
                      size="small"
                      sx={{
                        bgcolor: LISTING.success,
                        color: "white",
                        fontSize: "0.7rem",
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      9.1k ratings
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ mt: 0.5 }}
                  >
                    Location • Price for two • Years in business
                  </Typography>
                </Paper>
              </Box>
            </Box> */}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Benefits;
