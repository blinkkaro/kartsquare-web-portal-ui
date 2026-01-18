"use client";
import React, { useState, useRef } from "react";
import { Grid, MenuItem, InputAdornment, Typography, Box } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignUpSchema, SignUpFormData } from "../signUpSchema";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useTranslate } from "@/hooks/useTranslate";
import { countries } from "./data";
import { AppUserType } from "@/services/auth/auth.interface";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/PersonOutline";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import LockIcon from "@mui/icons-material/LockOutlined";
import CalendarIcon from "@mui/icons-material/CalendarTodayOutlined";
import FemaleIcon from "@mui/icons-material/WomanOutlined";
import MaleIcon from "@mui/icons-material/ManOutlined";
import IconButton from "@mui/material/IconButton";
import { COLORS } from "@/constants/colors";
import GoogleIcon from "@mui/icons-material/Google";

interface RegistrationFormProps {
  onSubmit: (data: SignUpFormData) => void;
  loading: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  loading,
}) => {
  const { t } = useTranslate();
  const [showPassword, setShowPassword] = useState(false);
  const birthDateRef = useRef<HTMLInputElement>(null);

  // Calculate max date (13 years ago)
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 13,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(SignUpSchema(t)),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      country_code: "+91", // Default to India code
      gender: undefined,
      country: "India",
      birth_date: maxDate,
    },
  });

  const selectedCountryCode = watch("country_code");
  const gender = watch("gender");
  const selectedCountry = countries.find(
    (c) => c.phone_code === selectedCountryCode
  );

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{
        width: { xl: "100%" },
      }}
    >
      <Grid container spacing={2}>
        {/* First Name & Last Name */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              fontWeight: 500,
              fontSize: { lg: "0.875rem", xl: "1rem" },
            }}
          >
            {t("first_name")}*
          </Typography>
          <Input
            name="first_name"
            control={control}
            placeholder="Masruq Jaun"
            startIcon={<PersonIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              fontWeight: 500,
              fontSize: { lg: "0.875rem", xl: "1rem" },
            }}
          >
            {t("last_name")}*
          </Typography>
          <Input
            name="last_name"
            control={control}
            placeholder="Haik"
            startIcon={<PersonIcon />}
          />
        </Grid>

        {/* Email */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              fontWeight: 500,
              fontSize: { lg: "0.875rem", xl: "1rem" },
            }}
          >
            {t("email_address")}*
          </Typography>
          <Input
            name="email"
            control={control}
            placeholder="masruqjaunhaik@mail.in"
            startIcon={<EmailIcon />}
          />
        </Grid>

        {/* Phone Number */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              fontWeight: 500,
              fontSize: { lg: "0.875rem", xl: "1rem" },
            }}
          >
            {t("phone_number")}*
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {/* Country Code Selector */}
            <Box
              sx={{
                width: { sm: "60px", lg: "75px", md: "85px" },
              }}
            >
              <Input
                name="country_code"
                control={control}
                select
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {selectedCountry?.flag}
                    </InputAdornment>
                  ),
                }}
              >
                {countries.map((option) => (
                  <MenuItem key={option.code} value={option.phone_code}>
                    {option.phone_code}
                  </MenuItem>
                ))}
              </Input>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Input
                name="phone_number"
                control={control}
                placeholder="621 121221"
              />
            </Box>
          </Box>
        </Grid>

        {/* Password */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              fontWeight: 500,
              fontSize: { lg: "0.875rem", xl: "1rem" },
            }}
          >
            {t("password")}*
          </Typography>
          <Input
            name="password"
            control={control}
            type={showPassword ? "text" : "password"}
            placeholder="********"
            startIcon={<LockIcon />}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Country */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              fontWeight: 500,
              fontSize: { lg: "0.875rem", xl: "1rem" },
            }}
          >
            {t("country")}*
          </Typography>
          <Input
            name="country"
            control={control}
            select
            placeholder="Select Country"
            SelectProps={{
              renderValue: (selected: any) => {
                const country = countries.find((c) => c.name === selected);
                return (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <span style={{ marginRight: 8 }}>{country?.flag}</span>
                    {selected}
                  </Box>
                );
              },
            }}
          >
            {countries.map((option) => (
              <MenuItem key={option.code} value={option.name}>
                <span style={{ marginRight: 8 }}>{option.flag}</span>{" "}
                {option.name}
              </MenuItem>
            ))}
          </Input>
        </Grid>

        {/* Birth Date */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              fontWeight: 500,
              fontSize: { lg: "0.875rem", xl: "1rem" },
            }}
          >
            {t("birth_date")}*
          </Typography>
          <Input
            name="birth_date"
            control={control}
            type="date"
            inputRef={birthDateRef}
            InputProps={{
              inputProps: { max: maxDate },
            }}
            startIcon={
              <CalendarIcon
                sx={{ cursor: "pointer" }}
                onClick={() => birthDateRef.current?.showPicker()}
              />
            }
          />
        </Grid>

        {/* Gender */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              fontWeight: 500,
              fontSize: { lg: "0.875rem", xl: "1rem" },
            }}
          >
            {t("gender")}
          </Typography>
          <Input
            name="gender"
            control={control}
            select
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected: any) => {
                if (!selected) {
                  return (
                    <Typography color="textSecondary">
                      {t("select_gender")}*
                    </Typography>
                  );
                }
                const genderOptions: Record<string, string> = {
                  MALE: t("male"),
                  FEMALE: t("female"),
                  OTHER: t("other"),
                  PREFER_NOT_TO_SAY: t("prefer_not_to_say"),
                };
                return genderOptions[selected] || selected;
              },
            }}
            startIcon={gender === "MALE" ? <MaleIcon /> : <FemaleIcon />}
          >
            <MenuItem value="MALE">{t("male")}</MenuItem>
            <MenuItem value="FEMALE">{t("female")}</MenuItem>
            <MenuItem value="OTHER">{t("other")}</MenuItem>
            <MenuItem value="PREFER_NOT_TO_SAY">
              {t("prefer_not_to_say")}
            </MenuItem>
          </Input>
        </Grid>
      </Grid>
      <Typography
        variant="body1"
        color="textSecondary"
        sx={{
          mt: { xs: 2, sm: 3 },
          display: "block",
          textAlign: "center",
          fontSize: { lg: "0.75rem", xl: "0.875rem" },
        }}
      >
        {t("by_signup_to_accept")}{" "}
        <span style={{ textDecoration: "underline", fontWeight: 600 }}>
          {t("privacy_policy")}
        </span>{" "}
        and{" "}
        <span style={{ textDecoration: "underline", fontWeight: 600 }}>
          {t("termsConditionsTitle")}
        </span>
      </Typography>

      <Box
        sx={{
          mt: { xs: 3, sm: 4 },
          display: "flex",
          gap: 2,
          flexDirection: "column",
        }}
      >
        <Button
          fullWidth
          size="large"
          type="submit"
          isLoading={loading}
          variant="contained"
          sx={{
            borderRadius: "50px",
          }}
        >
          {t("signup")}
        </Button>
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          sx={{
            bgcolor: COLORS.DARK,
            color: COLORS.WHITE,
            textTransform: "none",
            borderRadius: "50px",
            "&:hover": {
              bgcolor: COLORS.DARK,
              opacity: 0.9,
            },
          }}
        >
          {t("continue_with_google")}
        </Button>
      </Box>
    </Box>
  );
};

export default RegistrationForm;
