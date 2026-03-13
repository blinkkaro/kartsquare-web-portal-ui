import { useState, useEffect } from "react";
import { serviceListService } from "@/services/serviceList/serviceListService";
import { verifyDocumentService } from "@/services/auth/verifyDocument.service";
import { getUserId } from "@/utils/auth";
import { ServiceDetails } from "@/services/serviceDetails/serviceDetailsInterface";
import { english } from "@/features/i18n/en";
import { PricingType } from "@/services/serviceList/listInteraface";

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
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [subcategoryIds, setSubcategoryIds] = useState<string[]>([]);
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [days, setDays] = useState("0");
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");
  const [locationType, setLocationType] = useState<
    "at_customer" | "at_provider" | "virtual_call"
  >("at_provider");
  const [visitingCharge, setVisitingCharge] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [serviceRadius, setServiceRadius] = useState("5");
  const [hasServiceDuration, setHasServiceDuration] = useState(false);
  const [haveSlots, setHaveSlots] = useState(false);

  // Pricing type: single (default), catalog (upload file(s)), or multiple (list of items)
  type PricingType = "single" | "catalog" | "multiple" | "noPrice";
  const [pricingType, setPricingType] = useState<PricingType>("noPrice");
  const [isPriceRequired, setIsPriceRequired] = useState(true);
  const [priceCatalogFiles, setPriceCatalogFiles] = useState<File[]>([]);
  const [existingCatalogUrls, setExistingCatalogUrls] = useState<string[]>([]);
  const [priceItems, setPriceItems] = useState<
    Array<{ name: string; price: string; description: string }>
  >([{ name: "", price: "", description: "" }]);

  // Images state
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Prefill form when editing
  useEffect(() => {
    const prefillForm = async () => {
      if (editService && open) {
        // Handle both string and array formats for backward compatibility
        const catId = editService.category_id;
        if (Array.isArray(catId)) {
          setCategoryIds(catId);
        } else if (catId) {
          setCategoryIds([catId]);
        } else {
          setCategoryIds([]);
        }
        setServiceName(editService.service_name || "");
        setDescription(editService.service_desc || "");

        const priceInCurrency = editService.price
          ? editService.price.toString()
          : "";
        setPrice(priceInCurrency);

        const totalMinutes = editService.service_duration || 0;
        const daysCalc = Math.floor(totalMinutes / (24 * 60));
        const hoursCalc = Math.floor((totalMinutes % (24 * 60)) / 60);
        const minutesCalc = totalMinutes % 60;
        setDays(daysCalc.toString());
        setHours(hoursCalc.toString());
        setMinutes(minutesCalc.toString());
        setHasServiceDuration(
          editService.has_service_duration || totalMinutes > 0,
        );

        const locType = editService.service_at_location as string;
        if (
          locType === "at_customer" ||
          locType === "at_provider" ||
          locType === "virtual_call"
        ) {
          setLocationType(
            locType as "at_customer" | "at_provider" | "virtual_call",
          );
        }

        if (editService.visiting_charge) {
          setVisitingCharge(editService.visiting_charge.toString());
        }

        setSelectedAddressId(editService.service_provider_address_id || "");
        setServiceRadius(editService.service_radius?.toString() || "5");
        setHaveSlots(editService.have_slots || false);

        if (editService.image_urls && editService.image_urls.length > 0) {
          setMainImagePreview(editService.image_urls[0]);
          if (editService.image_urls.length > 1) {
            setImagePreviews(editService.image_urls.slice(1));
          }
          setSelectedImages([]);
          setMainImage(null);
        }

        // Subcategory ID will be set by useServiceData effect
        if (editService.sub_category_id) {
          const subCatId = editService.sub_category_id;
          if (Array.isArray(subCatId)) {
            setSubcategoryIds(subCatId);
          } else {
            setSubcategoryIds([subCatId]);
          }
        }

        if (editService.pricing_type) {
          setPricingType(editService.pricing_type);
        }

        if (editService.is_price_required !== undefined) {
          setIsPriceRequired(editService.is_price_required);
        } else {
          setIsPriceRequired(!!editService.price);
        }

        if (
          editService.price_catalog_url &&
          editService.price_catalog_url.length > 0
        ) {
          setExistingCatalogUrls(editService.price_catalog_url);
        }

        if (editService.price_items && editService.price_items.length > 0) {
          setPriceItems(
            editService.price_items.map((item) => ({
              name: item.service_name,
              price: item.price.toString(),
              description: item.service_desc,
            })),
          );
        }
      }
    };

    prefillForm();
  }, [editService, open, setSubcategories]);

  const handleMainImageSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { files } = event.target;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setMainImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setMainImage(file);
  };

  const handleRemoveMainImage = () => {
    setMainImage(null);
    setMainImagePreview(null);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
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

  const handleCatalogFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { files } = event.target;
    if (!files?.length) return;
    const fileArray = Array.from(files);
    setPriceCatalogFiles((prev) => [...prev, ...fileArray]);
    event.target.value = "";

    if (fieldErrors.catalog) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.catalog;
        return newErrors;
      });
    }
  };

  const removeCatalogFile = (index: number) => {
    setPriceCatalogFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearPriceCatalog = () => {
    setPriceCatalogFiles([]);
    setExistingCatalogUrls([]);
  };

  const removeExistingCatalogUrl = (index: number) => {
    setExistingCatalogUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const addPriceItem = () => {
    setPriceItems((prev) => [
      ...prev,
      { name: "", price: "", description: "" },
    ]);
  };

  const removePriceItem = (index: number) => {
    if (priceItems.length <= 1) return;
    setPriceItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePriceItem = (
    index: number,
    field: "name" | "price" | "description",
    value: string,
  ) => {
    setPriceItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const validateForm = (): boolean => {
    const newFieldErrors: Record<string, string> = {};
    let isValid = true;

    if (categoryIds.length === 0) {
      setError(english.select_category_error);
      isValid = false;
    }
    if (subcategoryIds.length === 0) {
      setError(english.select_subcategory_error);
      isValid = false;
    }
    if (!serviceName.trim()) {
      setError(english.enter_service_name_error);
      isValid = false;
    }
    if (pricingType === PricingType.SINGLE) {
      if (isPriceRequired && (!price || parseFloat(price) <= 0)) {
        newFieldErrors.price = english.enter_valid_price_error;
        isValid = false;
      }
      if (!description.trim()) {
        setError(english.enter_description_error);
        isValid = false;
      }
    }
    if (
      pricingType === PricingType.CATALOG &&
      !priceCatalogFiles.length &&
      !existingCatalogUrls.length
    ) {
      newFieldErrors.catalog = english.price_catalog_required;
      isValid = false;
    }
    if (pricingType === PricingType.MULTIPLE) {
      const validItems = priceItems.filter(
        (item) =>
          item.name.trim() &&
          item.price &&
          parseFloat(item.price) > 0 &&
          item.description.trim(),
      );
      if (validItems.length === 0) {
        newFieldErrors.multiple = english.at_least_one_price_item;
        isValid = false;
      }
    }
    if (!editService && !mainImage) {
      setError(english.upload_image_error || "Main image is required");
      isValid = false;
    } else if (editService && !mainImage && !mainImagePreview) {
      setError(english.upload_image_error || "Main image is required");
      isValid = false;
    }
    if (!selectedAddressId) {
      setError(english.select_address_error);
      isValid = false;
    }
    if (
      locationType === "at_customer" &&
      (!visitingCharge || parseFloat(visitingCharge) < 0)
    ) {
      setError(english.enter_visiting_charge_error);
      isValid = false;
    }

    setFieldErrors(newFieldErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    try {
      setError("");
      setFieldErrors({});
      setLoading(true);

      if (!validateForm()) {
        return;
      }

      // Upload images only if new images are selected
      let uploadedMainImageUrl = mainImagePreview || "";
      if (mainImage) {
        setUploadingImages(true);
        const [url] = await verifyDocumentService.uploadImages([mainImage]);
        uploadedMainImageUrl = url;
        setUploadingImages(false);
      }

      let uploadedUrls: string[] = [];
      if (selectedImages.length > 0) {
        setUploadingImages(true);
        uploadedUrls = await verifyDocumentService.uploadImages(selectedImages);
        setUploadingImages(false);
      } else if (editService && imagePreviews.length > 0) {
        uploadedUrls = imagePreviews;
      }

      const finalImageUrls = [uploadedMainImageUrl, ...uploadedUrls].filter(
        (url) => url !== "",
      );

      let priceCatalogUrls: string[] = [...existingCatalogUrls];
      if (pricingType === "catalog" && priceCatalogFiles.length > 0) {
        setUploadingImages(true);
        const newUrls =
          await verifyDocumentService.uploadImages(priceCatalogFiles);
        priceCatalogUrls = [...priceCatalogUrls, ...newUrls];
        setUploadingImages(false);
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

      let finalServiceName = serviceName;
      let finalPrice = parseFloat(price) || 0;
      let finalDesc = description;
      const validPriceItems = priceItems.filter(
        (item) =>
          item.name.trim() &&
          item.price &&
          parseFloat(item.price) > 0 &&
          item.description.trim(),
      );

      if (pricingType === "multiple" && validPriceItems.length > 0) {
        finalServiceName = validPriceItems[0].name.trim();
        finalPrice = parseFloat(validPriceItems[0].price);
        finalDesc = validPriceItems[0].description.trim();
      }

      console.log('DEBUG SUBMIT - categoryIds:', categoryIds, 'subcategoryIds:', subcategoryIds);
      const requestData: any = {
        provider_id: userId,
        category_id: categoryIds,
        sub_category_id: subcategoryIds,
        service_name: finalServiceName,
        service_desc: finalDesc,
        image_urls: finalImageUrls,
        is_price_required: pricingType === "single" ? isPriceRequired : false,
        price: pricingType === "single" && isPriceRequired ? finalPrice : 0,
        currency: "INR",
        service_at_location: locationType,
        service_provider_address_id: selectedAddressId,
        service_radius:
          locationType === "virtual_call" ? 0 : parseInt(serviceRadius),
        has_service_duration: hasServiceDuration,
        service_duration:
          hasServiceDuration && totalMinutes > 0 ? totalMinutes : undefined,
        have_slots: hasServiceDuration ? haveSlots : false,
        pricing_type: pricingType,
      };

      if (pricingType === "catalog") {
        requestData.price_catalog_url = priceCatalogUrls;
      }

      if (pricingType === "catalog" && priceCatalogUrls.length > 0) {
        requestData.price_catalog_url = priceCatalogUrls;
      }
      if (pricingType === "multiple" && validPriceItems.length > 0) {
        requestData.price_items = validPriceItems.map((item) => ({
          service_name: item.name.trim(),
          price: parseFloat(item.price),
          service_desc: item.description.trim(),
        }));
      }

      if (locationType === "at_customer") {
        requestData.visiting_charge = parseFloat(visitingCharge);
      }

      if (editService) {
        console.log('DEBUG UPDATE - requestData:', requestData);
        await serviceListService.updateService(
          editService.service_id,
          requestData,
        );
      } else {
        await serviceListService.createService(requestData);
      }

      resetForm();
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(
        editService ? "Failed to update service:" : "Failed to create service:",
        err,
      );
      setError(
        err?.response?.data?.message ||
          `Failed to ${editService ? "update" : "create"} service. Please try again.`,
      );
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  const resetForm = () => {
    setCategoryIds([]);
    setSubcategoryIds([]);
    setServiceName("");
    setPrice("");
    setDescription("");
    setDays("0");
    setHours("0");
    setMinutes("0");
    setLocationType("at_provider");
    setVisitingCharge("");
    setSelectedAddressId("");
    setServiceRadius("5");
    setHasServiceDuration(false);
    setHaveSlots(false);
    setPricingType("single");
    setIsPriceRequired(true);
    setPriceCatalogFiles([]);
    setPriceItems([{ name: "", price: "", description: "" }]);
    setMainImage(null);
    setMainImagePreview(null);
    setSelectedImages([]);
    setImagePreviews([]);
    setExistingCatalogUrls([]);
    setError("");
    setFieldErrors({});
  };

  return {
    // Form state
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
    // Pricing options
    pricingType,
    setPricingType,
    isPriceRequired,
    setIsPriceRequired,
    priceCatalogFiles,
    priceCatalogFileNames: priceCatalogFiles.map((f) => f.name),
    handleCatalogFileSelect,
    removeCatalogFile,
    clearPriceCatalog,
    existingCatalogUrls,
    removeExistingCatalogUrl,
    priceItems,
    addPriceItem,
    removePriceItem,
    updatePriceItem,
    // Images
    mainImage,
    mainImagePreview,
    handleMainImageSelect,
    handleRemoveMainImage,
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
    fieldErrors,
  };
};
