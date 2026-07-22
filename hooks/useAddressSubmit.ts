import { useAddAddress, useUpdateAddress } from "@/hooks/useAddress";
import { AddressFormData } from "@/components/common/address/AddressSchema";
import { Address } from "@/services/address/addressInterface";
import { mapService } from "@/services/map/mapService";
import { useState } from "react";

interface UseAddressSubmitProps {
  mode: "add" | "edit";
  initialData?: Address | null;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export const useAddressSubmit = ({
  mode,
  initialData,
  onSuccess,
  onError,
}: UseAddressSubmitProps) => {
  const addAddressMutation = useAddAddress();
  const updateAddressMutation = useUpdateAddress();
  const [validating, setValidating] = useState(false);

  const handleFormSubmit = async (data: AddressFormData) => {
    setValidating(true);
    // Combine address fields to get a full address string for geocoding
    const fullAddress = `${data.building_no ? data.building_no + ", " : ""}${data.address}, ${data.city_town}, ${data.state}, ${data.pincode}, ${data.country}`;

    try {
      let lat = data.latitude;
      let lng = data.longitude;

      // If we somehow don't have coordinates (e.g. they typed super fast, or specific address failed geocoding)
      if (!lat || !lng) {
        // Build varying levels of address specificity to ensure we get *some* valid coordinate fallback
        const addressVariants = [
          `${data.building_no ? data.building_no + ", " : ""}${data.address}, ${data.landmark ? data.landmark + ", " : ""}${data.city_town}, ${data.state}, ${data.pincode}, ${data.country}`,
          `${data.address}, ${data.city_town}, ${data.state}, ${data.pincode}, ${data.country}`,
          `${data.city_town}, ${data.state}, ${data.pincode}, ${data.country}`,
          `${data.city_town}, ${data.state}, ${data.country}`
        ].map(s => String(s || "").replace(/,\s*,/g, ',').replace(/\s\s+/g, ' ').trim());

        let geocodeResult = null;
        for (const variant of addressVariants) {
          const result = await mapService.geocodeAddress(variant);
          if (result && result.geometry && result.geometry.location) {
            geocodeResult = result;
            break; // Stop at first successful geocode
          }
        }

        if (!geocodeResult || !geocodeResult.geometry) {
          onError("Please enter a valid address, or adjust the pin on the map.");
          setValidating(false);
          return;
        }

        const location: any = geocodeResult.geometry.location;
        lat = typeof location.lat === "function" ? location.lat() : location.lat;
        lng = typeof location.lng === "function" ? location.lng() : location.lng;
      }

      const updatedData = {
        ...data,
        latitude: Number(lat),
        longitude: Number(lng),
      };

      if (mode === "add") {
        addAddressMutation.mutate(updatedData, {
          onSuccess: () => {
            onSuccess();
          },
          onError: (error: any) => {
            onError(
              error.response?.data?.message ||
                error.message ||
                "Something went wrong",
            );
          },
          onSettled: () => setValidating(false),
        });
      } else {
        if (!initialData?.id) {
          onError("Address ID is missing");
          setValidating(false);
          return;
        }

        updateAddressMutation.mutate(
          { id: initialData.id, data: updatedData },
          {
            onSuccess: () => {
              onSuccess();
            },
            onError: (error: any) => {
              onError(
                error.response?.data?.message ||
                  error.message ||
                  "Something went wrong",
              );
            },
            onSettled: () => setValidating(false),
          },
        );
      }
    } catch (error) {
      console.error("Validation error:", error);
      onError("Failed to validate address. Please try again.");
      setValidating(false);
    }
  };

  return {
    handleFormSubmit,
    isPending:
      addAddressMutation.isPending ||
      updateAddressMutation.isPending ||
      validating,
  };
};
