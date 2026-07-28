"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  useTheme,
  Select,
  MenuItem,
} from "@mui/material";
import { useTranslate } from "@/hooks/useTranslate";
import { useForm, Controller } from "react-hook-form";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { COLORS } from "@/constants/colors";
import ContactCard from "../helpSupport/components/contactCard";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Image from "next/image";
import ProfileWrapper from "@/components/common/profile/profileWrapper";
import contactUsService from "@/services/contantUs/contactUs.service";
import { TranslationKey } from "@/features/i18n/TranslationContext";
import { countries } from "@/data/countries";
import SuccessModel from "@/components/common/SuccessModel";
import { useRouter } from "next/navigation";

interface ContactFormData {
  name: string;
  email: string;
  country_code: string;
  phone: string;
  message: string;
}

// Create schema function that uses translations
const createContactSchema = (t: (key: TranslationKey) => string) =>
  yup.object().shape({
    name: yup.string().required(t("nameRequired")).min(2, t("nameMin")),
    email: yup.string().required(t("emailRequired")).email(t("emailInvalid")),
    country_code: yup.string().required(t("countryCodeRequired")),
    phone: yup
      .string()
      .required(t("contactRequired"))
      .matches(/^[0-9]+$/, t("contactInvalid"))
      .min(10, t("phoneMin")),
    message: yup
      .string()
      .required(t("messageRequired"))
      .min(10, t("messageMin")),
  });

