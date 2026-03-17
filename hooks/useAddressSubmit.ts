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
  const [valadating, setValadating] = useState(false);

  const handleFormSubmit = async (data: AddressFormData) => {
    setValadating(true);
    // Combine address fields to get a full address string for geocoding
    const fullAddress = `${data.building_no ? data.building_no + ", " : ""}${data.address}, ${data.city_town}, ${data.state}, ${data.pincode}, ${data.country}`;

    try {
      const geocodeResult = await mapService.geocodeAddress(fullAddress);

      if (!geocodeResult || !geocodeResult.geometry) {
        onError("Please enter the full or correct address");
        setValadating(false);
        return;
      }

      // Update coordinates from geocode result
      const { lat, lng } = geocodeResult.geometry.location;
      const updatedData = {
        ...data,
        latitude: lat(),
        longitude: lng(),
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
          onSettled: () => setValadating(false),
        });
      } else {
        if (!initialData?.id) {
          onError("Address ID is missing");
          setValadating(false);
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
            onSettled: () => setValadating(false),
          },
        );
      }
    } catch (error) {
      console.error("Validation error:", error);
      onError("Failed to validate address. Please try again.");
      setValadating(false);
    }
  };

  return {
    handleFormSubmit,
    isPending:
      addAddressMutation.isPending ||
      updateAddressMutation.isPending ||
      valadating,
  };
};
