import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { freeLeadService } from "@/services/auth/freeLead.service";
import { IFreeLeadParams } from "@/services/auth/auth.interface";
import { toast } from "react-hot-toast";

export const useLeadVerification = (leadId?: string | null) => {
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const checkUserMutation = useMutation({
    mutationFn: (params: IFreeLeadParams) =>
      freeLeadService.applyForFreeListing(params),
    onSuccess: (response) => {
      if (response?.bus_lead_id) {
        sessionStorage.setItem("bus_lead_id", response.bus_lead_id);
      }

      if (response.status !== "VERIFIED") {
        setVerificationId(response.bus_lead_id);
        setIsOtpOpen(true);
      } else {
        if (response.isRegistered) {
          router.push("/login?role=service_provider");
        } else {
          router.push("/signUp?role=customer");
        }
      }
    },
    onError: (err: any) => {
      console.error("Check user error:", err);
      const errorMessage = err.message || "Something went wrong";
      setError(errorMessage);
      toast.error(errorMessage);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: ({ id, otp }: { id: string; otp: string }) =>
      freeLeadService.verifyNumber(id, otp),
    onSuccess: (isVerified) => {
      if (isVerified) {
        setIsOtpOpen(false);
        toast.success("Verification successful");
        router.push("/signUp?role=service_provider");
      }
    },
    onError: (err: any) => {
      console.error("Verification error:", err);
      const errorMessage = err.message || "Verification failed";
      setError(errorMessage);
      toast.error(errorMessage);
    },
  });

  /* Removed getNumberMutation */
  const leadDetailsQuery = useQuery({
    queryKey: ["leadDetails", leadId],
    queryFn: () => freeLeadService.getNumber(leadId!),
    enabled: !!leadId,
    retry: false,
  });

  const handleCheckUser = (params: IFreeLeadParams) => {
    setError(null);
    checkUserMutation.mutate(params);
  };

  const handleVerifyOtp = (otp: string) => {
    if (!verificationId) return;
    setError(null);
    verifyOtpMutation.mutate({ id: verificationId, otp });
  };

  const closeOtpModal = () => {
    setIsOtpOpen(false);
    setVerificationId(null);
    setError(null);
  };

  return {
    loading: checkUserMutation.isPending || verifyOtpMutation.isPending,
    isOtpOpen,
    error,
    handleCheckUser,
    handleVerifyOtp,
    closeOtpModal,
    leadDetailsQuery,
  };
};
