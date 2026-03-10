import React from "react";
import { Box, Typography, IconButton, MenuItem } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { Control, UseFormHandleSubmit } from "react-hook-form";
import { useTranslate } from "@/hooks/useTranslate";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { GuestLoginFormData } from "../guestLogin.schema";
import { countries } from "../../../pages/SignUp/components/data";

interface GuestFormViewProps {
  control: Control<GuestLoginFormData>;
  handleSubmit: UseFormHandleSubmit<GuestLoginFormData>;
  onSubmitGuest: (data: GuestLoginFormData) => Promise<void>;
  loading: boolean;
  isSubmitting: boolean;
  onBack: () => void;
}

export const GuestFormView: React.FC<GuestFormViewProps> = ({
  control,
  handleSubmit,
  onSubmitGuest,
  loading,
  isSubmitting,
  onBack,
}) => {
  const { t } = useTranslate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <IconButton onClick={onBack} sx={{ ml: -1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {t("guest_login")}
        </Typography>
      </Box>

      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        {t("guest_login_description")}
      </Typography>

      <form onSubmit={handleSubmit(onSubmitGuest)}>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 2 }}>
          <Box sx={{ gridColumn: "span 6" }}>
            <Input
              name="first_name"
              control={control}
              placeholder={t("first_name")}
              label={t("first_name")}
            />
          </Box>
          <Box sx={{ gridColumn: "span 6" }}>
            <Input
              name="last_name"
              control={control}
              placeholder={t("last_name")}
              label={t("last_name")}
            />
          </Box>
          <Box sx={{ gridColumn: "span 12" }}>
            <Input
              name="email"
              control={control}
              placeholder={t("email_address")}
              label={t("email")}
              type="email"
            />
          </Box>
          <Box sx={{ gridColumn: "span 4" }}>
            <Input
              name="country_code"
              control={control}
              select
              label={t("code")}
              InputProps={{
                sx: {
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
          <Box sx={{ gridColumn: "span 8" }}>
            <Input
              name="phone_number"
              control={control}
              placeholder={t("phone_number")}
              label={t("phone_number")}
              type="tel"
            />
          </Box>
          <Box sx={{ gridColumn: "span 12" }}>
            <Input
              name="country"
              control={control}
              select
              label={t("country")}
              placeholder={t("country")}
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
          </Box>
          <Box sx={{ gridColumn: "span 12" }}>
            <Input
              name="password"
              control={control}
              placeholder={t("password")}
              label={t("password")}
              type="password"
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
          <Button
            variant="contained"
            fullWidth
            type="submit"
            isLoading={loading || isSubmitting}
            sx={{ borderRadius: "50px", py: 1.5 }}
          >
            {t("submit")}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default GuestFormView;
