import React from "react";
import {
  Box,
  Typography,
  Grid,
  Container,
  Paper,
  Chip,
  Button,
  useTheme,
  CircularProgress,
  MenuItem,
  keyframes,
} from "@mui/material";
import ShieldIcon from "@mui/icons-material/Shield";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getHeroBenefits, getStatCards } from "./constants";
import { COLORS } from "@/constants/colors";
import Image from "next/image";
import { useTranslate } from "@/hooks/useTranslate";
import { useLeadVerification } from "@/hooks/useLeadVerification";
import VerificationModal from "./VerificationModal";
import { countries } from "../../SignUp/components/data";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@/components/common/Input";

const heroSchema = (t: any) =>
  yup.object().shape({
    phone_number: yup
      .string()
      .required(t("phoneNumberRequired"))
      .length(10, t("phoneNumberLength"))
      .matches(/^[0-9]+$/, t("phoneNumberInvalid")),
    country_code: yup.string().required(t("countryCodeRequired")),
  });

type HeroFormData = {
  phone_number: string;
  country_code: string;
};

const chipPulse = keyframes`
  0%, 100% { box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 0 0 0 rgba(94, 24, 233, 0.25); }
  50% { box-shadow: 0 2px 8px rgba(94, 24, 233, 0.15), 0 0 0 6px rgba(94, 24, 233, 0); }
`;

const formGlow = keyframes`
  0%, 100% { opacity: 0.6; filter: blur(20px); transform: scale(1); }
  50% { opacity: 1; filter: blur(24px); transform: scale(1.05); }
`;

