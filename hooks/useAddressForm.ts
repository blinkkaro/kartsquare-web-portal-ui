import { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslationContext } from "@/features/i18n/TranslationContext";
import {
  createAddressSchema,
  AddressFormData,
} from "@/components/common/address/AddressSchema";
import { Address } from "@/services/address/addressInterface";

interface UseAddressFormProps {
  initialData: Address | null;
  mode: "add" | "edit";
  open: boolean;
  coordinates?: { latitude: number; longitude: number } | null;
  isDefault?: boolean;
}

export const useAddressForm = ({
  initialData,
  mode,
  open,
  coordinates,
  isDefault = false,
}: UseAddressFormProps): UseFormReturn<AddressFormData> => {
  const { t } = useTranslationContext();

  const form = useForm<AddressFormData>({
    resolver: yupResolver(createAddressSchema(t)),
    defaultValues: {
      address_name: "",
      building_no: "",
      floor: "",
      address: "",
      landmark: "",
      pincode: "",
      city_town: "",
      state: "",
      country: "India",
      is_default: isDefault,
      latitude: undefined,
      longitude: undefined,
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (!open) return;

    if (initialData && mode === "edit") {
      const stateValue = initialData.state;
      const countryValue = initialData.country;

      reset({
        address_name: initialData.address_name || "",
        building_no: initialData.building_no || "",
        floor: initialData.floor || "",
        address: initialData.address || "",
        landmark: initialData.landmark || "",
        pincode: initialData.pincode || "",
        city_town: initialData.city_town,
        state: stateValue,
        country: countryValue,
        is_default: initialData.is_default || false,
        latitude: Number(initialData.latitude),
        longitude: Number(initialData.longitude),
      });
    } else if (mode === "add") {
      // For "add" mode, we only reset when the drawer opens to clear previous state
      // We don't wipe the form if coordinates arrive later, as useAddressMap will handle setting them
      reset((prev) => ({
        ...prev,
        address_name: "",
        building_no: "",
        floor: "",
        address: "",
        landmark: "",
        pincode: "",
        city_town: "",
        state: "",
        country: "India",
        is_default: isDefault,
        latitude: prev.latitude || coordinates?.latitude,
        longitude: prev.longitude || coordinates?.longitude,
      }));
    }
  }, [initialData, mode, reset, open]); // Removed coordinates from dependencies to prevent re-clearing form

  // Separate effect to sync lat/lng when coordinates arrive without resetting whole form
  useEffect(() => {
    if (mode === "add" && coordinates) {
      form.setValue("latitude", coordinates.latitude);
      form.setValue("longitude", coordinates.longitude);
    }
  }, [coordinates, mode]);

  return form;
};