function ContactUsView() {
  const { t } = useTranslate();
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: yupResolver(createContactSchema(t)),
    defaultValues: {
      name: "",
      email: "",
      country_code: "+91",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      setError("");
      const apiData = {
        name: data.name,
        email: data.email,
        country_code: data.country_code,
        phone: data.phone,
        message: data.message,
      };
      await contactUsService.contactUs(apiData);
      reset();
      setShowSuccess(true);
    } catch (error: any) {
      console.error("Failed to submit contact form:", error);
      setError(
        error.data.message ||
          error.message ||
          "Failed to send message. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const phoneNumber = "8005673985";
  const email = "contact@kartsquare.com";
  const address = "Dubai, United Arab Emirates";

  return (
    <ProfileWrapper showBackButton>
      <Box
        sx={{
          px: { xs: 2, sm: 3, md: 4, lg: 5, xl: 8 },
        }}
      >
        <Box sx={{ mb: { xs: 3, sm: 4 } }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
              color: isDark
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
              mb: 1,
            }}
          >
            {t("contactUs")}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: isDark
                ? COLORS.TEXT.SECONDARY_DARK
                : COLORS.TEXT.SECONDARY_LIGHT,
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            {t("contactUsDescription")}
          </Typography>
        </Box>

        {/* Contact Info Cards */}
        <Grid
          container
          spacing={{ xs: 2, sm: 3 }}
          sx={{ mb: { xs: 3, sm: 4, md: 5 } }}
        >
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ContactCard
              icon={LocalPhoneIcon}
              title={phoneNumber}
              subtitle={t("customerService")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ContactCard
              icon={EmailIcon}
              title={email}
              subtitle={t("writeUsAt")}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <ContactCard
              icon={LocationOnIcon}
              title={address}
              subtitle={t("ourLocation")}
            />
          </Grid>
        </Grid>

        {/* Form Section */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            bgcolor: isDark
              ? COLORS.BACKGROUND.PAPER_DARK
              : COLORS.BACKGROUND.PRIMARY_LIGHT,
            borderRadius: { xs: "12px", sm: "16px" },
            p: { xs: 2.5, sm: 3, md: 4 },
            border: `1px solid ${
              isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT
            }`,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: { xs: 2.5, sm: 3 },
              fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" },
              color: isDark
                ? COLORS.TEXT.PRIMARY_DARK
                : COLORS.TEXT.PRIMARY_LIGHT,
            }}
          >
            {t("sendMessage")}
          </Typography>

          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ mb: { xs: 0, sm: 1 } }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                    color: isDark
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                  }}
                >
                  {t("name")}
                </Typography>
                <Input
                  name="name"
                  control={control}
                  placeholder={t("name")}
                  InputProps={{
                    sx: {
                      borderRadius: "12px",
                      bgcolor: isDark
                        ? COLORS.BACKGROUND.PRIMARY_DARK
                        : COLORS.BACKGROUND.PRIMARY_LIGHT,
                    },
                  }}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ mb: { xs: 0, sm: 1 } }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                    color: isDark
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                  }}
                >
                  {t("email")}
                </Typography>
                <Input
                  name="email"
                  control={control}
                  placeholder={t("email")}
                  type="email"
                  InputProps={{
                    sx: {
                      borderRadius: "12px",
                      bgcolor: isDark
                        ? COLORS.BACKGROUND.PRIMARY_DARK
                        : COLORS.BACKGROUND.PRIMARY_LIGHT,
                    },
                  }}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ mb: { xs: 0, sm: 1 } }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                    color: isDark
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                  }}
                >
                  {t("countryCode")}
                </Typography>
                <Controller
                  name="country_code"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      fullWidth
                      displayEmpty
                      sx={{
                        height: "48px",
                        borderRadius: "12px",
                        bgcolor: isDark
                          ? COLORS.BACKGROUND.PRIMARY_DARK
                          : COLORS.BACKGROUND.PRIMARY_LIGHT,
                        border: `1px solid ${
                          isDark
                            ? COLORS.BORDER.DEFAULT_DARK
                            : COLORS.BORDER.DEFAULT_LIGHT
                        }`,
                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                        "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
                      }}
                    >
                      {countries.map((country) => (
                        <MenuItem key={country.code} value={country.phone_code}>
                          {country.flag} {country.phone_code}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ mb: { xs: 0, sm: 1 } }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                    color: isDark
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                  }}
                >
                  {t("phoneNumber")}
                </Typography>
                <Input
                  name="phone"
                  control={control}
                  placeholder={t("phoneNumber")}
                  type="tel"
                  inputProps={{ maxLength: 10 }}
                  InputProps={{
                    sx: {
                      borderRadius: "12px",
                      bgcolor: isDark
                        ? COLORS.BACKGROUND.PRIMARY_DARK
                        : COLORS.BACKGROUND.PRIMARY_LIGHT,
                    },
                  }}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Box sx={{ mb: { xs: 1, sm: 2 } }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    fontSize: { xs: "0.8125rem", sm: "0.875rem" },
                    color: isDark
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                  }}
                >
                  {t("message")}
                </Typography>
                <Input
                  name="message"
                  control={control}
                  placeholder={t("writeHere")}
                  multiline
                  rows={5}
                  InputProps={{
                    sx: {
                      borderRadius: { xs: "12px", sm: "16px" },
                      padding: { xs: "12px", sm: "14px", md: "16px" },
                      bgcolor: isDark
                        ? COLORS.BACKGROUND.PRIMARY_DARK
                        : COLORS.BACKGROUND.PRIMARY_LIGHT,
                    },
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: { xs: "12px", sm: "16px" },
                      padding: { xs: "12px", sm: "14px", md: "16px" },
                      minHeight: { xs: "100px", sm: "120px", md: "140px" },
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              mt: { xs: 2, sm: 2.5, md: 3 },
            }}
          >
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                width: "auto",
                minWidth: { xs: "100%", sm: "200px" },
                background: COLORS.PRIMARY_PURPLE,
                color: "white",
                py: { xs: 1.25, sm: 1.5 },
                px: { xs: 3, sm: 4 },
                fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                fontWeight: 600,
                borderRadius: "12px",
                "&:hover": { background: COLORS.PURPLE_HOVER },
                "&:disabled": { background: COLORS.PRIMARY_PURPLE, opacity: 0.6 },
              }}
            >
              {isSubmitting ? t("loading") || "Loading..." : t("sendMessage")}
            </Button>
          </Box>
        </Box>
      </Box>

      <SuccessModel
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title={t("contactUsSuccess")}
        description="We'll get back to you soon."
        actionLabel="Go to Home"
        onAction={() => {
          setShowSuccess(false);
          router.push("/");
        }}
      />
    </ProfileWrapper>
  );
}

export default ContactUsView;
