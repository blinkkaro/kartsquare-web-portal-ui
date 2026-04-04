"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  useTheme,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  TextField,
  IconButton,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { State, City } from "country-state-city";
import { HomeOutlined, WorkOutline, LocationOnOutlined, LocationOn } from "@mui/icons-material";
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

  const [step, setStep] = useState<"map" | "form">("map");

  const {
    coordinates,
    error: locationError,
    getCoordinates,
  } = useGeolocation();

  useEffect(() => {
    if (open) {
      getCoordinates();
      setStep(mode === "edit" ? "form" : "map");
    } else {
      setTimeout(() => setStep(mode === "edit" ? "form" : "map"), 300);
    }
  }, [open, mode]);

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
  } = useAddressMap({
    initialData,
    setValue,
    coordinates,
    watch, 
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

  const indianStates = State.getStatesOfCountry("IN");
  const currentStateName = watch("state");
  const currentStateObj = indianStates.find((s) => s.name === currentStateName);
  const cities = currentStateObj
    ? City.getCitiesOfState("IN", currentStateObj.isoCode)
    : [];

  const closeDrawer = () => {
    onClose();
    reset();
  };

  const isDarkMode = theme.palette.mode === "dark";
  const bgSubtle = isDarkMode ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.PURPLE_ALPHA_04;
  const tagValue = watch("address_name");

  return (
    <RightDrawer
      open={open}
      onClose={closeDrawer}
      title={step === "map" ? "Select Delivery Location" : (mode === "add" ? t("addNewAddress") : t("editAddress"))}
      width={600}
    >
      <Box sx={{ px: 3, pb: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <ErrorMessage
          error={error || locationError || ""}
          isVisible={(!!error || !!locationError) && open}
        />
        
        <form onSubmit={handleSubmit(handleFormSubmit)} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          
          {step === "map" && (
            <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, height: "calc(100vh - 180px)" }}>
              <Box sx={{ position: "relative", flexGrow: 1, borderRadius: "16px", overflow: "hidden", mb: 3 }}>
                <MapView
                  latitude={mapCoordinates.lat}
                  longitude={mapCoordinates.lng}
                  onLocationChange={handleMapLocationChange}
                  height="100%"
                />
                
                <Box sx={{ position: "absolute", top: 16, left: 16, right: 16, zIndex: 1000 }}>
                  <MapSearchSuggestions
                    currentLocation={mapCoordinates}
                    onLocationSelect={handleLocationSelect}
                  />
                </Box>
              </Box>

              {/* Bottom Target Sheet */}
              <Box sx={{ 
                p: 3, 
                bgcolor: isDarkMode ? COLORS.BACKGROUND.PAPER_DARK : COLORS.WHITE, 
                borderRadius: "24px", 
                border: `1px solid ${isDarkMode ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
                boxShadow: `0 4px 24px ${COLORS.SHADOW.DEFAULT}` 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                  <LocationOn sx={{ color: COLORS.PRIMARY_PURPLE, fontSize: 32, mr: 2, mt: 0.5 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, mb: 0.5 }}>
                      {watch("city_town") || "Locating..."}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {watch("address") || watch("landmark") || "Move the pin to set your exact location"}
                    </Typography>
                  </Box>
                </Box>
                
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setStep("form")}
                  sx={{ 
                    py: 1.8, 
                    borderRadius: "12px", 
                    bgcolor: COLORS.PRIMARY_PURPLE,
                    color: COLORS.WHITE,
                    fontWeight: 700,
                    fontSize: '1rem',
                  }}
                >
                  Confirm Location & Proceed
                </Button>
              </Box>
            </Box>
          )}

          {step === "form" && (
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              {/* Mini Map Banner */}
              <Box sx={{ height: 140, mb: 3, borderRadius: "16px", overflow: "hidden", position: 'relative', flexShrink: 0 }}>
                <MapView
                  latitude={mapCoordinates.lat}
                  longitude={mapCoordinates.lng}
                  height="100%"
                />
                <Box sx={{ position: 'absolute', inset: 0, zIndex: 10, ...(!isDarkMode && { bgcolor: 'rgba(255,255,255,0.1)' }) }} />
                <Button 
                  onClick={() => setStep("map")}
                  sx={{ 
                    position: 'absolute', bottom: 12, right: 12, zIndex: 11, 
                    bgcolor: COLORS.WHITE, color: COLORS.PRIMARY_PURPLE, 
                    fontWeight: 600, py: 0.5, px: 2, borderRadius: '8px',
                    boxShadow: `0 2px 8px ${COLORS.SHADOW.DEFAULT}`,
                    '&:hover': { bgcolor: COLORS.WHITE } 
                  }}
                >
                  Change
                </Button>
              </Box>

              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ mb: 2.5, fontWeight: 700, fontSize: '1.25rem' }}>
                  Enter complete address
                </Typography>

                <Grid container spacing={2.5}>
                  
                  {/* Save As Tags */}
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: isDarkMode ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT }}>
                      Save address as <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                      {['Home', 'Work', 'Other'].map(tag => {
                        const isSelected = tag === 'Other' 
                          ? (tagValue !== 'Home' && tagValue !== 'Work')
                          : tagValue === tag;
                        const Icon = tag === 'Home' ? HomeOutlined : tag === 'Work' ? WorkOutline : LocationOnOutlined;

                        return (
                          <Button
                            key={tag}
                            onClick={() => {
                              if (tag === 'Other') {
                                if (tagValue === 'Home' || tagValue === 'Work') setValue("address_name", "", { shouldValidate: true });
                              } else {
                                setValue("address_name", tag, { shouldValidate: true });
                              }
                            }}
                            sx={{
                              flex: 1,
                              minWidth: '100px',
                              py: 1,
                              borderRadius: '12px',
                              border: `1px solid ${isSelected ? COLORS.PRIMARY_PURPLE : (isDarkMode ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT)}`,
                              bgcolor: isSelected ? bgSubtle : 'transparent',
                              color: isSelected ? COLORS.PRIMARY_PURPLE : (isDarkMode ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT),
                              fontWeight: isSelected ? 700 : 500,
                              textTransform: 'none',
                              '&:hover': {
                                borderColor: COLORS.PRIMARY_PURPLE,
                                bgcolor: bgSubtle
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Icon sx={{ mr: 1, fontSize: 20 }} />
                              {tag}
                            </Box>
                          </Button>
                        );
                      })}
                    </Box>
                    {(tagValue !== 'Home' && tagValue !== 'Work') && (
                      <Box sx={{ mt: 1.5 }}>
                        <Input
                          name="address_name"
                          control={control}
                          placeholder="e.g. Friend's House"
                          size="small"
                        />
                      </Box>
                    )}
                  </Grid>

                  {/* House / Flat / Block No. */}
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, color: isDarkMode ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT }}>
                      House / Flat / Block No. <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ flex: 2 }}>
                        <Input name="building_no" control={control} placeholder="House/Flat No." size="small" />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Input name="floor" control={control} placeholder="Floor" size="small" />
                      </Box>
                    </Box>
                  </Grid>

                  {/* Apartment / Road / Area */}
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, color: isDarkMode ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT }}>
                      Apartment / Road / Area <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
                    </Typography>
                    <Input name="address" control={control} placeholder="Street Name or Locality" size="small" />
                  </Grid>

                  {/* Landmark */}
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, color: isDarkMode ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT }}>
                      Landmark
                    </Typography>
                    <Input name="landmark" control={control} placeholder="Nearby landmark" size="small" />
                  </Grid>

                  {/* Location Details Block */}
                  <Grid size={{ xs: 12 }}>
                    <Box sx={{ 
                      p: 2, 
                      bgcolor: bgSubtle, 
                      borderRadius: '12px', 
                      border: `1px solid ${isDarkMode ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}` 
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: isDarkMode ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT }}>
                        Auto-filled Location Details
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                          <Controller
                            name="state"
                            control={control}
                            render={({ field, fieldState }) => (
                              <Autocomplete
                                options={indianStates.map((s) => s.name)}
                                value={field.value || null}
                                onChange={(_, newValue) => {
                                  setValue("state", newValue || "", { shouldValidate: true, shouldDirty: true });
                                  setValue("city_town", "", { shouldValidate: true, shouldDirty: true });
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    inputRef={field.ref}
                                    placeholder={t("selectState")}
                                    size="small"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    sx={{
                                      bgcolor: isDarkMode ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.WHITE,
                                      borderRadius: "12px",
                                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                                    }}
                                  />
                                )}
                              />
                            )}
                          />
                        </Grid>
                        
                        <Grid size={{ xs: 6 }}>
                          <Controller
                            name="city_town"
                            control={control}
                            render={({ field, fieldState }) => (
                              <Autocomplete
                                options={cities.map((c) => c.name)}
                                value={field.value || null}
                                onChange={(_, newValue) => {
                                  setValue("city_town", newValue || "", { shouldValidate: true, shouldDirty: true });
                                }}
                                disabled={!currentStateName}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    inputRef={field.ref}
                                    placeholder={t("selectCityTown")}
                                    size="small"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    sx={{
                                      bgcolor: isDarkMode ? COLORS.BACKGROUND.PRIMARY_DARK : COLORS.WHITE,
                                      borderRadius: "12px",
                                      "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                                    }}
                                  />
                                )}
                              />
                            )}
                          />
                        </Grid>
                        
                        <Grid size={{ xs: 6 }}>
                          <Input name="pincode" control={control} placeholder={t("enterPincode")} size="small" />
                        </Grid>
                        
                        <Grid size={{ xs: 6 }}>
                          <Input name="country" control={control} placeholder={t("selectCountry")} size="small" disabled />
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>

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
                                color: isDarkMode ? COLORS.TEXT.SECONDARY_DARK : COLORS.TEXT.SECONDARY_LIGHT,
                                "&.Mui-checked": { color: COLORS.PRIMARY_PURPLE },
                              }}
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ color: isDarkMode ? COLORS.TEXT.PRIMARY_DARK : COLORS.TEXT.PRIMARY_LIGHT }}>
                              {t("saveAsDefault")}
                            </Typography>
                          }
                        />
                      )}
                    />
                  </Grid>

                </Grid>
              </Box>

              <Box sx={{ mt: 4, pt: 2, pb: 1, borderTop: `1px solid ${isDarkMode ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`}}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isPending}
                  sx={{
                    bgcolor: COLORS.PRIMARY_PURPLE,
                    color: COLORS.WHITE,
                    py: 1.8,
                    borderRadius: "12px",
                    textTransform: "none",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    boxShadow: `0 8px 16px ${COLORS.PURPLE_ALPHA_04}`,
                    "&:hover": { bgcolor: COLORS.PURPLE_HOVER },
                  }}
                >
                  {isPending ? t("submitting") : mode === "add" ? "Save Address" : t("update")}
                </Button>
              </Box>
            </Box>
          )}

        </form>
      </Box>
    </RightDrawer>
  );
};

export default AddressDrawer;
