"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import {
  CheckCircle,
  TrendingUp,
  People,
  Payment,
  Analytics,
  Support,
  Security,
  Star,
} from "@mui/icons-material";
import { useTranslate } from "@/hooks/useTranslate";
import { COLORS } from "@/constants/colors";
import Title from "@/components/auth/title";
import { useRouter } from "next/navigation";

const BecomeServiceProviderView: React.FC = () => {
  const { t } = useTranslate();
  const theme = useTheme();
  const router = useRouter();
  const isDark = theme.palette.mode === "dark";

  const benefits = [
    {
      icon: <TrendingUp />,
      title: t("growYourBusiness"),
      description: t("growYourBusinessDesc"),
    },
    {
      icon: <People />,
      title: t("reachMoreCustomers"),
      description: t("reachMoreCustomersDesc"),
    },
    {
      icon: <Payment />,
      title: t("securePayments"),
      description: t("securePaymentsDesc"),
    },
    {
      icon: <Analytics />,
      title: t("businessInsights"),
      description: t("businessInsightsDesc"),
    },
    {
      icon: <Support />,
      title: t("dedicatedSupport"),
      description: t("dedicatedSupportDesc"),
    },
    {
      icon: <Security />,
      title: t("verifiedProfile"),
      description: t("verifiedProfileDesc"),
    },
  ];

  const requirements = [
    t("validBusinessLicense"),
    t("professionalExperience"),
    t("qualityServiceDelivery"),
    t("responsiveCustomerService"),
    t("complianceWithStandards"),
  ];

  const steps = [
    {
      step: "1",
      title: t("createAccount"),
      description: t("createAccountDesc"),
    },
    {
      step: "2",
      title: t("completeProfile"),
      description: t("completeProfileDesc"),
    },
    {
      step: "3",
      title: t("verifyDocuments"),
      description: t("verifyDocumentsDesc"),
    },
    {
      step: "4",
      title: t("startEarning"),
      description: t("startEarningDesc"),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Title
        title={t("becomeServiceProvider")}
        subtitle={t("becomeServiceProviderSubtitle")}
      />

      {/* Hero Section */}
      <Box
        sx={{
          textAlign: "center",
          mb: { xs: 5, md: 8 },
          px: { xs: 2, md: 0 },
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: "1.75rem", md: "2.5rem", lg: "3rem" },
            fontWeight: 700,
            mb: 2,
            color: isDark
              ? COLORS.TEXT.PRIMARY_DARK
              : COLORS.TEXT.PRIMARY_LIGHT,
          }}
        >
          {t("joinAsServiceProvider")}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "1rem", md: "1.125rem" },
            color: isDark
              ? COLORS.TEXT.SECONDARY_DARK
              : COLORS.TEXT.SECONDARY_LIGHT,
            maxWidth: "800px",
            mx: "auto",
            lineHeight: 1.7,
            mb: 4,
          }}
        >
          {t("becomeServiceProviderHero")}
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => router.push("/auth/signup?role=SERVICE_PROVIDER")}
          sx={{
            bgcolor: COLORS.PRIMARY_PURPLE,
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: 600,
            "&:hover": {
              bgcolor: COLORS.PRIMARY_PURPLE_DARK,
            },
          }}
        >
          {t("getStartedNow")}
        </Button>
      </Box>

      {/* Benefits Section */}
      <Box sx={{ mb: { xs: 5, md: 8 } }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "1.5rem", md: "2rem" },
            fontWeight: 600,
            mb: 4,
            textAlign: "center",
            color: isDark
              ? COLORS.TEXT.PRIMARY_DARK
              : COLORS.TEXT.PRIMARY_LIGHT,
          }}
        >
          {t("whyJoinAsProvider")}
        </Typography>
        <Grid container spacing={3}>
          {benefits.map((benefit, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: isDark
                    ? COLORS.BACKGROUND.PAPER_DARK
                    : COLORS.BACKGROUND.PAPER_LIGHT,
                  border: `1px solid ${
                    isDark
                      ? COLORS.BORDER.DEFAULT_DARK
                      : COLORS.BORDER.DEFAULT_LIGHT
                  }`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                    borderColor: COLORS.PRIMARY_PURPLE,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      color: COLORS.PRIMARY_PURPLE,
                      mb: 2,
                      "& svg": {
                        fontSize: "2.5rem",
                      },
                    }}
                  >
                    {benefit.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      fontSize: { xs: "1rem", md: "1.125rem" },
                      color: isDark
                        ? COLORS.TEXT.PRIMARY_DARK
                        : COLORS.TEXT.PRIMARY_LIGHT,
                    }}
                  >
                    {benefit.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDark
                        ? COLORS.TEXT.SECONDARY_DARK
                        : COLORS.TEXT.SECONDARY_LIGHT,
                      lineHeight: 1.6,
                    }}
                  >
                    {benefit.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* How It Works Section */}
      <Box
        sx={{
          bgcolor: isDark
            ? COLORS.BACKGROUND.SECONDARY_DARK
            : COLORS.PURPLE_ALPHA_10,
          borderRadius: 2,
          p: { xs: 3, md: 5 },
          mb: { xs: 5, md: 8 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "1.5rem", md: "2rem" },
            fontWeight: 600,
            mb: 4,
            textAlign: "center",
            color: isDark
              ? COLORS.TEXT.PRIMARY_DARK
              : COLORS.TEXT.PRIMARY_LIGHT,
          }}
        >
          {t("howItWorks")}
        </Typography>
        <Grid container spacing={3}>
          {steps.map((step, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    bgcolor: COLORS.PRIMARY_PURPLE,
                    color: COLORS.WHITE,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  {step.step}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    fontSize: { xs: "1rem", md: "1.125rem" },
                    color: isDark
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                  }}
                >
                  {step.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: isDark
                      ? COLORS.TEXT.SECONDARY_DARK
                      : COLORS.TEXT.SECONDARY_LIGHT,
                    lineHeight: 1.6,
                  }}
                >
                  {step.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Requirements Section */}
      <Box sx={{ mb: { xs: 5, md: 8 } }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "1.5rem", md: "2rem" },
            fontWeight: 600,
            mb: 4,
            textAlign: "center",
            color: isDark
              ? COLORS.TEXT.PRIMARY_DARK
              : COLORS.TEXT.PRIMARY_LIGHT,
          }}
        >
          {t("requirements")}
        </Typography>
        <Card
          sx={{
            bgcolor: isDark
              ? COLORS.BACKGROUND.PAPER_DARK
              : COLORS.BACKGROUND.PAPER_LIGHT,
            border: `1px solid ${
              isDark
                ? COLORS.BORDER.DEFAULT_DARK
                : COLORS.BORDER.DEFAULT_LIGHT
            }`,
            p: { xs: 3, md: 4 },
          }}
        >
          <List>
            {requirements.map((requirement, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <CheckCircle sx={{ color: COLORS.PRIMARY_PURPLE }} />
                </ListItemIcon>
                <ListItemText
                  primary={requirement}
                  primaryTypographyProps={{
                    sx: {
                      color: isDark
                        ? COLORS.TEXT.PRIMARY_DARK
                        : COLORS.TEXT.PRIMARY_LIGHT,
                      fontSize: { xs: "0.9375rem", md: "1rem" },
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Card>
      </Box>

      {/* Success Stories / Stats */}
      <Box
        sx={{
          bgcolor: isDark
            ? COLORS.BACKGROUND.SECONDARY_DARK
            : COLORS.PURPLE_ALPHA_10,
          borderRadius: 2,
          p: { xs: 3, md: 5 },
          mb: { xs: 5, md: 8 },
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <Star sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: "2rem" }} />
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: "1.5rem", md: "2rem" },
              fontWeight: 600,
              color: isDark
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
            }}
          >
            {t("joinThousands")}
          </Typography>
        </Box>
        <Typography
          variant="body1"
          sx={{
            color: isDark
              ? COLORS.TEXT.SECONDARY_DARK
              : COLORS.TEXT.SECONDARY_LIGHT,
            maxWidth: "700px",
            mx: "auto",
            lineHeight: 1.7,
          }}
        >
          {t("providerSuccessStory")}
        </Typography>
      </Box>

      {/* Final CTA */}
      <Box
        sx={{
          textAlign: "center",
          p: { xs: 3, md: 5 },
          bgcolor: isDark
            ? COLORS.BACKGROUND.PAPER_DARK
            : COLORS.BACKGROUND.PAPER_LIGHT,
          border: `2px solid ${COLORS.PRIMARY_PURPLE}`,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: "1.25rem", md: "1.75rem" },
            fontWeight: 600,
            mb: 2,
            color: isDark
              ? COLORS.TEXT.PRIMARY_DARK
              : COLORS.TEXT.PRIMARY_LIGHT,
          }}
        >
          {t("readyToStart")}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 3,
            color: isDark
              ? COLORS.TEXT.SECONDARY_DARK
              : COLORS.TEXT.SECONDARY_LIGHT,
          }}
        >
          {t("startYourJourney")}
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => router.push("/auth/signup?role=SERVICE_PROVIDER")}
          sx={{
            bgcolor: COLORS.PRIMARY_PURPLE,
            px: 5,
            py: 1.5,
            fontSize: "1.125rem",
            fontWeight: 600,
            "&:hover": {
              bgcolor: COLORS.PRIMARY_PURPLE_DARK,
            },
          }}
        >
          {t("registerNow")}
        </Button>
      </Box>
    </Container>
  );
};

export default BecomeServiceProviderView;