const Hero: React.FC = () => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const {
    loading,
    isOtpOpen,
    error,
    handleCheckUser,
    handleVerifyOtp,
    closeOtpModal,
  } = useLeadVerification();

  const { control, handleSubmit } = useForm<HeroFormData>({
    resolver: yupResolver(heroSchema(t)),
    defaultValues: {
      phone_number: "",
      country_code: "+91",
    },
  });

  const onSubmit = (data: HeroFormData) => {
    handleCheckUser({
      phone_number: data.phone_number,
      country_code: data.country_code,
      source: "WEB",
      source_type: "SERVICE_PROVIDER",
    });
  };

  return (
    <Box
      sx={{
        py: { xs: 6, sm: 8, md: 10 },
        px: { xs: 2, md: 4 },
        background: isDark
          ? COLORS.DARK_GRADIENT
          : "linear-gradient(160deg, #f8f6ff 0%, #eef4ff 50%, #f5f0ff 100%)",
        borderRadius: { xs: 0, md: 0 },
        mx: 0,
        position: "relative",
        overflow: "hidden",
        "&::before": isDark
          ? {}
          : {
              content: '""',
              position: "absolute",
              top: "-40%",
              right: "-20%",
              width: "60%",
              height: "80%",
              background: "radial-gradient(circle, rgba(94, 24, 233, 0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            },
      }}
    >
      <Container maxWidth="xl" sx={{ position: "relative" }}>
        <Grid container spacing={{ xs: 4, lg: 6 }} alignItems="center">
          <Grid size={{ xs: 12, lg: 6 }}>
            <Chip
              icon={<ShieldIcon sx={{ fontSize: 18 }} />}
              label={t("freeForever")}
              size="small"
              sx={{
                mb: 2,
                bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
                color: COLORS.PRIMARY_PURPLE,
                fontWeight: 600,
                boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
                border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.12)"}`,
                "& .MuiChip-icon": { color: COLORS.PRIMARY_PURPLE },
                animation: isDark ? "none" : `${chipPulse} 2.5s ease-in-out infinite`,
              }}
            />
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                color: isDark
                  ? COLORS.TEXT.PRIMARY_DARK
                  : COLORS.TEXT.PRIMARY_LIGHT,
                lineHeight: 1.15,
                mb: 1.5,
                letterSpacing: "-0.02em",
                fontSize: { xs: "1.875rem", sm: "2.25rem", md: "2.75rem" },
              }}
            >
              {t("growYourBusinessWith")}{" "}
              <Box
                component="span"
                sx={{
                  color: COLORS.PRIMARY_PURPLE,
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 2,
                    left: 0,
                    right: 0,
                    height: 6,
                    background: "rgba(94, 24, 233, 0.2)",
                    borderRadius: 1,
                    zIndex: -1,
                  },
                }}
              >
                {t("freeListing")}
              </Box>
            </Typography>
            <Typography
              variant="h6"
              color={isDark ? COLORS.TEXT.SECONDARY_DARK : "text.secondary"}
              sx={{
                mb: 3,
                fontWeight: 500,
                fontSize: "1rem",
                lineHeight: 1.6,
                maxWidth: 480,
              }}
            >
              {t("joinThousandsBusinessOwners")}
            </Typography>

            <ErrorMessage isVisible={!!error} error={error || ""} />

            <Box
              sx={{
                position: "relative",
                mb: 3,
                "&::before": isDark
                  ? {}
                  : {
                      content: '""',
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      width: "120%",
                      height: "140%",
                      transform: "translate(-50%, -50%)",
                      background: "radial-gradient(ellipse, rgba(94, 24, 233, 0.15) 0%, transparent 65%)",
                      animation: `${formGlow} 4s ease-in-out infinite`,
                      pointerEvents: "none",
                      zIndex: 0,
                    },
              }}
            >
            <Paper
              elevation={0}
              sx={{
                position: "relative",
                zIndex: 1,
                p: 3,
                borderRadius: 3,
                border: `1px solid ${
                  isDark
                    ? COLORS.BORDER.DEFAULT_DARK
                    : "rgba(94, 24, 233, 0.12)"
                }`,
                bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
                boxShadow: isDark
                  ? "none"
                  : "0 4px 24px rgba(94, 24, 233, 0.08), 0 1px 3px rgba(0,0,0,0.04), 0 0 40px rgba(94, 24, 233, 0.06)",
                transition: "box-shadow 0.3s ease, border-color 0.3s ease",
                "&:focus-within": {
                  boxShadow: isDark
                    ? "none"
                    : "0 8px 32px rgba(94, 24, 233, 0.12), 0 0 60px rgba(94, 24, 233, 0.08)",
                  borderColor: "rgba(94, 24, 233, 0.25)",
                },
              }}
            >
              <Typography
                variant="subtitle2"
                color={isDark ? COLORS.TEXT.SECONDARY_DARK : "text.secondary"}
                sx={{ mb: 2, fontWeight: 600 }}
              >
                {t("startIn30Seconds")}
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  alignItems: "stretch",
                }}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: `1px solid ${
                      isDark
                        ? COLORS.BORDER.DEFAULT_DARK
                        : "rgba(94, 24, 233, 0.15)"
                    }`,
                    overflow: "hidden",
                    flex: "1 1 220px",
                    minHeight: 52,
                    bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
                    borderRadius: 2,
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                    "&:focus-within": {
                      borderColor: COLORS.PRIMARY_PURPLE,
                      boxShadow: `0 0 0 3px ${COLORS.PURPLE_ALPHA_10}`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: isDark
                        ? COLORS.PURPLE_ALPHA_10
                        : COLORS.PURPLE_ALPHA_04,
                      borderRadius: 0,
                      borderRight: `1px solid ${
                        isDark
                          ? COLORS.BORDER.DEFAULT_DARK
                          : "rgba(94, 24, 233, 0.12)"
                      }`,
                    }}
                  >
                    <Input
                      name="country_code"
                      control={control}
                      select
                      variant="standard"
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          minWidth: 96,
                          "& .MuiSelect-select": {
                            py: 1.5,
                            pl: 2,
                            pr: "28px !important",
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            color: isDark
                              ? COLORS.TEXT.PRIMARY_DARK
                              : COLORS.TEXT.PRIMARY_LIGHT,
                          },
                          "& .MuiSvgIcon-root": {
                            color: isDark
                              ? COLORS.TEXT.SECONDARY_DARK
                              : "text.secondary",
                          },
                        },
                      }}
                    >
                      {countries.map((country) => (
                        <MenuItem key={country.code} value={country.phone_code}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <span>{country.flag}</span>
                            <span>{country.phone_code}</span>
                          </Box>
                        </MenuItem>
                      ))}
                    </Input>
                  </Box>
                  <Box sx={{ flex: 1, display: "flex", alignItems: "center", px: 1.5 }}>
                    <Input
                      name="phone_number"
                      control={control}
                      placeholder={t("yourMobileNumber")}
                      variant="standard"
                      type="tel"
                      inputMode="tel"
                      inputProps={{
                        maxLength: 10,
                      }}
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          py: 0.5,
                          px: 0.5,
                          color: isDark
                            ? COLORS.TEXT.PRIMARY_DARK
                            : COLORS.TEXT.PRIMARY_LIGHT,
                          fontSize: "0.9375rem",
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-root": { height: "100%", marginTop: "2px" },
                      }}
                    />
                  </Box>
                </Paper>
                <Button
                  variant="contained"
                  type="submit"
                  endIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <ArrowForwardIcon sx={{ fontSize: 20 }} />
                    )
                  }
                  disabled={loading}
                  sx={{
                    bgcolor: COLORS.PRIMARY_PURPLE,
                    color: "white",
                    px: 3.5,
                    py: 1.5,
                    minHeight: 52,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    boxShadow: "0 4px 14px rgba(94, 24, 233, 0.35), 0 0 24px rgba(94, 24, 233, 0.2)",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      bgcolor: COLORS.PURPLE_HOVER,
                      boxShadow: "0 6px 24px rgba(94, 24, 233, 0.45), 0 0 40px rgba(94, 24, 233, 0.25)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  {t("getMyFreeListing")}
                </Button>
              </Box>
            </Paper>
            </Box>

            <VerificationModal
              open={isOtpOpen}
              onClose={closeOtpModal}
              onVerify={handleVerifyOtp}
              loading={loading}
            />

            <Box
              component="ul"
              sx={{
                m: 0,
                p: 0,
                listStyle: "none",
                display: "grid",
                gap: 1.5,
              }}
            >
              {getHeroBenefits(t).map((text: string, i: number) => (
                <Box
                  key={i}
                  component="li"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <CheckCircleIcon
                    sx={{
                      color: COLORS.SUCCESS_GREEN,
                      fontSize: 22,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="body1"
                    color={isDark ? COLORS.TEXT.PRIMARY_DARK : "text.primary"}
                    sx={{ fontWeight: 500, fontSize: "0.9375rem" }}
                  >
                    {text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                alignItems: "flex-start",
                gap: 3,
                flexWrap: "wrap",
              }}
            >
              <Box
                sx={{
                  width: 280,
                  height: 560,
                  position: "relative",
                  border: `12px solid ${
                    isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(0,0,0,0.08)"
                  }`,
                  borderRadius: "28px",
                  overflow: "hidden",
                  boxShadow: isDark
                    ? "0 24px 48px rgba(0,0,0,0.3)"
                    : "0 24px 48px rgba(94, 24, 233, 0.12), 0 8px 24px rgba(0,0,0,0.08)",
                }}
              >
                <Image
                  src="/auth/Home.JPG"
                  alt="App Home"
                  fill
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {getStatCards(t).map(({ value, label, icon: Icon, color }) => (
                  <Paper
                    key={label}
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      minWidth: 180,
                      bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
                      border: `1px solid ${
                        isDark
                          ? COLORS.BORDER.DEFAULT_DARK
                          : "rgba(94, 24, 233, 0.1)"
                      }`,
                      boxShadow: isDark ? "none" : "0 2px 12px rgba(0,0,0,0.04)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: isDark
                          ? "none"
                          : "0 8px 24px rgba(94, 24, 233, 0.1)",
                      },
                      borderLeft: `4px solid ${color}`,
                    }}
                  >
                    <Icon sx={{ color, mb: 0.75, fontSize: 28 }} />
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      color={isDark ? COLORS.TEXT.PRIMARY_DARK : "text.primary"}
                      sx={{ letterSpacing: "-0.02em" }}
                    >
                      {value}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={
                        isDark ? COLORS.TEXT.SECONDARY_DARK : "text.secondary"
                      }
                      sx={{ mt: 0.25 }}
                    >
                      {label}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
