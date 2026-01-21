"use client";
import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    MenuItem,
    Button,
    CircularProgress,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    useTheme,
    IconButton,
    Checkbox,
} from "@mui/material";
import { Close, CloudUpload, Delete } from "@mui/icons-material";
import RightDrawer from "@/components/common/RightDrawer";
import { serviceListService } from "@/services/serviceList/serviceListService";
import { Category } from "@/services/serviceList/listInteraface";
import { getUserId } from "@/utils/auth";
import { userAddressService } from "@/services/userAddress/userAddressService";
import { UserAddress } from "@/services/userAddress/userAddressInterface";
import AddressDrawer from "@/components/common/address/AddressDrawer";
import { verifyDocumentService } from "@/services/auth/verifyDocument.service";
import { COLORS } from "@/constants/colors";
import { subcategoryService } from "@/services/subcategory/subcategoryService";
import { Subcategory } from "@/services/subcategory/subcategoryInterface";
import { ServiceDetails } from "@/services/serviceDetails/serviceDetailsInterface";

interface AddServiceDrawerProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editService?: ServiceDetails | null;
}

const AddServiceDrawer: React.FC<AddServiceDrawerProps> = ({ open, onClose, onSuccess, editService }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    // Form state
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryId, setCategoryId] = useState("");
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [subcategoryId, setSubcategoryId] = useState("");
    const [serviceName, setServiceName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [days, setDays] = useState("0");
    const [hours, setHours] = useState("0");
    const [minutes, setMinutes] = useState("0");
    const [locationType, setLocationType] = useState<"USER_LOCATION" | "PROVIDER_LOCATION">("PROVIDER_LOCATION");
    const [visitingCharge, setVisitingCharge] = useState("");
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [serviceRadius, setServiceRadius] = useState("5");
    const [haveSlots, setHaveSlots] = useState(false);

    // Images state - single array for multiple images
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    // Loading states
    const [loading, setLoading] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);
    const [addressesLoading, setAddressesLoading] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);

    // Address management
    const [addresses, setAddresses] = useState<UserAddress[]>([]);
    const [addressDrawerOpen, setAddressDrawerOpen] = useState(false);

    // Error state
    const [error, setError] = useState("");

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true);
                const data = await serviceListService.getCategories();
                setCategories(data);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
                setError("Failed to load categories");
            } finally {
                setCategoriesLoading(false);
            }
        };

        if (open) {
            fetchCategories();
        }
    }, [open]);

    // Fetch addresses - required for all location types
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                setAddressesLoading(true);
                const data = await userAddressService.getUserAddresses();
                setAddresses(data || []);

                // Auto-select default address or first address if none is selected
                if (data && data.length > 0 && !selectedAddressId) {
                    const defaultAddr = data.find(addr => addr.is_default);
                    setSelectedAddressId(defaultAddr ? defaultAddr.id : data[0].id);
                }
            } catch (err) {
                console.error("Failed to fetch addresses:", err);
            } finally {
                setAddressesLoading(false);
            }
        };

        if (open) {
            fetchAddresses();
        }
    }, [open]);

    // Fetch subcategories when category changes
    useEffect(() => {
        const fetchSubcategories = async () => {
            if (!categoryId) {
                setSubcategories([]);
                setSubcategoryId("");
                return;
            }

            try {
                setSubcategoriesLoading(true);
                const data = await subcategoryService.getSubcategoriesByCategoryId(categoryId);
                setSubcategories(data || []);
                // Reset subcategory selection when category changes
                setSubcategoryId("");
            } catch (err) {
                console.error("Failed to fetch subcategories:", err);
                setSubcategories([]);
            } finally {
                setSubcategoriesLoading(false);
            }
        };

        fetchSubcategories();
    }, [categoryId]);

    // Prefill form when editing
    useEffect(() => {
        const prefillForm = async () => {
            if (editService && open) {
                // Set basic fields
                setCategoryId(editService.category_id || "");
                setServiceName(editService.service_name || "");
                setDescription(editService.service_desc || "");

                // Convert price from paise/cents to currency
                const priceInCurrency = editService.price ? (editService.price / 100).toFixed(2) : "";
                setPrice(priceInCurrency);

                // Convert duration from minutes to days/hours/minutes
                const totalMinutes = editService.service_duration || 0;
                const daysCalc = Math.floor(totalMinutes / (24 * 60));
                const hoursCalc = Math.floor((totalMinutes % (24 * 60)) / 60);
                const minutesCalc = totalMinutes % 60;
                setDays(daysCalc.toString());
                setHours(hoursCalc.toString());
                setMinutes(minutesCalc.toString());

                // Set location type
                const locType = editService.service_at_location as string;
                if (locType === "USER_LOCATION" || locType === "PROVIDER_LOCATION") {
                    setLocationType(locType as "USER_LOCATION" | "PROVIDER_LOCATION");
                }

                // Set visiting charge if applicable
                if (editService.visiting_charge) {
                    setVisitingCharge((editService.visiting_charge / 100).toFixed(2));
                }

                // Set address
                setSelectedAddressId(editService.service_provider_address_id || "");

                // Set service radius
                setServiceRadius(editService.service_radius?.toString() || "5");

                // Set slots
                setHaveSlots(editService.have_slots || false);

                // Set existing images as previews (URLs from server)
                if (editService.image_urls && editService.image_urls.length > 0) {
                    setImagePreviews(editService.image_urls);
                    // Clear selectedImages since we're using existing URLs
                    setSelectedImages([]);
                }

                // Fetch subcategories for the selected category and then set subcategory
                if (editService.category_id) {
                    try {
                        setSubcategoriesLoading(true);
                        const data = await subcategoryService.getSubcategoriesByCategoryId(editService.category_id);
                        setSubcategories(data || []);
                        // Set subcategory after subcategories are loaded
                        setSubcategoryId(editService.sub_category_id || "");
                    } catch (err) {
                        console.error("Failed to fetch subcategories for edit:", err);
                        setSubcategories([]);
                    } finally {
                        setSubcategoriesLoading(false);
                    }
                }
            }
        };

        prefillForm();
    }, [editService, open]);

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const fileArray = Array.from(files);

        // Limit to 6 images
        if (selectedImages.length + fileArray.length > 6) {
            setError("Maximum 6 images allowed");
            return;
        }

        // Create previews
        const newPreviews: string[] = [];
        fileArray.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result as string);
                if (newPreviews.length === fileArray.length) {
                    setImagePreviews([...imagePreviews, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });

        setSelectedImages([...selectedImages, ...fileArray]);
    };

    const handleRemoveImage = (index: number) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setSelectedImages(newImages);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = async () => {
        try {
            setError("");
            setLoading(true);

            // Validation
            if (!categoryId) {
                setError("Please select a category");
                return;
            }
            if (!subcategoryId) {
                setError("Please select a subcategory");
                return;
            }
            if (!serviceName.trim()) {
                setError("Please enter service name");
                return;
            }
            if (!price || parseFloat(price) <= 0) {
                setError("Please enter a valid price");
                return;
            }
            if (!description.trim()) {
                setError("Please enter a description");
                return;
            }

            // Image validation - skip if editing and has existing images
            if (!editService && selectedImages.length === 0) {
                setError("Please upload at least one image");
                return;
            }

            // Address is required for all location types
            if (!selectedAddressId) {
                setError("Please select an address");
                return;
            }

            if (locationType === "USER_LOCATION" && (!visitingCharge || parseFloat(visitingCharge) <= 0)) {
                setError("Please enter visiting charge");
                return;
            }

            // Upload images only if new images are selected
            let uploadedUrls: string[] = [];
            if (selectedImages.length > 0) {
                setUploadingImages(true);
                uploadedUrls = await verifyDocumentService.uploadImages(selectedImages);
                setUploadingImages(false);
            } else if (editService && imagePreviews.length > 0) {
                // Use existing image URLs when editing
                uploadedUrls = imagePreviews;
            }

            // Calculate total duration in minutes
            const totalMinutes =
                parseInt(days || "0") * 24 * 60 +
                parseInt(hours || "0") * 60 +
                parseInt(minutes || "0");

            const userId = getUserId();
            if (!userId) {
                setError("User not authenticated");
                return;
            }

            // Prepare request data matching backend schema
            const requestData: any = {
                provider_id: userId,
                category_id: categoryId,
                subcategory_id: subcategoryId,
                service_name: serviceName,
                service_desc: description,
                image_urls: uploadedUrls,
                is_price_required: true,
                price: Math.round(parseFloat(price) * 100), // Convert to paise/cents
                currency: "INR",
                service_at_location: locationType,
                service_provider_address_id: selectedAddressId, // Required for all location types
                service_radius: parseInt(serviceRadius),
                has_service_duration: totalMinutes > 0,
                service_duration: totalMinutes > 0 ? totalMinutes : undefined,
                have_slots: haveSlots,
            };

            // Add visiting charge for USER_LOCATION
            if (locationType === "USER_LOCATION") {
                requestData.visiting_charge = Math.round(parseFloat(visitingCharge) * 100);
            }

            console.log(editService ? "Updating service with payload:" : "Creating service with payload:", requestData);

            if (editService) {
                await serviceListService.updateService(editService.service_id, requestData);
            } else {
                await serviceListService.createService(requestData);
            }

            // Reset form
            resetForm();
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(editService ? "Failed to update service:" : "Failed to create service:", err);
            setError(err?.response?.data?.message || `Failed to ${editService ? "update" : "create"} service. Please try again.`);
        } finally {
            setLoading(false);
            setUploadingImages(false);
        }
    };

    const resetForm = () => {
        setCategoryId("");
        setSubcategoryId("");
        setServiceName("");
        setPrice("");
        setDescription("");
        setDays("0");
        setHours("0");
        setMinutes("0");
        setLocationType("PROVIDER_LOCATION");
        setVisitingCharge("");
        setSelectedAddressId("");
        setServiceRadius("5");
        setHaveSlots(false);
        setSelectedImages([]);
        setImagePreviews([]);
        setError("");
    };

    const handleAddressAdded = () => {
        // Refresh addresses list
        userAddressService.getUserAddresses().then((data) => {
            setAddresses(data || []);
            // Auto-select the first address if none is selected
            if (data && data.length > 0 && !selectedAddressId) {
                setSelectedAddressId(data[0].id);
            }
        });
    };

    return (
        <>
            <RightDrawer
                open={open}
                onClose={onClose}
                title={editService ? "Edit Service" : "Add Service"}
                width={600}
            >
                <Box sx={{ px: 3, pb: 3 }}>
                    {error && (
                        <Box
                            sx={{
                                bgcolor: "error.light",
                                color: "error.dark",
                                p: 2,
                                borderRadius: 1,
                                mb: 2,
                            }}
                        >
                            <Typography variant="body2">{error}</Typography>
                        </Box>
                    )}

                    {/* Service Info Section */}
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Service Info.
                    </Typography>

                    {/* Multi-Image Upload */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            Upload Images (Max 6)
                            <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: "block" }}>
                            Jpeg, png files with max size of 10mb each.
                        </Typography>

                        {/* Upload Button */}
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<CloudUpload />}
                            disabled={selectedImages.length >= 6}
                            sx={{
                                mb: 2,
                                borderColor: COLORS.PRIMARY_PURPLE,
                                color: COLORS.PRIMARY_PURPLE,
                                "&:hover": {
                                    borderColor: COLORS.PURPLE_HOVER,
                                    bgcolor: COLORS.PURPLE_ALPHA_04,
                                },
                            }}
                        >
                            Upload Images ({selectedImages.length}/6)
                            <input
                                type="file"
                                hidden
                                multiple
                                accept="image/jpeg,image/png"
                                onChange={handleImageSelect}
                            />
                        </Button>

                        {/* Image Previews */}
                        {imagePreviews.length > 0 && (
                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                {imagePreviews.map((preview, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            position: "relative",
                                            width: "100px",
                                            height: "100px",
                                            borderRadius: "8px",
                                            overflow: "hidden",
                                            border: `1px solid ${isDark ? COLORS.BORDER.DEFAULT_DARK : COLORS.BORDER.DEFAULT_LIGHT}`,
                                        }}
                                    >
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveImage(index)}
                                            sx={{
                                                position: "absolute",
                                                top: 4,
                                                right: 4,
                                                bgcolor: "rgba(0,0,0,0.6)",
                                                color: "white",
                                                "&:hover": {
                                                    bgcolor: "rgba(0,0,0,0.8)",
                                                },
                                            }}
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>

                    {/* Category */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                            Select category
                            <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
                        </Typography>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            disabled={categoriesLoading}
                            placeholder="Select"
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    {/* Subcategory */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                            Select subcategory
                            <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
                        </Typography>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            value={subcategoryId}
                            onChange={(e) => setSubcategoryId(e.target.value)}
                            disabled={!categoryId || subcategoriesLoading}
                            placeholder="Select"
                            helperText={!categoryId ? "Please select a category first" : ""}
                        >
                            {subcategories.map((subcat) => (
                                <MenuItem key={subcat.id} value={subcat.id}>
                                    {subcat.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    {/* Service Name */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                            Service name
                            <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            value={serviceName}
                            onChange={(e) => setServiceName(e.target.value)}
                            placeholder="Enter service name"
                        />
                    </Box>

                    {/* Price */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                            Price (INR)
                            <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Enter price"
                        />
                    </Box>

                    {/* Description */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                            Description
                            <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Write here..."
                        />
                    </Box>

                    {/* Service Duration */}
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Service Duration
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                                Days
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                value={days}
                                onChange={(e) => setDays(e.target.value)}
                                placeholder="00"
                                inputProps={{ min: 0 }}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                                Hours
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                value={hours}
                                onChange={(e) => setHours(e.target.value)}
                                placeholder="00"
                                inputProps={{ min: 0, max: 23 }}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                                Minutes
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                value={minutes}
                                onChange={(e) => setMinutes(e.target.value)}
                                placeholder="00"
                                inputProps={{ min: 0, max: 59 }}
                            />
                        </Box>
                    </Box>

                    {/* Slots Option */}
                    <Box sx={{ mb: 3 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={haveSlots}
                                    onChange={(e) => setHaveSlots(e.target.checked)}
                                    sx={{
                                        color: COLORS.PRIMARY_PURPLE,
                                        "&.Mui-checked": {
                                            color: COLORS.PRIMARY_PURPLE,
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography variant="body2">
                                    Enable time slots for this service
                                </Typography>
                            }
                        />
                    </Box>

                    {/* Service Location */}
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Service Location
                    </Typography>
                    <FormControl component="fieldset" sx={{ mb: 2 }}>
                        <RadioGroup
                            value={locationType}
                            onChange={(e) => setLocationType(e.target.value as any)}
                        >
                            <FormControlLabel
                                value="PROVIDER_LOCATION"
                                control={<Radio sx={{ color: COLORS.PRIMARY_PURPLE }} />}
                                label="At Provider Location"
                            />
                            <FormControlLabel
                                value="USER_LOCATION"
                                control={<Radio sx={{ color: COLORS.PRIMARY_PURPLE }} />}
                                label="I provide this service at customer location"
                            />
                        </RadioGroup>
                    </FormControl>

                    {/* Address Selection - Required for all location types */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            Select Address
                            <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
                        </Typography>

                        {addressesLoading ? (
                            <CircularProgress size={20} />
                        ) : addresses.length > 0 ? (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
                                {addresses.map((addr) => (
                                    <Box
                                        key={addr.id}
                                        onClick={() => setSelectedAddressId(addr.id)}
                                        sx={{
                                            p: 2,
                                            border: `2px solid ${selectedAddressId === addr.id
                                                ? COLORS.PRIMARY_PURPLE
                                                : isDark
                                                    ? COLORS.BORDER.DEFAULT_DARK
                                                    : COLORS.BORDER.DEFAULT_LIGHT
                                                }`,
                                            borderRadius: "12px",
                                            cursor: "pointer",
                                            bgcolor: selectedAddressId === addr.id
                                                ? COLORS.PURPLE_ALPHA_04
                                                : isDark
                                                    ? COLORS.BACKGROUND.PAPER_DARK
                                                    : COLORS.BACKGROUND.PRIMARY_LIGHT,
                                            transition: "all 0.2s",
                                            "&:hover": {
                                                borderColor: COLORS.PRIMARY_PURPLE,
                                                bgcolor: COLORS.PURPLE_ALPHA_04,
                                            },
                                        }}
                                    >
                                        {addr.address_name && (
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: COLORS.PRIMARY_PURPLE,
                                                    mb: 0.5,
                                                }}
                                            >
                                                {addr.address_name}
                                                {addr.is_default && (
                                                    <span style={{ marginLeft: "8px", fontSize: "0.75rem" }}>
                                                        (Default)
                                                    </span>
                                                )}
                                            </Typography>
                                        )}
                                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                                            {addr.building_no && `${addr.building_no}, `}
                                            {addr.floor && `Floor ${addr.floor}, `}
                                            {addr.address}
                                        </Typography>
                                        {addr.landmark && (
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                Near: {addr.landmark}
                                            </Typography>
                                        )}
                                        <Typography variant="body2" color="text.secondary">
                                            {addr.city_town}, {addr.state} - {addr.pincode}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {addr.country}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                You do not have an address yet.
                            </Typography>
                        )}

                        <Button
                            variant="outlined"
                            onClick={() => setAddressDrawerOpen(true)}
                            sx={{
                                mt: 1,
                                borderColor: COLORS.WHITE,
                                color: COLORS.WHITE,
                            }}
                        >
                            Add Address
                        </Button>
                    </Box>

                    {/* Visiting Charge for User Location */}
                    {locationType === "USER_LOCATION" && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                                Visiting Charge (INR)
                                <span style={{ color: COLORS.SECONDARY_ORANGE }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                value={visitingCharge}
                                onChange={(e) => setVisitingCharge(e.target.value)}
                                placeholder="Enter visiting charge"
                            />
                        </Box>
                    )}

                    {/* Service Radius */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                            Service Radius (km)
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            type="number"
                            value={serviceRadius}
                            onChange={(e) => setServiceRadius(e.target.value)}
                            placeholder="5"
                            inputProps={{ min: 5, max: 25 }}
                        />
                    </Box>

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
                            editService ? "Update Service" : "Send for an Approval"
                        )}
                    </Button>
                </Box>
            </RightDrawer>

            {/* Address Drawer */}
            <AddressDrawer
                open={addressDrawerOpen}
                onClose={() => {
                    setAddressDrawerOpen(false);
                    handleAddressAdded();
                }}
                mode="add"
            />
        </>
    );
};

export default AddServiceDrawer;
