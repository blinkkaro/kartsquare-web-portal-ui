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
      country: "",
      is_default: isDefault,
      latitude: undefined,
      longitude: undefined,
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (initialData && mode === "edit") {
      const state = initialData.state;
      const country = initialData.country;

      reset({
        address_name: initialData.address_name || "",
        building_no: initialData.building_no || "",
        floor: initialData.floor || "",
        address: initialData.address || "",
        landmark: initialData.landmark || "",
        pincode: initialData.pincode || "",
        city_town: initialData.city_town,
        state: state,
        country: country,
        is_default: initialData.is_default || false,
        latitude: initialData.latitude,
        longitude: initialData.longitude,
      });
    } else if (mode === "add") {
      reset({
        address_name: "",
        building_no: "",
        floor: "",
        address: "",
        landmark: "",
        pincode: "",
        city_town: "",
        state: "",
        country: "",
        is_default: isDefault,
        latitude: coordinates?.latitude,
        longitude: coordinates?.longitude,
      });
    }
  }, [initialData, mode, reset, open, coordinates]);

  return form;
};
