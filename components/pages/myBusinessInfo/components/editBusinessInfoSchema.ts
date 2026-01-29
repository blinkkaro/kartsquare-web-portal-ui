import * as yup from "yup";
import { TranslationKey } from "@/features/i18n/TranslationContext";

type TFunction = (key: TranslationKey) => string;

export const EditBusinessInfoSchema = (t: TFunction) =>
  yup.object({
    business_name: yup.string().required(t("businessNameRequired")),
    description: yup.string().required(t("businessDescriptionRequired")),
    address_id: yup.string().required(t("businessAddressRequired")),
    business_images: yup
      .array()
      .of(yup.mixed())
      .required(t("businessImagesRequired"))
      .min(1, t("businessImagesRequired"))
      .max(5, t("businessImagesMax" as any) || "Maximum 5 images allowed"), // Fallback if key doesn't exist perfectly or requires params
  });

export type EditBusinessInfoFormData = yup.InferType<
  ReturnType<typeof EditBusinessInfoSchema>
>;
