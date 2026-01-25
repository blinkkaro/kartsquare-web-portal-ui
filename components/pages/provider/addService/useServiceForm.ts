import { useState, useEffect } from "react";
import { serviceListService } from "@/services/serviceList/serviceListService";
import { verifyDocumentService } from "@/services/auth/verifyDocument.service";
import { getUserId } from "@/utils/auth";
import { ServiceDetails } from "@/services/serviceDetails/serviceDetailsInterface";
import { english } from "@/features/i18n/en";

interface UseServiceFormProps {
    open: boolean;
    editService?: ServiceDetails | null;
    onSuccess: () => void;
    onClose: () => void;
    setSubcategories: (subcategories: any[]) => void;
}

export const useServiceForm = ({
    open,
    editService,
    onSuccess,
    onClose,
    setSubcategories,
}: UseServiceFormProps) => {
    // Form state
    const [categoryId, setCategoryId] = useState("");
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

    // Images state
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    // Loading states
    const [loading, setLoading] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [error, setError] = useState("");

    // Prefill form when editing
    useEffect(() => {
        const prefillForm = async () => {
            if (editService && open) {
                setCategoryId(editService.category_id || "");
                setServiceName(editService.service_name || "");
                setDescription(editService.service_desc || "");

                const priceInCurrency = editService.price ? (editService.price / 100).toFixed(2) : "";
                setPrice(priceInCurrency);

                const totalMinutes = editService.service_duration || 0;
                const daysCalc = Math.floor(totalMinutes / (24 * 60));
                const hoursCalc = Math.floor((totalMinutes % (24 * 60)) / 60);
                const minutesCalc = totalMinutes % 60;
                setDays(daysCalc.toString());
                setHours(hoursCalc.toString());
                setMinutes(minutesCalc.toString());

                const locType = editService.service_at_location as string;
                if (locType === "USER_LOCATION" || locType === "PROVIDER_LOCATION") {
                    setLocationType(locType as "USER_LOCATION" | "PROVIDER_LOCATION");
                }

                if (editService.visiting_charge) {
                    setVisitingCharge((editService.visiting_charge / 100).toFixed(2));
                }

                setSelectedAddressId(editService.service_provider_address_id || "");
                setServiceRadius(editService.service_radius?.toString() || "5");
                setHaveSlots(editService.have_slots || false);

                if (editService.image_urls && editService.image_urls.length > 0) {
                    setImagePreviews(editService.image_urls);
                    setSelectedImages([]);
                }

                // Subcategory ID will be set by useServiceData effect
                if (editService.sub_category_id) {
                    setSubcategoryId(editService.sub_category_id);
                }
            }
        };

        prefillForm();
    }, [editService, open, setSubcategories]);

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const fileArray = Array.from(files);

        if (selectedImages.length + fileArray.length > 6) {
            setError(english.max_images_error);
            return;
        }

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

    const validateForm = (): boolean => {
        if (!categoryId) {
            setError(english.select_category_error);
            return false;
        }
        if (!subcategoryId) {
            setError(english.select_subcategory_error);
            return false;
        }
        if (!serviceName.trim()) {
            setError(english.enter_service_name_error);
            return false;
        }
        if (!price || parseFloat(price) <= 0) {
            setError(english.enter_valid_price_error);
            return false;
        }
        if (!description.trim()) {
            setError(english.enter_description_error);
            return false;
        }
        if (!editService && selectedImages.length === 0) {
            setError(english.upload_image_error);
            return false;
        }
        if (!selectedAddressId) {
            setError(english.select_address_error);
            return false;
        }
        if (locationType === "USER_LOCATION" && (!visitingCharge || parseFloat(visitingCharge) <= 0)) {
            setError(english.enter_visiting_charge_error);
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        try {
            setError("");
            setLoading(true);

            if (!validateForm()) {
                return;
            }

            // Upload images only if new images are selected
            let uploadedUrls: string[] = [];
            if (selectedImages.length > 0) {
                setUploadingImages(true);
                uploadedUrls = await verifyDocumentService.uploadImages(selectedImages);
                setUploadingImages(false);
            } else if (editService && imagePreviews.length > 0) {
                uploadedUrls = imagePreviews;
            }

            const totalMinutes =
                parseInt(days || "0") * 24 * 60 +
                parseInt(hours || "0") * 60 +
                parseInt(minutes || "0");

            const userId = getUserId();
            if (!userId) {
                setError(english.user_not_authenticated_error);
                return;
            }

            const requestData: any = {
                provider_id: userId,
                category_id: categoryId,
                subcategory_id: subcategoryId,
                service_name: serviceName,
                service_desc: description,
                image_urls: uploadedUrls,
                is_price_required: true,
                price: Math.round(parseFloat(price) * 100),
                currency: "INR",
                service_at_location: locationType,
                service_provider_address_id: selectedAddressId,
                service_radius: parseInt(serviceRadius),
                has_service_duration: totalMinutes > 0,
                service_duration: totalMinutes > 0 ? totalMinutes : undefined,
                have_slots: haveSlots,
            };

            if (locationType === "USER_LOCATION") {
                requestData.visiting_charge = Math.round(parseFloat(visitingCharge) * 100);
            }

            if (editService) {
                await serviceListService.updateService(editService.service_id, requestData);
            } else {
                await serviceListService.createService(requestData);
            }

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

    return {
        // Form state
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
        // Images
        selectedImages,
        imagePreviews,
        handleImageSelect,
        handleRemoveImage,
        // Actions
        handleSubmit,
        resetForm,
        // Status
        loading,
        uploadingImages,
        error,
        setError,
    };
};
