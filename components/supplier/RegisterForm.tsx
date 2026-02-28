"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Typography,
  Stack,
  Link,
  useTheme,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
// Grid import removed to use Box/Flexbox

// Note: If Grid2 is not available, usually Grid is imported from @mui/material.
// However, the error log "Property 'item' does not exist" suggests new MUI Grid usage (v2) where 'item' prop is removed and it uses container/item implicitly or xs/sm directly on Grid.
// Let's assume standard Grid usage but removing 'item' prop if it was causing issues or just using Box for layout if Grid is finicky.
// Actually the previous error was: "Property 'item' does not exist...". This implies we are using MUI v6 Grid or Grid2.
// To be safe, let's use standard Grid from @mui/material but check if we need 'item'.
// If it's MUI v6, Grid is Grid2. Let's stick to Grid and try without 'item' explicitly if it accepts xs/sm directly.
/* 
  Correction: In modern MUI (Grid v2), `item` prop is deprecated/removed. 
  You just use `<Grid size={{ xs: 12, sm: 6 }}>` or similar depending on version.
  But since I don't know exact version, I will try to use the most compatible way or simpler Flexbox if needed.
  Wait, `package.json` said `@mui/material": "^7.3.6`. This is huge. MUI v7?? 
  Actually probably v5 or v6. v7 is not out? User might be on very latest.
  Let's assume Grid v2 syntax: `<Grid size={...}>` or just `<Grid xs={...}>` is not valid without `item` in v5, but in v6 it is `size`.
  Let's check `package.json` again. It said 7.3.6? That's likely very new or a typo in my reading or a custom version.
  Let's look at `Nav/index.tsx` ... it uses `styled` and `Box`.
  I will use `Grid` from `@mui/material` and use the `size` prop or just component composition.
  Actually, let's look at the error again: "Property 'item' does not exist". 
  This strongly suggests Grid v2. 
  I will use `<Grid container spacing={2}>` and `<Grid size={{ xs: 12, sm: 6 }}>` if possible, or just standard divs/Box if unsure.
  Let's try standard `<Grid container>` and `<Grid size={...}>`.
*/

import Input from "@/components/common/Input";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth/auth.service";
import { AppUserType, Gender } from "@/services/auth/auth.interface";
import Button from "../common/Button";
import { useTranslate } from "@/hooks/useTranslate";

const RegisterForm = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const schema = yup.object().shape({
    first_name: yup
      .string()
      .trim()
      .max(100, t("valNameMax"))
      .required(t("firstNameRequired")),
    last_name: yup
      .string()
      .trim()
      .max(100, t("valNameMax"))
      .required(t("lastNameRequired")),
    email: yup
      .string()
      .trim()
      .email(t("emailInvalid"))
      .lowercase()
      .max(255, t("valEmailMax"))
      .required(t("emailRequired")),
    phone_number: yup
      .string()
      .trim()
      .matches(/^[0-9]+$/, t("phoneNumberInvalid"))
      .length(10, t("valPhoneExact"))
      .required(t("phoneNumberRequired")),
    country_code: yup.string().trim().required(t("countryCodeRequired")),
    password: yup
      .string()
      .trim()
      .min(6, t("passwordMin"))
      .max(100, t("valNameMax"))
      .required(t("passwordRequired")),
    confirm_password: yup
      .string()
      .trim()
      .oneOf([yup.ref("password")], t("passwordMatch"))
      .required(t("confirmPasswordRequired")),
    gender: yup
      .string()
      .oneOf(Object.values(Gender))
      .required(t("genderRequired")),
    birth_date: yup.string().trim().required(t("birthDateRequired")),
  });

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      country_code: "+91",
      password: "",
      confirm_password: "",
      gender: Gender.MALE,
      birth_date: "",
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...data,
        country: "India", // Default or add field
        role: AppUserType.SUPPLIER,
      };

      delete payload.confirm_password;

      await authService.signUp(payload);

      router.push(
        `/supplier/verify-otp?email=${encodeURIComponent(data.email)}`,
      );
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || t("something_went_wrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "600px",
        mx: "auto",
        p: { xs: 2, sm: 4 }, // Responsive padding
        borderRadius: 2,
        boxShadow: { xs: "none", sm: "0px 4px 20px rgba(0,0,0,0.1)" }, // No shadow on mobile
        bgcolor: "background.paper",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="700"
        mb={1}
        textAlign="center"
        fontSize={{ xs: "1.5rem", sm: "2.125rem" }}
      >
        {t("supplier_registration_title")}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        mb={4}
        textAlign="center"
        fontSize={{ xs: "0.875rem", sm: "1rem" }}
      >
        {t("supplier_registration_subtitle")}
      </Typography>

      {error && (
        <Typography color="error" mb={2} textAlign="center">
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Using standard Grid with implicit item props or just Box for safety if Grid version is ambiguous.
            Given the lint error, I'll use Box with flexWrap to mimic Grid behavior safely without fighting the type system blindly.
         */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}>
            <Input
              name="first_name"
              control={control}
              label={t("first_name")}
              placeholder={t("first_name")}
            />
          </Box>
          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}>
            <Input
              name="last_name"
              control={control}
              label={t("last_name")}
              placeholder={t("last_name")}
            />
          </Box>

          <Box sx={{ flex: "1 1 100%" }}>
            <Input
              name="email"
              control={control}
              label={t("email_address")}
              placeholder={t("email_address")}
              type="email"
            />
          </Box>

          <Box sx={{ flex: "0 0 80px" }}>
            <Input
              name="country_code"
              control={control}
              label={t("code")}
              placeholder="+91"
            />
          </Box>
          <Box sx={{ flex: "1 1 calc(100% - 96px)" }}>
            <Input
              name="phone_number"
              control={control}
              label={t("phone_number")}
              placeholder={t("phone_number")}
              type="tel"
            />
          </Box>

          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}>
            <Input
              name="gender"
              control={control}
              label={t("gender")}
              select
              defaultValue={Gender.MALE}
            >
              {Object.values(Gender).map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Input>
          </Box>
          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)" } }}>
            <Input
              name="birth_date"
              control={control}
              label={t("birth_date")}
              type="date"
              InputProps={{
                inputProps: { max: new Date().toISOString().split("T")[0] },
              }}
            />
          </Box>

          <Box sx={{ flex: "1 1 100%" }}>
            <Input
              name="password"
              control={control}
              label={t("password")}
              type="password"
              placeholder={t("password")}
            />
          </Box>
          <Box sx={{ flex: "1 1 100%" }}>
            <Input
              name="confirm_password"
              control={control}
              label={t("confirmPassword")}
              type="password"
              placeholder={t("confirmPassword")}
            />
          </Box>
        </Box>

        <Box mt={4}>
          <Button fullWidth type="submit" isLoading={loading} size="large">
            {t("register_as_supplier")}
          </Button>
        </Box>

        <Stack direction="row" spacing={1} justifyContent="center" mt={2}>
          <Typography variant="body2">{t("alreadyHaveAnAccount")}</Typography>
          <Link
            href="/supplier/login"
            underline="hover"
            sx={{ cursor: "pointer", fontWeight: 600 }}
          >
            {t("login")}
          </Link>
        </Stack>
      </form>
    </Box>
  );
};

export default RegisterForm;
