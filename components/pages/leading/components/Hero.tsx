"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  useTheme,
  MenuItem,
  Grid,
} from "@mui/material";
import LogoLoader from "@/components/common/Loader/LogoLoader";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckIcon from "@mui/icons-material/Check";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { getStatCards } from "./constants";
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
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const PURPLE = COLORS.PRIMARY_PURPLE;
const PURPLE_HOVER = COLORS.PURPLE_HOVER;
const PURPLE_ALPHA_04 = COLORS.PURPLE_ALPHA_04;

const heroSchema = (t: any) =>
  yup.object().shape({
    whatsapp_number: yup
      .string()
      .required(t("phoneNumberRequired"))
      .length(10, t("phoneNumberLength"))
      .matches(/^[0-9]+$/, t("phoneNumberInvalid")),
    whatsapp_country_code: yup.string().required(t("countryCodeRequired")),
  });

type HeroFormData = {
  whatsapp_number: string;
  whatsapp_country_code: string;
};

const Hero: React.FC = () => {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [role, setRole] = React.useState<"SERVICE_PROVIDER" | "SUPPLIER">(
    "SERVICE_PROVIDER",
  );
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
      whatsapp_number: "",
      whatsapp_country_code: "+91",
    },
  });

  const onSubmit = (data: HeroFormData) => {
    handleCheckUser({
      whatsapp_number: data.whatsapp_number,
      whatsapp_country_code: data.whatsapp_country_code,
      source: "WEB",
      source_type: role,
    });
  };

  const features = [
    { label: t("featureFree"), desc: t("featureFreeDesc"), Icon: CheckCircleIcon },
    { label: t("featureEasy"), desc: t("featureEasyDesc"), Icon: SettingsOutlinedIcon },
    { label: t("featurePersonalised"), desc: t("featurePersonalisedDesc"), Icon: Inventory2OutlinedIcon },
  ];

  const businessTypes = [
    {
      value: "SERVICE_PROVIDER" as const,
      label: t("service_provider"),
      examples: t("serviceProviderExamples"),
      Icon: BuildOutlinedIcon,
    },
    {
      value: "SUPPLIER" as const,
      label: t("supplier"),
      examples: t("supplierExamples"),
      Icon: Inventory2OutlinedIcon,
    },
  ];

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      sx={{
        py: { xs: 4, sm: 5, md: 6 },
        px: { xs: 2, sm: 3 },
        background: isDark
          ? COLORS.DARK_GRADIENT
          : "linear-gradient(165deg, #fafaff 0%, #f5f0ff 35%, #faf8ff 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before":
          isDark
            ? {}
            : {
              content: '""',
              position: "absolute",
              top: "-30%",
              right: "-15%",
              width: "55%",
              height: "90%",
              background: "radial-gradient(ellipse, rgba(94, 24, 233, 0.06) 0%, transparent 65%)",
              pointerEvents: "none",
            },
      }}
    >
      <Container maxWidth="xl" sx={{ position: "relative" }}>
        <Grid container spacing={{ xs: 3, lg: 2 }} alignItems="center">
          <Grid size={{ xs: 12, lg: 7 }}>
            <Box sx={{ maxWidth: 600 }}>
              {/* Breadcrumb */}
              <Typography
                variant="caption"
                component="nav"
                aria-label="Breadcrumb"
                sx={{
                  display: "block",
                  mb: 2,
                  color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                  fontSize: "0.8125rem",
                  "& a": { color: "inherit", textDecoration: "none", "&:hover": { textDecoration: "underline" } },
                }}
              >
                <Link href="/">{t("home")}</Link>
                {" / "}
                <Box component="span" fontWeight={600} color={isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT}>
                  {t("listYourBusiness")}
                </Box>
              </Typography>

              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
              >
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 800,
                    color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                    lineHeight: 1.18,
                    mb: 1.5,
                    fontSize: { xs: "1.875rem", sm: "2.125rem", md: "2.5rem" },
                    letterSpacing: "-0.025em",
                  }}
                >
                  <Box component="span" sx={{ color: PURPLE }}>
                    {t("standOutHighlight")}
                  </Box>
                  {t("standOutRest")}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 300,
                    color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                    fontSize: "1.0625rem",
                    lineHeight: 1.55,
                    mb: 3,
                  }}
                >
                  {t("standOutSubtext")}
                </Typography>
              </motion.div>

              <ErrorMessage isVisible={!!error} error={error || ""} />

              {/* Form: phone first, then type, then CTA */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.12 }}
              >
                <Box
                  component="form"
                  onSubmit={handleSubmit(onSubmit)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    alignItems: "stretch",
                  }}
                >
                  {/* Phone: single row, large touch target */}
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mb: 0.75,
                        color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                        fontSize: "0.8125rem",
                        fontWeight: 500,
                      }}
                    >
                      {t("mobileNumber")}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "stretch",
                        flexWrap: "wrap",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.15)"}`,
                          borderRadius: 2,
                          overflow: "hidden",
                          bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "#fff",
                          minHeight: 52,
                          "&:focus-within": {
                            borderColor: PURPLE,
                            boxShadow: `0 0 0 3px ${PURPLE_ALPHA_04}`,
                          },
                          transition: "border-color 0.2s, box-shadow 0.2s",
                        }}
                      >
                        <Input
                          name="whatsapp_country_code"
                          control={control}
                          select
                          variant="standard"
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              minWidth: 92,
                              "& .MuiSelect-select": {
                                py: 1.5,
                                pl: 2,
                                pr: "32px !important",
                                fontWeight: 500,
                                fontSize: "1rem",
                                color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                              },
                            },
                          }}
                        >
                          {countries.map((country) => (
                            <MenuItem key={country.code} value={country.phone_code}>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <span>{country.flag}</span>
                                <span>{country.phone_code}</span>
                              </Box>
                            </MenuItem>
                          ))}
                        </Input>
                      </Box>
                      <Box
                        sx={{
                          flex: "1 1 200px",
                          minWidth: 0,
                          display: "flex",
                          alignItems: "center",
                          border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.15)"}`,
                          borderRadius: 2,
                          px: 2,
                          minHeight: 52,
                          bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "#fff",
                          "&:focus-within": {
                            borderColor: PURPLE,
                            boxShadow: `0 0 0 3px ${PURPLE_ALPHA_04}`,
                          },
                          transition: "border-color 0.2s, box-shadow 0.2s",
                        }}
                      >
                        <Input
                          name="whatsapp_number"
                          control={control}
                          placeholder={t("yourNumber")}
                          variant="standard"
                          type="tel"
                          inputMode="numeric"
                          inputProps={{ maxLength: 10 }}
                          InputProps={{
                            disableUnderline: true,
                            sx: {
                              py: 0.5,
                              color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                              fontSize: "1rem",
                            },
                          }}
                          sx={{ "& .MuiInputBase-root": { width: "100%" } }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  {/* Business type: Service Provider vs Supplier — modern cards */}
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        mb: 1.25,
                        color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {t("chooseBusinessType")}
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 1.5,
                      }}
                    >
                      {businessTypes.map((opt) => {
                        const isSelected = role === opt.value;
                        const Icon = opt.Icon;
                        return (
                          <Box
                            key={opt.value}
                            component="button"
                            type="button"
                            onClick={() => setRole(opt.value)}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "stretch",
                              gap: 0.75,
                              textAlign: "left",
                              px: 2,
                              py: 1.5,
                              borderRadius: 2.5,
                              border: `1px solid ${isSelected ? "transparent" : isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.12)"}`,
                              bgcolor: isSelected
                                ? (isDark ? "rgba(94, 24, 233, 0.12)" : "rgba(94, 24, 233, 0.06)")
                                : isDark
                                  ? "rgba(255,255,255,0.03)"
                                  : "rgba(255,255,255,0.7)",
                              cursor: "pointer",
                              outline: "none",
                              transition: "all 0.25s ease",
                              position: "relative",
                              overflow: "hidden",
                              boxShadow: isSelected
                                ? (isDark ? "0 4px 20px rgba(94, 24, 233, 0.15)" : "0 4px 16px rgba(94, 24, 233, 0.08)")
                                : "none",
                              "&::before": {
                                content: '""',
                                position: "absolute",
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: isSelected ? 4 : 0,
                                bgcolor: PURPLE,
                                borderRadius: "4px 0 0 4px",
                                transition: "width 0.25s ease",
                              },
                              "&:hover": {
                                borderColor: isSelected ? "transparent" : PURPLE,
                                bgcolor: isDark ? "rgba(94, 24, 233, 0.1)" : "rgba(94, 24, 233, 0.05)",
                                boxShadow: "0 4px 20px rgba(94, 24, 233, 0.1)",
                                transform: "translateY(-1px)",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 1,
                              }}
                            >
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flex: 1, minWidth: 0 }}>
                                <Box
                                  sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                    bgcolor: isSelected
                                      ? (isDark ? "rgba(94, 24, 233, 0.2)" : "rgba(94, 24, 233, 0.12)")
                                      : isDark
                                        ? "rgba(255,255,255,0.06)"
                                        : "rgba(94, 24, 233, 0.06)",
                                    color: isSelected ? PURPLE : (isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT),
                                    transition: "background-color 0.25s ease, color 0.25s ease",
                                  }}
                                >
                                  <Icon sx={{ fontSize: 24 }} />
                                </Box>
                                <Typography
                                  sx={{
                                    fontWeight: 700,
                                    fontSize: "1rem",
                                    color: isSelected ? PURPLE : (isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT),
                                    fontFamily: "var(--font-heading)",
                                    transition: "color 0.25s ease",
                                  }}
                                >
                                  {opt.label}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  width: 22,
                                  height: 22,
                                  borderRadius: "50%",
                                  border: `2px solid ${isSelected ? PURPLE : isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.25)"}`,
                                  bgcolor: isSelected ? PURPLE : "transparent",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                  transition: "all 0.25s ease",
                                  "& svg": { fontSize: 14, color: "#fff" },
                                }}
                              >
                                {isSelected && <CheckIcon sx={{ fontSize: 14, color: "#fff" }} />}
                              </Box>
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: "0.8125rem",
                                lineHeight: 1.4,
                                color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                                display: "block",
                                pl: 0.5,
                              }}
                            >
                              {opt.examples}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>

                  {/* CTA */}
                  <Button
                    type="submit"
                    disabled={loading}
                    variant="contained"
                    endIcon={loading ? <LogoLoader size={22} /> : <ArrowForwardIcon sx={{ fontSize: 22 }} />}
                    sx={{
                      bgcolor: PURPLE,
                      color: "#fff",
                      py: 1.75,
                      px: 3,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "1.0625rem",
                      fontFamily: "var(--font-heading)",
                      boxShadow: `0 6px 20px ${PURPLE}50`,
                      "&:hover": {
                        bgcolor: PURPLE_HOVER,
                        boxShadow: `0 8px 28px ${PURPLE}60`,
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.25s ease",
                    }}
                  >
                    {t("startNow")}
                  </Button>
                  <Typography
                    variant="caption"
                    sx={{
                      textAlign: "center",
                      color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                      fontSize: "0.8125rem",
                    }}
                  >
                    {t("freeForever")}
                  </Typography>

                  {/* Features: Free, Easy, Personalised — below Start now */}
                  {/* <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: { xs: 1.5, sm: 2 },
                      mt: 3,
                      pt: 3,
                      borderTop: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : "rgba(94, 24, 233, 0.1)"}`,
                    }}
                  >
                    {features.map((f, i) => {
                      const Icon = f.Icon;
                      return (
                        <Box
                          key={f.label}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.25,
                            flex: { xs: "1 1 100%", sm: "0 0 auto" },
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: "10px",
                              bgcolor: isDark ? COLORS.PURPLE_ALPHA_10 : "rgba(94, 24, 233, 0.08)",
                              color: PURPLE,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              "& .MuiSvgIcon-root": { fontSize: 20 },
                            }}
                          >
                            <Icon />
                          </Box>
                          <Box>
                            <Typography
                              fontWeight={700}
                              sx={{
                                fontSize: "0.875rem",
                                color: isDark ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT,
                              }}
                            >
                              {f.label}
                            </Typography>
                            {/* <Typography
                              variant="caption"
                              sx={{
                                fontSize: "0.75rem",
                                color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                                display: "block",
                                lineHeight: 1.3,
                              }}
                            >
                              {f.desc}
                            </Typography> 
                          </Box>
                        </Box>
                      );
                    })}
                  </Box> */}

                </Box>
              </motion.div>
            </Box>

            <VerificationModal
              open={isOtpOpen}
              onClose={closeOtpModal}
              onVerify={handleVerifyOtp}
              loading={loading}
            />
          </Grid>

          {/* Right: floating composition — phone + image stat cards */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                position: "relative",
                pl: { lg: 1 },
                minHeight: 300,
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  minHeight: 360,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Central phone — larger, device-like height */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  style={{
                    position: "relative",
                    zIndex: 2,
                    transform: "rotate(-3deg)",
                    width: "min(280px, 26vw)",
                    aspectRatio: "3/4",
                    maxHeight: 420,
                    minHeight: 510,
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                      borderRadius: "28px",
                      overflow: "hidden",
                      border: `10px solid ${isDark ? "#1a1a24" : "#0a0a0f"}`,
                      boxShadow: isDark
                        ? "0 24px 56px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)"
                        : "0 24px 56px rgba(94, 24, 233, 0.15), 0 12px 32px rgba(0,0,0,0.08)",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "28%",
                        height: 18,
                        borderRadius: "0 0 10px 10px",
                        bgcolor: "#0a0a0f",
                        zIndex: 1,
                      },
                    }}
                  >
                    <Image
                      src="/auth/Home.JPG"
                      alt="KartSquare app"
                      fill
                      sizes="360px"
                      style={{ objectFit: "cover", objectPosition: "center top" }}
                      priority
                    />
                  </Box>
                </motion.div>

                {/* Floating stat cards with image strips */}
                {getStatCards(t).map(({ value, label, icon: Icon, color: statColor }, i) => {
                  const positions = [
                    { top: "4%", right: "0%", rotate: 8, delay: 0.25 },
                    { bottom: "8%", left: "-2%", rotate: -6, delay: 0.35 },
                    { bottom: "12%", right: "2%", rotate: 5, delay: 0.45 },
                  ];
                  const pos = positions[i];
                  const imagePositions: Record<number, string> = {
                    0: "center 10%",
                    1: "center 50%",
                    2: "center 90%",
                  };
                  return (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 16, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, delay: pos.delay }}
                      style={{
                        position: "absolute",
                        top: pos.top,
                        bottom: pos.bottom,
                        left: pos.left,
                        right: pos.right,
                        zIndex: i === 1 ? 3 : 1,
                        transform: `rotate(${pos.rotate}deg)`,
                      }}
                    >
                      <Box
                        sx={{
                          width: 120,
                          borderRadius: 2.5,
                          overflow: "hidden",
                          background: isDark
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(255,255,255,0.92)",
                          border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.8)"}`,
                          boxShadow: isDark
                            ? "0 12px 32px rgba(0,0,0,0.3)"
                            : "0 12px 32px rgba(94, 24, 233, 0.12), 0 4px 16px rgba(0,0,0,0.06)",
                          backdropFilter: "blur(12px)",
                        }}
                      >
                        <Box
                          sx={{
                            height: 44,
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <Image
                            src="/auth/Home.JPG"
                            alt=""
                            fill
                            sizes="120px"
                            style={{
                              objectFit: "cover",
                              objectPosition: imagePositions[i],
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              inset: 0,
                              background: isDark
                                ? "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 100%)"
                                : "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.85) 100%)",
                            }}
                          />
                        </Box>
                        <Box sx={{ p: 1.25, textAlign: "center" }}>
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 28,
                              height: 28,
                              borderRadius: "8px",
                              bgcolor: `${statColor}20`,
                              color: statColor,
                              mb: 0.75,
                            }}
                          >
                            <Icon sx={{ fontSize: 16 }} />
                          </Box>
                          <Typography
                            fontWeight={800}
                            sx={{
                              fontSize: "1.125rem",
                              lineHeight: 1.2,
                              letterSpacing: "-0.02em",
                              color: statColor,
                              fontFamily: "var(--font-heading)",
                            }}
                          >
                            {value}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              color: isDark ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                              fontSize: "0.5625rem",
                              lineHeight: 1.3,
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                              mt: 0.25,
                            }}
                          >
                            {label}
                          </Typography>
                        </Box>
                      </Box>
                    </motion.div>
                  );
                })}

                {/* Second smaller screen for depth */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  style={{
                    position: "absolute",
                    left: "18%",
                    top: "32%",
                    zIndex: 0,
                    width: "min(100px, 10vw)",
                    aspectRatio: "3/4",
                    maxHeight: 140,
                    transform: "rotate(12deg)",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                      borderRadius: "14px",
                      overflow: "hidden",
                      border: `5px solid ${isDark ? "#252530" : "#e8e8f0"}`,
                      boxShadow: isDark
                        ? "0 12px 28px rgba(0,0,0,0.35)"
                        : "0 12px 28px rgba(0,0,0,0.08)",
                    }}
                  >
                    <Image
                      src="/auth/Home.JPG"
                      alt=""
                      fill
                      sizes="100px"
                      style={{ objectFit: "cover", objectPosition: "center 70%" }}
                    />
                  </Box>
                </motion.div>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
