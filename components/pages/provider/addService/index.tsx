"use client";
import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  useTheme,
} from "@mui/material";
import RightDrawer from "@/components/common/RightDrawer";
import { ServiceDetails } from "@/services/serviceDetails/serviceDetailsInterface";
import { COLORS } from "@/constants/colors";
import { english } from "@/features/i18n/en";
import { useServiceData } from "./useServiceData";
import { useServiceForm } from "./useServiceForm";
import ServiceImageUpload from "./ServiceImageUpload";
import ServiceBasicInfo from "./ServiceBasicInfo";
import ServicePricingOptions from "./ServicePricingOptions";
import ServiceDuration from "./ServiceDuration";
import ServiceLocation from "./ServiceLocation";

interface AddServiceDrawerProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editService?: ServiceDetails | null;
}

const AddServiceDrawer: React.FC<AddServiceDrawerProps> = ({
  open,
  onClose,
  onSuccess,
  editService,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [localCategoryId, setLocalCategoryId] = React.useState("");

  // Data fetching hook
  const {
    categories,
    subcategories,
    addresses,
    categoriesLoading,
    subcategoriesLoading,
    addressesLoading,
    error: dataError,
    setError: setDataError,
    refreshAddresses,
    setSubcategories,
  } = useServiceData(open, localCategoryId, "");

  // Form state hook
  const {
    categoryId,
    setCategoryId,
    subcategoryId,
    setSubcategoryId,
    serviceName,
    setServiceName,
    price,
    setPrice,
    description,
    setDescription,
    days,
    setDays,
    hours,
    setHours,
    minutes,
    setMinutes,
    locationType,
    setLocationType,
    visitingCharge,
    setVisitingCharge,
    selectedAddressId,
    setSelectedAddressId,
    serviceRadius,
    setServiceRadius,
    haveSlots,
    setHaveSlots,
    pricingType,
    setPricingType,
    priceCatalogFileNames,
    handleCatalogFileSelect,
    removeCatalogFile,
    clearPriceCatalog,
    priceItems,
    addPriceItem,
    removePriceItem,
    updatePriceItem,
    selectedImages,
    imagePreviews,
    handleImageSelect,
    handleRemoveImage,
    handleSubmit,
    loading,
    uploadingImages,
    error: formError,
    setError: setFormError,
    fieldErrors,
  } = useServiceForm({
    open,
    editService,
    onSuccess,
    onClose,
    setSubcategories,
  });

  // Sync local category ID with form category ID to trigger fetching
  useEffect(() => {
    setLocalCategoryId(categoryId);
  }, [categoryId]);

  // Auto-select first address when addresses load
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId && !editService) {
      const defaultAddr = addresses.find((addr) => addr.is_default);
      setSelectedAddressId(defaultAddr ? defaultAddr.id : addresses[0].id);
    }
  }, [addresses, selectedAddressId, editService, setSelectedAddressId]);

  const handleAddressAdded = async () => {
    const newAddresses = await refreshAddresses();
    if (newAddresses && newAddresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(newAddresses[0].id);
    }
  };

  const error = dataError || formError;
  const setError = (err: string) => {
    setDataError(err);
    setFormError(err);
  };

  return (
    <RightDrawer
      open={open}
      onClose={onClose}
      title={editService ? english.edit_service : english.add_service}
      width={620}
    >
      <Box sx={{ px: { xs: 2, sm: 3 }, pb: 3, pt: 1 }}>
        {error && (
          <Paper
            elevation={0}
            sx={{
              bgcolor: isDark
                ? "rgba(211, 47, 47, 0.08)"
                : "rgba(211, 47, 47, 0.06)",
              color: "error.main",
              p: 2,
              borderRadius: 2,
              mb: 2,
              border: `1px solid ${isDark ? "rgba(211, 47, 47, 0.3)" : "rgba(211, 47, 47, 0.2)"}`,
            }}
          >
            <Typography variant="body2">{error}</Typography>
          </Paper>
        )}

        {/* Service Info Section */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 2.5,
            borderRadius: 2,
            border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
            bgcolor: isDark
              ? COLORS.BACKGROUND.PAPER_DARK
              : COLORS.BACKGROUND.SECONDARY_LIGHT,
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            {english.service_info}
          </Typography>
          <ServiceImageUpload
            selectedImages={selectedImages}
            imagePreviews={imagePreviews}
            onImageSelect={handleImageSelect}
            onRemoveImage={handleRemoveImage}
          />
          <ServiceBasicInfo
            categories={categories}
            categoryId={categoryId}
            onCategoryChange={setCategoryId}
            subcategories={subcategories}
            subcategoryId={subcategoryId}
            onSubcategoryChange={setSubcategoryId}
            serviceName={serviceName}
            onServiceNameChange={setServiceName}
            categoriesLoading={categoriesLoading}
            subcategoriesLoading={subcategoriesLoading}
            description={description}
            onDescriptionChange={setDescription}
            // pricingType={pricingType}
          />
        </Paper>

        {/* Pricing Options */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 2.5,
            borderRadius: 2,
            border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
            bgcolor: isDark
              ? COLORS.BACKGROUND.PAPER_DARK
              : COLORS.BACKGROUND.SECONDARY_LIGHT,
          }}
        >
          <ServicePricingOptions
            pricingType={pricingType}
            onPricingTypeChange={setPricingType}
            priceCatalogFileNames={priceCatalogFileNames}
            onCatalogFileSelect={handleCatalogFileSelect}
            onRemoveCatalogFile={removeCatalogFile}
            onClearCatalog={clearPriceCatalog}
            priceItems={priceItems}
            onAddPriceItem={addPriceItem}
            onRemovePriceItem={removePriceItem}
            onUpdatePriceItem={updatePriceItem}
            price={price}
            onPriceChange={setPrice}
            errors={fieldErrors}
          />
        </Paper>

        {/* Duration */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 2.5,
            borderRadius: 2,
            border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
            bgcolor: isDark
              ? COLORS.BACKGROUND.PAPER_DARK
              : COLORS.BACKGROUND.SECONDARY_LIGHT,
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            {english.service_duration}
          </Typography>
          <ServiceDuration
            days={days}
            onDaysChange={setDays}
            hours={hours}
            onHoursChange={setHours}
            minutes={minutes}
            onMinutesChange={setMinutes}
            haveSlots={haveSlots}
            onHaveSlotsChange={setHaveSlots}
          />
        </Paper>

        {/* Location */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 2.5,
            borderRadius: 2,
            border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
            bgcolor: isDark
              ? COLORS.BACKGROUND.PAPER_DARK
              : COLORS.BACKGROUND.SECONDARY_LIGHT,
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            {english.service_location}
          </Typography>
          <ServiceLocation
            locationType={locationType}
            onLocationTypeChange={setLocationType}
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onAddressSelect={setSelectedAddressId}
            visitingCharge={visitingCharge}
            onVisitingChargeChange={setVisitingCharge}
            serviceRadius={serviceRadius}
            onServiceRadiusChange={setServiceRadius}
            addressesLoading={addressesLoading}
            onAddressAdded={handleAddressAdded}
          />
        </Paper>

        {/* Submit Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || uploadingImages}
          sx={{
            bgcolor: COLORS.PRIMARY_PURPLE,
            color: "white",
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.9375rem",
            boxShadow: "0 4px 14px rgba(94, 24, 233, 0.35)",
            "&:hover": {
              bgcolor: COLORS.PURPLE_HOVER,
              boxShadow: "0 6px 20px rgba(94, 24, 233, 0.4)",
            },
          }}
        >
          {loading || uploadingImages ? (
            <CircularProgress size={24} color="inherit" />
          ) : editService ? (
            english.update_service
          ) : (
            english.send_for_approval
          )}
        </Button>
      </Box>
    </RightDrawer>
  );
};

export default AddServiceDrawer;
