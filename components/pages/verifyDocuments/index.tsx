"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Box } from "@mui/material";
import {
  Badge as BadgeIcon,
  Person as PersonIcon,
  VerifiedUser as VerifiedUserIcon,
} from "@mui/icons-material";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslate } from "@/hooks/useTranslate";
import BackButton from "@/components/common/BackButton";
import Title from "@/components/auth/title";
import AuthWrapper from "@/components/auth/authWrapper";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import ErrorMessage from "@/components/common/ErrorMessage";
import { handleRegistrationStepNavigation } from "@/helper/registrationNavigation";
import { useLogout } from "@/hooks/useLogout";
import { useAppDispatch } from "@/store/hooks";
import { UserRegisterSteps } from "@/types/resgistrationFlow";
import { verifyDocumentService } from "@/services/auth/verifyDocument.service";
import { errorMessage } from "@/lib/http/errorMessage";
import ImageUpload from "./component/ImageUpload";
import { verifyDocumentSchema } from "./verifyDocumentSchema";

interface VerifyDocumentFormInputs {
  documentNumber: string;
  frontImage: File | null;
  backImage: File | null;
  profilePic: File | null;
  policeVerification?: File | null;
}

function VerifyDocumentsView() {
  const { t } = useTranslate();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { handleLogout } = useLogout();

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VerifyDocumentFormInputs>({
    resolver: yupResolver(verifyDocumentSchema(t)) as unknown as Resolver<VerifyDocumentFormInputs>,
    defaultValues: {
      documentNumber: "",
      frontImage: null,
      backImage: null,
      profilePic: null,
      policeVerification: null,
    },
  });

  const frontImage = watch("frontImage");
  const backImage = watch("backImage");
  const profilePic = watch("profilePic");
  const policeVerification = watch("policeVerification");

  const onSubmit = async (data: VerifyDocumentFormInputs) => {
    setIsLoading(true);
    setApiError("");
    try {
      if (data.frontImage && data.backImage && data.profilePic) {
        await verifyDocumentService.verifyDoc(
          data.documentNumber,
          data.frontImage,
          data.backImage,
          data.profilePic,
          data.policeVerification || undefined,
        );
        handleRegistrationStepNavigation(dispatch, router, UserRegisterSteps.DOCUMENT_VERIFIED);
      }
    } catch (error) {
      setApiError(errorMessage(error, "An unexpected error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  // Leaving registration signs the half-registered account out (one flow: useLogout).
  const handleBack = () => handleLogout({ redirectTo: "/business-listing" });

  type ImageField = "frontImage" | "backImage" | "profilePic" | "policeVerification";
  const handleImageSelect = (field: ImageField, file: File) => {
    setValue(field, file, { shouldValidate: true });
  };

  return (
    <AuthWrapper>
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
        <BackButton onClick={handleBack} />
      </Box>
      <Title title={t("verify_documents")} />

      <ErrorMessage isVisible={!!apiError} error={apiError} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Input
            name="documentNumber"
            control={control}
            label={t("aadhar_number")}
            placeholder={t("aadhar_number")}
          />

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ width: { xs: "calc(50% - 8px)", sm: "calc(50% - 12px)" } }}>
              <Controller
                name="frontImage"
                control={control}
                render={() => (
                  <ImageUpload
                    label={t("front_image")}
                    onImageSelect={(file) => handleImageSelect("frontImage", file)}
                    previewUrl={frontImage ? URL.createObjectURL(frontImage) : null}
                    error={errors.frontImage?.message as string}
                    icon={<BadgeIcon />}
                  />
                )}
              />
            </Box>
            <Box sx={{ width: { xs: "calc(50% - 8px)", sm: "calc(50% - 12px)" } }}>
              <Controller
                name="backImage"
                control={control}
                render={() => (
                  <ImageUpload
                    label={t("back_image")}
                    onImageSelect={(file) => handleImageSelect("backImage", file)}
                    previewUrl={backImage ? URL.createObjectURL(backImage) : null}
                    error={errors.backImage?.message as string}
                    icon={<BadgeIcon />}
                  />
                )}
              />
            </Box>
            <Box sx={{ width: { xs: "calc(50% - 8px)", sm: "calc(50% - 12px)" } }}>
              <Controller
                name="profilePic"
                control={control}
                render={() => (
                  <ImageUpload
                    label={t("profile_pic")}
                    onImageSelect={(file) => handleImageSelect("profilePic", file)}
                    previewUrl={profilePic ? URL.createObjectURL(profilePic) : null}
                    error={errors.profilePic?.message as string}
                    icon={<PersonIcon />}
                  />
                )}
              />
            </Box>
            <Box sx={{ width: { xs: "calc(50% - 8px)", sm: "calc(50% - 12px)" } }}>
              <Controller
                name="policeVerification"
                control={control}
                render={() => (
                  <ImageUpload
                    label={t("police_verification")}
                    onImageSelect={(file) => handleImageSelect("policeVerification", file)}
                    previewUrl={policeVerification ? URL.createObjectURL(policeVerification) : null}
                    error={errors.policeVerification?.message as string}
                    icon={<VerifiedUserIcon />}
                  />
                )}
              />
            </Box>
          </Box>
          <Button type="submit" fullWidth variant="contained" isLoading={isLoading}>
            {t("verify_now")}
          </Button>
        </Box>
      </form>
    </AuthWrapper>
  );
}

export default VerifyDocumentsView;
