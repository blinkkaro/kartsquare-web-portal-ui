"use client";
import React, { useState, useRef } from "react";
import {
  Grid,
  MenuItem,
  InputAdornment,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
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
  role: AppUserType;
  initialData?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    country_code?: string;
    country?: string;
    birth_date?: string;
    gender?: string;
    whatsapp_number?: string;
    whatsapp_country_code?: string;
  };
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  loading,
  role,
  initialData,
}) => {
  const { t } = useTranslate();
  const [showPassword, setShowPassword] = useState(false);
  // const [isSameAsPhone, setIsSameAsPhone] = useState(false);
  const birthDateRef = useRef<HTMLInputElement>(null);

  // Calculate max date (13 years ago)
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 13,
    today.getMonth(),
    today.getDate(),
  )
    .toISOString()
    .split("T")[0];

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(SignUpSchema(t, role)),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      country_code: "+91",
      gender: undefined,
      country: "India",
      birth_date: maxDate,
      role: role,
      whatsapp_number: initialData?.whatsapp_number || "",
      whatsapp_country_code: initialData?.whatsapp_country_code || "+91",
    },
  });

  React.useEffect(() => {
    if (!initialData) return;
    if (initialData.first_name) setValue("first_name", initialData.first_name);
    if (initialData.last_name) setValue("last_name", initialData.last_name);
    if (initialData.email) setValue("email", initialData.email);
    if (initialData.phone_number)
      setValue("phone_number", initialData.phone_number);
    if (initialData.country_code)
      setValue("country_code", initialData.country_code);
    if (initialData.country) setValue("country", initialData.country);
    if (initialData.birth_date) {
      // Convert ISO date string to YYYY-MM-DD format for the date input
      setValue("birth_date", initialData.birth_date.split("T")[0]);
    }
    if (initialData.gender)
      setValue("gender", initialData.gender as SignUpFormData["gender"]);
    if (initialData.whatsapp_number)
      setValue("whatsapp_number", initialData.whatsapp_number);
    if (initialData.whatsapp_country_code)
      setValue("whatsapp_country_code", initialData.whatsapp_country_code);
  }, [initialData, setValue]);

  const selectedCountryCode = watch("country_code");
  const whatsappCountryCode = watch("whatsapp_country_code");
  const gender = watch("gender");
  const whatsappNumber = watch("whatsapp_number");
  const selectedCountry = countries.find(
    (c) => c.phone_code === selectedCountryCode,
  );
  const selectedWhatsappCountry = countries.find(
    (c) => c.phone_code === whatsappCountryCode,
  );

  // React.useEffect(() => {
  //   if (isSameAsPhone) {
  //     setValue("phone_number", whatsappNumber || "");
  //     setValue("country_code", whatsappCountryCode || "");
  //   }
  // }, [isSameAsPhone, whatsappNumber, whatsappCountryCode, setValue]);

  // const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setIsSameAsPhone(event.target.checked);
  //   if (event.target.checked) {
  //     setValue("phone_number", whatsappNumber || "");
  //     setValue("country_code", whatsappCountryCode || "");
  //   } else {
  //     setValue("phone_number", "");
  //     setValue("country_code", "+91");
  //   }
  // };

  const isServiceProvider =
    role === AppUserType.SERVICE_PROVIDER || role === AppUserType.SUPPLIER;

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
            placeholder="Arjun"
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
            placeholder="Sharma"
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
            placeholder="arjun.sharma@mail.in"
            startIcon={<EmailIcon />}
          />
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

        {/* WhatsApp Number — hidden, number is used to prefill phone field */}
        {/* {isServiceProvider && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                fontWeight: 500,
                fontSize: { lg: "0.875rem", xl: "1rem" },
              }}
            >
              {t("whatsapp_number")}*
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Box
                sx={{
                  width: { sm: "70px", lg: "95px", md: "105px" },
                }}
              >
                <Input
                  name="whatsapp_country_code"
                  control={control}
                  select
                  disabled={!!initialData?.whatsapp_country_code}
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
                  name="whatsapp_number"
                  control={control}
                  placeholder="98765 43210"
                  type="tel"
                  InputProps={{ readOnly: !!initialData?.whatsapp_number }}
                  inputProps={{ maxLength: 10, inputMode: "numeric", pattern: "[0-9]*" }}
                />
              </Box>
            </Box>
          </Grid>
        )} */}
        {/* Phone Number */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                fontSize: { lg: "0.875rem", xl: "1rem" },
              }}
            >
              {t("phone_number")}*
            </Typography>
            {/* Same-as-WhatsApp checkbox removed — phone is prefilled from lead */}
            {/* {isServiceProvider && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isSameAsPhone}
                    onChange={handleCheckboxChange}
                    size="small"
                    sx={{ padding: 0, mr: 1 }}
                  />
                }
                label={
                  <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
                    {t("same_as_whatsapp")}
                  </Typography>
                }
                sx={{ margin: 0 }}
              />
            )} */}
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Box
              sx={{
                width: { sm: "70px", lg: "95px", md: "105px" },
              }}
            >
              <Input
                name="country_code"
                control={control}
                select
                disabled={!!initialData?.phone_number}
                InputProps={{
                  sx: {
                    bgcolor: initialData?.phone_number
                      ? "rgba(0, 0, 0, 0.05)"
                      : "transparent",
                    "& .MuiSelect-select": {
                      paddingLeft: "8px !important",
                      paddingRight: "24px !important",
                    },
                  },
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
                placeholder="98765 43210"
                type="tel"
                InputProps={{
                  readOnly: !!initialData?.phone_number,
                  sx: {
                    bgcolor: initialData?.phone_number
                      ? "rgba(0, 0, 0, 0.05)"
                      : "transparent",
                  },
                }}
                inputProps={{
                  maxLength: 10,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
              />
            </Box>
          </Box>
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

        <>
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
        </>
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
      </Box>
    </Box>
  );
};

export default RegistrationForm;
