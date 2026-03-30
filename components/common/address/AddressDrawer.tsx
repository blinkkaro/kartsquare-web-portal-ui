"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  useTheme,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  MenuItem,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { Search } from "@mui/icons-material";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import RightDrawer from "@/components/common/RightDrawer";
import { useTranslationContext } from "@/features/i18n/TranslationContext";
import { Address } from "@/services/address/addressInterface";
import { COLORS } from "@/constants/colors";
import { AddressFormData } from "./AddressSchema";
import { useAddressForm } from "@/hooks/useAddressForm";
import { useAddressMap } from "@/hooks/useAddressMap";
import { useAddressSubmit } from "@/hooks/useAddressSubmit";
import ErrorMessage from "../ErrorMessage";
import { useGeolocation } from "@/hooks/useGeolocation";
import MapView from "./components/mapView";
import MapSearchSuggestions from "./components/MapSearchSuggestions";

interface AddressDrawerProps {
  open: boolean;
  onClose: () => void;
  isLoading?: boolean;
  initialData?: Address | null;
  mode: "add" | "edit";
  isDefault?: boolean;
}

const AddressDrawer: React.FC<AddressDrawerProps> = ({
  open,
  onClose,
  initialData = null,
  mode,
  isDefault = false,
}) => {
  const { t } = useTranslationContext();
  const theme = useTheme();
  const [error, setError] = useState<string>("");

  const {
    coordinates,
    isLoading: isLocationLoading, // Rename to avoid conflict if needed, or simply use isLoading
    error: locationError,
    getCoordinates,
  } = useGeolocation();

  useEffect(() => {
    if (open) {
      getCoordinates();
    }
  }, [open]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useAddressForm({
    initialData,
    mode,
    open,
    coordinates,
    isDefault: isDefault ? true : false,
  });

  const { 
    mapCoordinates, 
    handleMapLocationChange, 
    handleLocationSelect,
    refreshAddressFromMap 
  } = useAddressMap({
      initialData,
      setValue,
      coordinates,
      watch, // Pass extracted watch
    });

  const { handleFormSubmit, isPending } = useAddressSubmit({
    mode,
    initialData,
    onSuccess: () => {
      onClose();
      reset();
    },
    onError: (msg) => setError(msg),
  });

  // handleFormSubmit from hook handles the mutation logic

  const closeDrawer = () => {
    onClose();
    reset();
  };

  return (
    <RightDrawer
      open={open}
      onClose={onClose}
      title={mode === "add" ? t("addNewAddress") : t("editAddress")}
      width={600}
    >
      <Box sx={{ px: 3, pb: 3 }}>
        <ErrorMessage
          error={error || locationError || ""}
          isVisible={(!!error || !!locationError) && open}
        />
      </Box>
      <Box sx={{ px: 3, pb: 3 }}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Map Section with Search Overlay */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              borderRadius: "12px",
              mb: 3,
              overflow: "hidden",
            }}
          >
            <MapView
              latitude={mapCoordinates.lat}
              longitude={mapCoordinates.lng}
              onLocationChange={handleMapLocationChange}
              height="25rem"
            />

            {/* Search Section - Positioned on top of map */}
            <Box
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                right: 16,
                zIndex: 1000,
              }}
            >
              <MapSearchSuggestions
                currentLocation={mapCoordinates}
                onLocationSelect={handleLocationSelect}
              />
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1000,
                width: "fit-content",
                whiteSpace: "nowrap",
              }}
            >
              <Button
                variant="contained"
                onClick={refreshAddressFromMap}
                sx={{
                  borderRadius: "50px",
                  boxShadow: `0 4px 12px ${COLORS.SHADOW.DEFAULT}`,
                  px: 3,
                  py: 1,
                  bgcolor: COLORS.WHITE,
                  color: COLORS.PRIMARY_PURPLE,
                  border: `1px solid ${COLORS.PRIMARY_PURPLE}`,
                  "&:hover": {
                    bgcolor: COLORS.PURPLE_ALPHA_04,
                  },
                }}
              >
                {t("selectCurrentAddress")}
              </Button>
            </Box>
          </Box>

          {/* Form Fields */}
          <Grid container spacing={2}>
            {/* Address Name */}
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.5,
                  fontWeight: 500,
                  color:
                    theme.palette.mode === "dark"
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                }}
              >
                {t("addressName")}
                <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
              </Typography>
              <Input
                name="address_name"
                control={control}
                placeholder={t("enterAddressName")}
                size="small"
              />
            </Grid>

            {/* Building No & Floor */}
            <Grid size={{ xs: 6 }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.5,
                  fontWeight: 500,
                  color:
                    theme.palette.mode === "dark"
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                }}
              >
                {t("buildingNo")}
              </Typography>
              <Input
                name="building_no"
                control={control}
                placeholder="B"
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.5,
                  fontWeight: 500,
                  color:
                    theme.palette.mode === "dark"
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                }}
              >
                {t("floor")}
              </Typography>
              <Input
                name="floor"
                control={control}
                placeholder="12"
                size="small"
              />
            </Grid>

            {/* Address */}
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.5,
                  fontWeight: 500,
                  color:
                    theme.palette.mode === "dark"
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                }}
              >
                {t("address")}
                <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
              </Typography>
              <Input
                name="address"
                control={control}
                placeholder="Bharat"
                size="small"
              />
            </Grid>

            {/* Landmark */}
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.5,
                  fontWeight: 500,
                  color:
                    theme.palette.mode === "dark"
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                }}
              >
                {t("landmark")}
                <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
              </Typography>
              <Input
                name="landmark"
                control={control}
                placeholder={t("enterLandmark")}
                size="small"
              />
            </Grid>

            {/* Pincode & City/Town */}
            <Grid size={{ xs: 6 }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.5,
                  fontWeight: 500,
                  color:
                    theme.palette.mode === "dark"
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                }}
              >
                {t("pincode")}
                <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
              </Typography>
              <Input
                name="pincode"
                control={control}
                placeholder={t("enterPincode")}
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.5,
                  fontWeight: 500,
                  color:
                    theme.palette.mode === "dark"
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                }}
              >
                {t("cityTown")}
                <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
              </Typography>
              <Input
                name="city_town"
                control={control}
                placeholder={t("selectCityTown")}
                size="small"
                disabled
              />
            </Grid>

            {/* State & Country */}
            <Grid size={{ xs: 6 }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.5,
                  fontWeight: 500,
                  color:
                    theme.palette.mode === "dark"
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                }}
              >
                {t("state")}
                <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
              </Typography>
              <Input
                name="state"
                control={control}
                placeholder={t("selectState")}
                size="small"
                disabled
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.5,
                  fontWeight: 500,
                  color:
                    theme.palette.mode === "dark"
                      ? COLORS.TEXT.PRIMARY_DARK
                      : COLORS.TEXT.PRIMARY_LIGHT,
                }}
              >
                {t("country")}
                <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
              </Typography>
              <Input
                name="country"
                control={control}
                placeholder={t("selectCountry")}
                size="small"
                disabled
              />
            </Grid>

            {/* Save as Default Checkbox */}
            <Grid size={{ xs: 12 }}>
              <Controller
                name="is_default"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value}
                        sx={{
                          color:
                            theme.palette.mode === "dark"
                              ? COLORS.TEXT.SECONDARY_DARK
                              : COLORS.TEXT.SECONDARY_LIGHT,
                          "&.Mui-checked": {
                            color: COLORS.PRIMARY_PURPLE,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            theme.palette.mode === "dark"
                              ? COLORS.TEXT.PRIMARY_DARK
                              : COLORS.TEXT.PRIMARY_LIGHT,
                        }}
                      >
                        {t("saveAsDefault")}
                      </Typography>
                    }
                  />
                )}
              />
            </Grid>

            {/* Submit Button */}
            <Grid size={{ xs: 12 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                isLoading={isPending}
                sx={{
                  py: 1.5,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                {t("add")}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </RightDrawer>
  );
};

export default AddressDrawer;
