"use client";

import React, { useState } from "react";
import { Box, Typography, Grid, useTheme } from "@mui/material";
import BackButton from "@/components/common/BackButton";
import { useTranslate } from "@/hooks/useTranslate";
import { useForm } from "react-hook-form";
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

interface ContactFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  message: string;
}

// Create schema function that uses translations
const createContactSchema = (t: (key: any) => string) =>
  yup.object().shape({
    firstName: yup
      .string()
      .required(t("firstNameRequired"))
      .min(2, t("firstNameMin")),
    lastName: yup
      .string()
      .required(t("lastNameRequired"))
      .min(2, t("lastNameMin")),
    phoneNumber: yup
      .string()
      .required(t("phoneNumberRequired"))
      .matches(/^[0-9+\-\s()]+$/, "Invalid phone number format"),
    message: yup
      .string()
      .required(t("messageRequired"))
      .min(10, t("messageMin")),
  });

function ContactUsView() {
  const { t } = useTranslate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: yupResolver(createContactSchema(t)),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to submit contact form
      console.log("Contact form data:", data);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Show success message (you can use a toast notification here)
      alert(t("contactUsSuccess"));
      reset();
    } catch (error) {
      console.error("Failed to submit contact form:", error);
      // Show error message
    } finally {
      setIsSubmitting(false);
    }
  };

  const phoneNumber = "8005673985";
  const email = "contact@kartsquare.com";
  const address = "Dubai, United Arab Emirates";

  // Contact-related images with descriptions

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 5, lg: 5, xl: 10 }, py: 5 }}>
      {/* Back Button */}
      <Box sx={{ display: { xs: "block", lg: "none" }, mb: 2 }}>
        <BackButton />
      </Box>

      <Grid container spacing={4} direction={{ xs: "column-reverse", lg: "row" }}>
        {/* Left Column - Main Content */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box sx={{ display: { xs: "none", lg: "block" }, mb: 2 }}>
            <BackButton />
          </Box>

          <Box sx={{ mb: 4 }}>
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
          <Grid container spacing={3} sx={{ mb: 5 }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <ContactCard
                icon={LocalPhoneIcon}
                title={phoneNumber}
                subtitle={t("customerService")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <ContactCard
                icon={EmailIcon}
                title={email}
                subtitle={t("writeUsAt")}
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
              borderRadius: "16px",
              p: { xs: 3, sm: 4, md: 5 },
              border: `1px solid ${
                isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT
              }`,
            }}
          >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: 3,
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
            color: isDark
              ? COLORS.TEXT.PRIMARY_DARK
              : COLORS.TEXT.PRIMARY_LIGHT,
          }}
        >
          {t("sendMessage")}
        </Typography>

        <Grid container spacing={3}>
          {/* First Name */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                  color: isDark
                    ? COLORS.TEXT.PRIMARY_DARK
                    : COLORS.TEXT.PRIMARY_LIGHT,
                }}
              >
                {t("firstName")}
              </Typography>
              <Input
                name="firstName"
                control={control}
                placeholder={t("firstName")}
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

          {/* Last Name */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                  color: isDark
                    ? COLORS.TEXT.PRIMARY_DARK
                    : COLORS.TEXT.PRIMARY_LIGHT,
                }}
              >
                {t("lastName")}
              </Typography>
              <Input
                name="lastName"
                control={control}
                placeholder={t("lastName")}
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

          {/* Phone Number */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  fontSize: { xs: "0.875rem", sm: "0.9375rem" },
                  color: isDark
                    ? COLORS.TEXT.PRIMARY_DARK
                    : COLORS.TEXT.PRIMARY_LIGHT,
                }}
              >
                {t("phoneNumber")}
              </Typography>
              <Input
                name="phoneNumber"
                control={control}
                placeholder={t("phoneNumber")}
                type="tel"
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

          {/* Message */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  fontSize: { xs: "0.875rem", sm: "0.9375rem" },
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
                rows={6}
                InputProps={{
                  sx: {
                    borderRadius: "16px",
                    padding: "16px",
                    bgcolor: isDark
                      ? COLORS.BACKGROUND.PRIMARY_DARK
                      : COLORS.BACKGROUND.PRIMARY_LIGHT,
                  },
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: "16px",
                    padding: "16px",
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              width: "auto",
              minWidth: { xs: "100%", sm: "200px" },
              background: COLORS.PRIMARY_PURPLE,
              color: "white",
              py: 1.5,
              px: 4,
              fontSize: { xs: "0.875rem", sm: "1rem" },
              fontWeight: 600,
              borderRadius: "12px",
              "&:hover": {
                background: COLORS.PURPLE_HOVER,
              },
              "&:disabled": {
                background: COLORS.PRIMARY_PURPLE,
                opacity: 0.6,
              },
            }}
          >
            {isSubmitting ? t("loading") || "Loading..." : t("sendMessage")}
          </Button>
        </Box>
      </Box>
        </Grid>

        {/* Right Column - Contact Images */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box
            sx={{
              position: { lg: "sticky" },
              top: { lg: 80 },
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
         
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ContactUsView;
