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
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [days, setDays] = useState("0");
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");
  const [locationType, setLocationType] = useState<
    "at_customer" | "at_provider"
  >("at_provider");
  const [visitingCharge, setVisitingCharge] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [serviceRadius, setServiceRadius] = useState("5");
  const [haveSlots, setHaveSlots] = useState(false);

  // Pricing type: single (default), catalog (upload file(s)), or multiple (list of items)
  type PricingType = "single" | "catalog" | "multiple";
  const [pricingType, setPricingType] = useState<PricingType>("single");
  const [priceCatalogFiles, setPriceCatalogFiles] = useState<File[]>([]);
  const [existingCatalogUrls, setExistingCatalogUrls] = useState<string[]>([]);
  const [priceItems, setPriceItems] = useState<
    Array<{ name: string; price: string; description: string }>
  >([{ name: "", price: "", description: "" }]);

  // Images state
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
        setCategoryId(editService.category_id || "");
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

        const locType = editService.service_at_location as string;
        if (locType === "at_customer" || locType === "at_provider") {
          setLocationType(locType as "at_customer" | "at_provider");
        }

        if (editService.visiting_charge) {
          setVisitingCharge(editService.visiting_charge.toString());
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

        if (editService.pricing_type) {
          setPricingType(editService.pricing_type);
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

    if (!categoryId) {
      setError(english.select_category_error);
      isValid = false;
    }
    if (!subcategoryId) {
      setError(english.select_subcategory_error);
      isValid = false;
    }
    if (!serviceName.trim()) {
      setError(english.enter_service_name_error);
      isValid = false;
    }
    if (pricingType === PricingType.SINGLE) {
      if (!price || parseFloat(price) <= 0) {
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
    if (!editService && selectedImages.length === 0) {
      setError(english.upload_image_error);
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
      let uploadedUrls: string[] = [];
      if (selectedImages.length > 0) {
        setUploadingImages(true);
        uploadedUrls = await verifyDocumentService.uploadImages(selectedImages);
        setUploadingImages(false);
      } else if (editService && imagePreviews.length > 0) {
        uploadedUrls = imagePreviews;
      }

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

      const requestData: any = {
        provider_id: userId,
        category_id: categoryId,
        sub_category_id: subcategoryId,
        service_name: finalServiceName,
        service_desc: finalDesc,
        image_urls: uploadedUrls,
        is_price_required: !!(pricingType === "single"),
        price: pricingType === "single" ? finalPrice : 0,
        currency: "INR",
        service_at_location: locationType,
        service_provider_address_id: selectedAddressId,
        service_radius: parseInt(serviceRadius),
        has_service_duration: totalMinutes > 0,
        service_duration: totalMinutes > 0 ? totalMinutes : undefined,
        have_slots: haveSlots,
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
    setCategoryId("");
    setSubcategoryId("");
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
    setHaveSlots(false);
    setPricingType("single");
    setPriceCatalogFiles([]);
    setPriceItems([{ name: "", price: "", description: "" }]);
    setSelectedImages([]);
    setImagePreviews([]);
    setImagePreviews([]);
    setExistingCatalogUrls([]);
    setError("");
    setFieldErrors({});
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
    // Pricing options
    pricingType,
    setPricingType,
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
