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
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Search } from "@mui/icons-material";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import RightDrawer from "@/components/common/RightDrawer";
import { useTranslationContext } from "@/features/i18n/TranslationContext";
import { Address } from "@/services/address/addressInterface";
import { COLORS } from "@/constants/colors";
import {
  COUNTRIES,
  getAllStates,
  getCitiesByState,
  DEFAULT_COUNTRY,
  DEFAULT_STATE,
  DEFAULT_CITY,
} from "@/constants/locations";
import { createAddressSchema, AddressFormData } from "./AddressSchema";
import { useAddAddress, useUpdateAddress } from "@/hooks/useAddress";
import ErrorMessage from "../ErrorMessage";
import { useGeolocation } from "@/hooks/useGeolocation";

interface AddressDrawerProps {
  open: boolean;
  onClose: () => void;
  isLoading?: boolean;
  initialData?: Address | null;
  mode: "add" | "edit";
}

const AddressDrawer: React.FC<AddressDrawerProps> = ({
  open,
  onClose,
  initialData = null,
  mode,
}) => {
  const { t } = useTranslationContext();
  const theme = useTheme();
  const [selectedCountry, setSelectedCountry] =
    useState<string>(DEFAULT_COUNTRY);
  const [selectedState, setSelectedState] = useState<string>(DEFAULT_STATE);
  const [availableCities, setAvailableCities] = useState(
    getCitiesByState(DEFAULT_STATE)
  );
  const addAddressMutation = useAddAddress();
  const updateAddressMutation = useUpdateAddress();
  const [error, setError] = useState<string>("");
  const {
    coordinates,
    isLoading,
    error: locationError,
    getCoordinates,
  } = useGeolocation();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: yupResolver(createAddressSchema(t)),
    defaultValues: {
      address_name: "",
      building_no: "",
      floor: "",
      address: "",
      landmark: "",
      pincode: "",
      city_town: DEFAULT_CITY,
      state: DEFAULT_STATE,
      country: DEFAULT_COUNTRY,
      is_default: false,
    },
  });

  useEffect(() => {
    if (initialData && mode === "edit") {
      const state = initialData.state || DEFAULT_STATE;
      const country = initialData.country || DEFAULT_COUNTRY;

      setSelectedCountry(country);
      setSelectedState(state);
      setAvailableCities(getCitiesByState(state));

      reset({
        address_name: initialData.address_name || "",
        building_no: initialData.building_no || "",
        floor: initialData.floor || "",
        address: initialData.address || "",
        landmark: initialData.landmark || "",
        pincode: initialData.pincode || "",
        city_town: initialData.city_town || DEFAULT_CITY,
        state: state,
        country: country,
        is_default: initialData.is_default || false,
      });
    } else if (mode === "add") {
      setSelectedCountry(DEFAULT_COUNTRY);
      setSelectedState(DEFAULT_STATE);
      setAvailableCities(getCitiesByState(DEFAULT_STATE));

      reset({
        address_name: "",
        building_no: "",
        floor: "",
        address: "",
        landmark: "",
        pincode: "",
        city_town: DEFAULT_CITY,
        state: DEFAULT_STATE,
        country: DEFAULT_COUNTRY,
        is_default: false,
        latitude: coordinates?.latitude,
        longitude: coordinates?.longitude,
      });
    }
  }, [initialData, mode, reset, open, coordinates]);

  useEffect(() => {
    getCoordinates();
  }, [open]);

  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    const cities = getCitiesByState(newState);
    setAvailableCities(cities);
    // Reset city when state changes
    if (cities.length > 0) {
      setValue("city_town", cities[0].value);
    } else {
      setValue("city_town", "");
    }
  };

  const handleFormSubmit = (data: AddressFormData) => {
    setError("");
    if (mode === "add") {
      handleAddAddress(data);
    } else {
      handleUpdateAddress(data);
    }
  };

  const handleAddAddress = (data: any) => {
    addAddressMutation.mutate(data, {
      onSuccess: () => {
        closeDrawer();
      },
      onError: (error: any) => {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong"
        );
      },
    });
  };

  const handleUpdateAddress = (data: any) => {
    if (!initialData?.id) {
      setError("Address ID is missing");
      return;
    }

    updateAddressMutation.mutate(
      { id: initialData.id, data },
      {
        onSuccess: () => {
          closeDrawer();
        },
        onError: (error: any) => {
          setError(
            error.response?.data?.message ||
              error.message ||
              "Something went wrong"
          );
        },
      }
    );
  };

  const closeDrawer = () => {
    onClose();
    reset();
  };

  return (
    <RightDrawer
      open={open}
      onClose={onClose}
      title={mode === "add" ? t("addNewAddress") : t("editAddress")}
      width={500}
    >
      <Box sx={{ px: 3, pb: 3 }}>
        <ErrorMessage
          error={error || locationError || ""}
          isVisible={!!error || !!locationError}
        />
      </Box>
      <Box sx={{ px: 3, pb: 3 }}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Map Placeholder Section */}
          <Box
            sx={{
              width: "100%",
              height: "200px",
              bgcolor:
                theme.palette.mode === "dark"
                  ? COLORS.BACKGROUND.PRIMARY_DARK
                  : COLORS.LIGHT_GRAY,
              borderRadius: "12px",
              mb: 3,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Search Bar Overlay */}
            <Box
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                right: 16,
                zIndex: 1,
              }}
            >
              <Input
                name="mapSearch"
                control={control}
                placeholder={t("search") || "Search..."}
                size="small"
                startIcon={<Search fontSize="small" />}
                InputProps={{
                  sx: {
                    bgcolor: COLORS.WHITE,
                    borderRadius: "8px",
                    "& fieldset": {
                      border: "none",
                    },
                  },
                }}
              />
            </Box>

            {/* Map Placeholder Content */}
            <Typography
              variant="body2"
              sx={{
                color:
                  theme.palette.mode === "dark"
                    ? COLORS.TEXT.SECONDARY_DARK
                    : COLORS.TEXT.SECONDARY_LIGHT,
                fontStyle: "italic",
              }}
            >
              {/* Map will be integrated here */}
            </Typography>
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
                select
                placeholder={t("selectCityTown")}
                size="small"
              >
                {availableCities.map((city) => (
                  <MenuItem key={city.value} value={city.value}>
                    {city.label}
                  </MenuItem>
                ))}
              </Input>
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
                select
                placeholder={t("selectState")}
                size="small"
                onChange={(e) => {
                  setValue("state", e.target.value);
                  handleStateChange(e.target.value);
                }}
              >
                {getAllStates().map((state) => (
                  <MenuItem key={state.value} value={state.value}>
                    {state.label}
                  </MenuItem>
                ))}
              </Input>
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
                select
                placeholder={t("selectCountry")}
                size="small"
                onChange={(e) => {
                  setValue("country", e.target.value);
                  setSelectedCountry(e.target.value);
                }}
              >
                {COUNTRIES.map((country) => (
                  <MenuItem key={country.value} value={country.value}>
                    {country.label}
                  </MenuItem>
                ))}
              </Input>
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
                isLoading={
                  mode === "add"
                    ? addAddressMutation.isPending
                    : updateAddressMutation.isPending
                }
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
