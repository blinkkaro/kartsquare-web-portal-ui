import * as yup from "yup";
import { TranslationKey } from "@/features/i18n/TranslationContext";

type TFunction = (key: TranslationKey) => string;

export const BusinessInfoSchema = (t: TFunction) =>
  yup.object({
    business_name: yup
      .string()
      .trim()
      .max(100, t("valNameMax"))
      .required(t("businessNameRequired")),
    // description: yup.string().required(t("businessDescriptionRequired")),
    address_id: yup.string().trim().required(t("businessAddressRequired")),
    category: yup.string().required("Business category is required"),
    sub_category: yup
      .array()
      .of(yup.string())
      .min(1, "At least one sub category is required")
      .required("Sub category is required"),
    business_images: yup
      .array()
      .of(yup.mixed())
      .required(t("businessImagesRequired"))
      .min(1, t("businessImagesRequired"))
      .max(5, t("businessImagesRequired")),
  });

export type BusinessInfoFormData = yup.InferType<
  ReturnType<typeof BusinessInfoSchema>
>;
