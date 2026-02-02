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
        py: { xs: 5, md: 10 },
        px: { xs: 2, md: 4 },
        background: isDark ? COLORS.DARK_GRADIENT : COLORS.PURPLECYAN,
        borderRadius: { xs: 0, md: 4 },
        mx: { xs: 0, md: 2 },
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={5} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Chip
              icon={<ShieldIcon sx={{ fontSize: 18 }} />}
              label={t("freeForever")}
              size="small"
              sx={{
                mb: 2,
                bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
                color: COLORS.PRIMARY_PURPLE,
                fontWeight: 600,
                "& .MuiChip-icon": { color: COLORS.PRIMARY_PURPLE },
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
                lineHeight: 1.2,
                mb: 1.5,
                fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
              }}
            >
              {t("growYourBusinessWith")}{" "}
              <Box component="span" sx={{ color: COLORS.PRIMARY_PURPLE }}>
                {t("freeListing")}
              </Box>
            </Typography>
            <Typography
              variant="h6"
              color={isDark ? COLORS.TEXT.SECONDARY_DARK : "text.secondary"}
              sx={{ mb: 3, fontWeight: 500 }}
            >
              {t("joinThousandsBusinessOwners")}
            </Typography>

            <ErrorMessage isVisible={!!error} error={error || ""} />

            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: `1px solid ${
                  isDark
                    ? COLORS.BORDER.DEFAULT_DARK
                    : COLORS.BORDER.DEFAULT_LIGHT
                }`,
                bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
                boxShadow: isDark ? "none" : COLORS.SHADOW.DEFAULT,
                mb: 3,
              }}
            >
              <Typography
                variant="subtitle2"
                color={isDark ? COLORS.TEXT.SECONDARY_DARK : "text.secondary"}
                sx={{ mb: 1.5 }}
              >
                {t("startIn30Seconds")}
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1.5,
                  alignItems: "stretch",
                }}
              >
                <Paper
                  variant="outlined"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "none",
                    overflow: "hidden",

                    flex: "1 1 200px",
                    bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
                    p: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: isDark
                        ? COLORS.PURPLE_ALPHA_10
                        : COLORS.PURPLE_ALPHA_04,
                      borderRadius: 1.5,
                      mr: 1,
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
                          minWidth: 90,
                          "& .MuiSelect-select": {
                            py: 1.5,
                            pl: 2,
                            pr: "24px !important",
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
                  <Box sx={{ flex: 1 }}>
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
                          px: 1,
                          color: isDark
                            ? COLORS.TEXT.PRIMARY_DARK
                            : COLORS.TEXT.PRIMARY_LIGHT,
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-root": {
                          height: "100%",
                          marginTop: "3px",
                        },
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
                      <ArrowForwardIcon />
                    )
                  }
                  disabled={loading}
                  sx={{
                    bgcolor: COLORS.PRIMARY_PURPLE,
                    color: "white",
                    "&:hover": { bgcolor: COLORS.PURPLE_HOVER },
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    boxShadow: "0 4px 14px rgba(94, 24, 233, 0.35)",
                    height: "fit-content",
                    alignSelf: "center",
                  }}
                >
                  {t("getMyFreeListing")}
                </Button>
              </Box>
            </Paper>

            <VerificationModal
              open={isOtpOpen}
              onClose={closeOtpModal}
              onVerify={handleVerifyOtp}
              loading={loading}
            />

            {getHeroBenefits(t).map((text: string, i: number) => (
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
                  variant="body1"
                  color={isDark ? COLORS.TEXT.PRIMARY_DARK : "text.primary"}
                  sx={{ fontWeight: 500 }}
                >
                  {text}
                </Typography>
              </Box>
            ))}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                alignItems: "flex-start",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Box
                sx={{
                  width: 280,
                  height: 560,
                  position: "relative",
                  border: `10px solid ${
                    isDark ? COLORS.BORDER.DEFAULT_DARK : "#1a1a1a"
                  }`,
                  borderRadius: "32px",
                  overflow: "hidden",
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
                      p: 2,
                      borderRadius: 2,
                      minWidth: 160,

                      bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
                      boxShadow: isDark ? "none" : COLORS.SHADOW.DEFAULT,
                      "&:hover": {
                        boxShadow: isDark ? "none" : "rgb(79 70 229 / 0.1)",
                      },
                      border: isDark
                        ? `1px solid ${COLORS.BORDER.DEFAULT_DARK}`
                        : undefined,
                      borderLeft: `4px solid ${color}`, // restore left border
                    }}
                  >
                    <Icon sx={{ color, mb: 0.5 }} />
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color={isDark ? COLORS.TEXT.PRIMARY_DARK : "text.primary"}
                    >
                      {value}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={
                        isDark ? COLORS.TEXT.SECONDARY_DARK : "text.secondary"
                      }
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
