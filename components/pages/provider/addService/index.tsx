"use client";
import React, { useEffect } from "react";
import { Box, Typography, Button, CircularProgress, useTheme } from "@mui/material";
import RightDrawer from "@/components/common/RightDrawer";
import { ServiceDetails } from "@/services/serviceDetails/serviceDetailsInterface";
import { COLORS } from "@/constants/colors";
import { english } from "@/features/i18n/en";
import { useServiceData } from "./useServiceData";
import { useServiceForm } from "./useServiceForm";
import ServiceImageUpload from "./ServiceImageUpload";
import ServiceBasicInfo from "./ServiceBasicInfo";
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
    editService
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
        selectedImages,
        imagePreviews,
        handleImageSelect,
        handleRemoveImage,
        handleSubmit,
        loading,
        uploadingImages,
        error: formError,
        setError: setFormError,
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
            const defaultAddr = addresses.find(addr => addr.is_default);
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
            <Box sx={{ px: 3, pb: 3 }}>
                {error && (
                    <Box
                        sx={{
                            bgcolor: isDark ? "rgba(255, 255, 255, 0.05)" : "white",
                            color: "error.main",
                            p: 2,
                            borderRadius: "12px",
                            mb: 2,
                            border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(211, 47, 47, 0.2)"}`,
                        }}
                    >
                        <Typography variant="body2">{error}</Typography>
                    </Box>
                )}

                {/* Service Info Section */}
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {english.service_info}
                </Typography>

                {/* Image Upload */}
                <ServiceImageUpload
                    selectedImages={selectedImages}
                    imagePreviews={imagePreviews}
                    onImageSelect={handleImageSelect}
                    onRemoveImage={handleRemoveImage}
                />

                {/* Basic Info */}
                <ServiceBasicInfo
                    categories={categories}
                    categoryId={categoryId}
                    onCategoryChange={setCategoryId}
                    subcategories={subcategories}
                    subcategoryId={subcategoryId}
                    onSubcategoryChange={setSubcategoryId}
                    serviceName={serviceName}
                    onServiceNameChange={setServiceName}
                    price={price}
                    onPriceChange={setPrice}
                    description={description}
                    onDescriptionChange={setDescription}
                    categoriesLoading={categoriesLoading}
                    subcategoriesLoading={subcategoriesLoading}
                />

                {/* Duration */}
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

                {/* Location */}
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
                        borderRadius: "12px",
                        textTransform: "none",
                        fontWeight: 600,
                        "&:hover": {
                            bgcolor: COLORS.PURPLE_HOVER,
                        },
                    }}
                >
                    {loading || uploadingImages ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        editService ? english.update_service : english.send_for_approval
                    )}
                </Button>
            </Box>
        </RightDrawer>
    );
};

export default AddServiceDrawer;
