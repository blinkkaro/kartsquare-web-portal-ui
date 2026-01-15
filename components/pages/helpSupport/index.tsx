"use client";

import React from "react";
import { Box, Typography, Grid, MenuItem, useTheme } from "@mui/material";
import BackButton from "@/components/common/BackButton";
import ProfileWrapper from "@/components/common/profile/profileWrapper";
import { useTranslationContext } from "@/features/i18n/TranslationContext";
import { useForm } from "react-hook-form";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import { COLORS } from "@/constants/colors";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ContactCard from "./components/contactCard";

function HelpSupportView() {
  const { t } = useTranslationContext();
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      issueType: "",
      issueDescription: "",
    },
  });
  const theme = useTheme();
  const onSubmit = (data: any) => {
    console.log(data);
  };

  const issueTypes = [
    { value: "", label: t("selectIssueType") },
    { value: "order", label: t("orderRelated") },
    { value: "payment", label: t("paymentRelated") },
    { value: "delivery", label: t("deliveryRelated") },
    { value: "other", label: t("other") },
  ];

  return (
    <ProfileWrapper showBackButton>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
            {t("helpSupport")}
          </Typography>
        </Box>

        {/* Contact Info Cards */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <ContactCard
              icon={LocalPhoneIcon}
              title="800-123-4567"
              subtitle={t("customerService")}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ContactCard
              icon={EmailIcon}
              title="support@octopus.in" // Using generic or placeholder based on design, or could be from constants
              subtitle={t("writeUsAt")}
            />
          </Grid>
        </Grid>

        {/* Form Section */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontWeight: "medium" }}
            >
              {t("typeOfIssues")}
            </Typography>
            {/* Using Input component behaving like a select for UI purposes as per design image which shows generic input style with dropdown arrow */}
            <Input
              name="issueType"
              control={control}
              placeholder={t("selectIssueType")} // Placeholder from design image, though strange for issue type
              endIcon={null}
              select
              SelectProps={{
                displayEmpty: true,
                IconComponent: KeyboardArrowDownIcon,
                MenuProps: {
                  PaperProps: {
                    sx: {
                      borderRadius: "12px",
                    },
                  },
                },
              }}
              InputProps={{
                sx: {
                  borderRadius: "12px",
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? COLORS.BACKGROUND.PRIMARY_DARK
                      : COLORS.BACKGROUND.PRIMARY_LIGHT,
                },
              }}
            >
              {issueTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Input>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontWeight: "medium" }}
            >
              {t("writeYourIssues")}
            </Typography>
            <Input
              name="issueDescription"
              control={control}
              placeholder={t("writeHere")}
              multiline
              rows={6}
              InputProps={{
                sx: {
                  borderRadius: "16px",
                  padding: "16px",
                  bgcolor:
                    theme.palette.mode === "dark"
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

          <Button
            type="submit"
            variant="contained"
            sx={{
              width: "auto",
              minWidth: "200px",
              background: COLORS.PRIMARY_PURPLE,
            }}
          >
            {t("submit")}
          </Button>
        </Box>
    </ProfileWrapper>
  );
}

export default HelpSupportView;
