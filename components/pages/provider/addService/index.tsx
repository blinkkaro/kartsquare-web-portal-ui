"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  alpha,
} from "@mui/material";
import LogoLoader from "@/components/common/Loader/LogoLoader";
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

const SECTION_STYLE = (isDark: boolean) => ({
  p: 3,
  mb: 2,
  borderRadius: 2,
  border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
  borderLeft: `4px solid ${COLORS.PRIMARY_PURPLE}`,
  bgcolor: isDark ? COLORS.BACKGROUND.PAPER_DARK : "white",
  boxShadow: isDark
    ? "none"
    : `0 1px 3px ${alpha(COLORS.PRIMARY_PURPLE, 0.06)}`,
  transition: "box-shadow 0.2s ease, border-color 0.2s ease",
  "&:hover": {
    boxShadow: isDark
      ? "none"
      : `0 4px 12px ${alpha(COLORS.PRIMARY_PURPLE, 0.08)}`,
  },
});

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
  const [localCategoryIds, setLocalCategoryIds] = React.useState<string[]>([]);
  const [haveprice, setHavePrice] = useState(false);

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
  } = useServiceData(open, localCategoryIds, "");

  // Form state hook
  const {
    categoryIds,
    setCategoryIds,
    subcategoryIds,
    setSubcategoryIds,
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
    hasServiceDuration,
    setHasServiceDuration,
    haveSlots,
    setHaveSlots,
    pricingType,
    setPricingType,
    isPriceRequired,
    setIsPriceRequired,
    priceCatalogFileNames,
    handleCatalogFileSelect,
    removeCatalogFile,
    clearPriceCatalog,
    existingCatalogUrls,
    removeExistingCatalogUrl,
    priceItems,
    addPriceItem,
    removePriceItem,
    updatePriceItem,
    mainImagePreview,
    handleMainImageSelect,
    handleRemoveMainImage,
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

  // Sync local category IDs with form category IDs to trigger fetching
  useEffect(() => {
    setLocalCategoryIds(categoryIds);
  }, [categoryIds]);

  // Auto-remove orphaned subcategories when categories change
  // Only prune when subcategories have actually been loaded (not during initial fetch)
  const subcategorySet = useMemo(
    () => new Set(subcategories.map((s) => s.id)),
    [subcategories]
  );
  useEffect(() => {
    if (subcategoryIds.length > 0 && subcategories.length > 0 && !subcategoriesLoading) {
      const valid = subcategoryIds.filter((id) => subcategorySet.has(id));
      if (valid.length !== subcategoryIds.length) {
        setSubcategoryIds(valid);
      }
    }
  }, [subcategorySet, subcategoryIds, setSubcategoryIds, subcategories.length, subcategoriesLoading]);

  useEffect(() => {
    if (pricingType === "noPrice") {
      setHavePrice(false);
      setIsPriceRequired(false);
    } else {
      setHavePrice(true);
      setIsPriceRequired(true);
    }
  }, [pricingType, setIsPriceRequired]);

  // Sync haveprice to isPriceRequired
  useEffect(() => {
    setIsPriceRequired(haveprice);
  }, [haveprice, setIsPriceRequired]);

  const updateHavePrice = (type: boolean) => {
    setHavePrice(type);
    if (type === false) {
      setPricingType("noPrice");
      setHavePrice(false);
      setIsPriceRequired(false);
    } else {
      setPricingType("single");
      setHavePrice(true);
      setIsPriceRequired(true);
    }
  };

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
      width={600}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100%",
          px: { xs: 2, sm: 3 },
          pt: 1,
          pb: 2,
        }}
      >
        {/* Intro — friendly, low pressure */}
        <Typography
          variant="body2"
          sx={{
            color: isDark
              ? COLORS.TEXT.SECONDARY_DARK
              : COLORS.TEXT.SECONDARY_LIGHT,
            mb: 2,
            lineHeight: 1.5,
          }}
        >
          {editService
            ? "Update your service details below. Only changed fields will be updated."
            : "Fill in the sections below. You can save and come back anytime."}
        </Typography>

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
            <Typography variant="body2" sx={{ whiteSpace: "pre-line", lineHeight: 1.5 }}>
              {error}
            </Typography>
          </Paper>
        )}

        <Box sx={{ flex: 1 }}>
          {/* 1. Service Info */}
          <Paper elevation={0} sx={SECTION_STYLE(isDark)}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  bgcolor: alpha(COLORS.PRIMARY_PURPLE, isDark ? 0.2 : 0.1),
                  color: COLORS.PRIMARY_PURPLE,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                }}
              >
                1
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {english.service_info}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Photos, category & description
                </Typography>
              </Box>
            </Box>
            <ServiceImageUpload
              mainImagePreview={mainImagePreview}
              onMainImageSelect={handleMainImageSelect}
              onRemoveMainImage={handleRemoveMainImage}
              selectedImages={selectedImages}
              imagePreviews={imagePreviews}
              onImageSelect={handleImageSelect}
              onRemoveImage={handleRemoveImage}
            />
            <ServiceBasicInfo
              categories={categories}
              categoryIds={categoryIds}
              onCategoryChange={setCategoryIds}
              subcategories={subcategories}
              subcategoryIds={subcategoryIds}
              onSubcategoryChange={setSubcategoryIds}
              serviceName={serviceName}
              onServiceNameChange={setServiceName}
              categoriesLoading={categoriesLoading}
              subcategoriesLoading={subcategoriesLoading}
              description={description}
              onDescriptionChange={setDescription}
            />
          </Paper>

          {/* 2. Pricing */}
          <Paper elevation={0} sx={SECTION_STYLE(isDark)}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  bgcolor: alpha(COLORS.PRIMARY_PURPLE, isDark ? 0.2 : 0.1),
                  color: COLORS.PRIMARY_PURPLE,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                }}
              >
                2
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {english.pricing_options}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Single price, catalog or multiple services
                </Typography>
              </Box>
            </Box>
            <ServicePricingOptions
              pricingType={pricingType}
              onPricingTypeChange={setPricingType}
              priceCatalogFileNames={priceCatalogFileNames}
              onCatalogFileSelect={handleCatalogFileSelect}
              onRemoveCatalogFile={removeCatalogFile}
              existingCatalogUrls={existingCatalogUrls}
              onRemoveExistingCatalogUrl={removeExistingCatalogUrl}
              onClearCatalog={clearPriceCatalog}
              priceItems={priceItems}
              onAddPriceItem={addPriceItem}
              onRemovePriceItem={removePriceItem}
              onUpdatePriceItem={updatePriceItem}
              price={price}
              onPriceChange={setPrice}
              isPriceRequired={haveprice}
              onIsPriceRequiredChange={updateHavePrice}
              errors={fieldErrors}
            />
          </Paper>

          {/* 3. Duration */}
          <Paper elevation={0} sx={SECTION_STYLE(isDark)}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  bgcolor: alpha(COLORS.PRIMARY_PURPLE, isDark ? 0.2 : 0.1),
                  color: COLORS.PRIMARY_PURPLE,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                }}
              >
                3
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {english.service_duration}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Estimated time & time slots
                </Typography>
              </Box>
            </Box>
            <ServiceDuration
              hasServiceDuration={hasServiceDuration}
              onHasServiceDurationChange={setHasServiceDuration}
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

          {/* 4. Location */}
          <Paper elevation={0} sx={SECTION_STYLE(isDark)}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  bgcolor: alpha(COLORS.PRIMARY_PURPLE, isDark ? 0.2 : 0.1),
                  color: COLORS.PRIMARY_PURPLE,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                }}
              >
                4
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {english.service_location}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Where you provide the service
                </Typography>
              </Box>
            </Box>
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
        </Box>

        {/* Sticky submit area — always visible, clear CTA */}
        <Box
          sx={{
            pt: 2,
            mt: 1,
            borderTop: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
            bgcolor: "transparent",
          }}
        >
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading || uploadingImages}
            sx={{
              bgcolor: COLORS.PRIMARY_PURPLE,
              color: "white",
              py: 1.75,
              mb: 4,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
              boxShadow: `0 4px 14px ${alpha(COLORS.PRIMARY_PURPLE, 0.4)}`,
              "&:hover": {
                bgcolor: COLORS.PURPLE_HOVER,
                boxShadow: `0 6px 20px ${alpha(COLORS.PRIMARY_PURPLE, 0.5)}`,
              },
            }}
          >
            {loading || uploadingImages ? (
              <LogoLoader size={24} />
            ) : editService ? (
              english.update_service
            ) : (
              english.send_for_approval
            )}
          </Button>
        </Box>
      </Box>
    </RightDrawer>
  );
};

export default AddServiceDrawer;
