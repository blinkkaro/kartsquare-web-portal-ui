import { useAddAddress, useUpdateAddress } from "@/hooks/useAddress";
import { AddressFormData } from "@/components/common/address/AddressSchema";
import { Address } from "@/services/address/addressInterface";

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

  const handleFormSubmit = (data: AddressFormData) => {
    if (mode === "add") {
      addAddressMutation.mutate(data, {
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
      });
    } else {
      if (!initialData?.id) {
        onError("Address ID is missing");
        return;
      }

      updateAddressMutation.mutate(
        { id: initialData.id, data },
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
        },
      );
    }
  };

  return {
    handleFormSubmit,
    isPending: addAddressMutation.isPending || updateAddressMutation.isPending,
  };
};
