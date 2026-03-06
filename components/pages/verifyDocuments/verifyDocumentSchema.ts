import * as yup from "yup";
import { TranslationKey } from "@/features/i18n/TranslationContext";

type TFunction = (key: TranslationKey) => string;

export const verifyDocumentSchema = (t: TFunction) => {
  const numericRegex = /^[0-9]+$/;
  const fileSchema = yup.mixed().nullable().required(t("imageRequired"));
  return yup.object({
    documentNumber: yup
      .string()
      .trim()
      .required(t("documentNumberRequired"))
      .matches(numericRegex, t("documentNumberInvalid"))
      .length(12, t("documentNumberInvalid")),
    frontImage: fileSchema,
    backImage: fileSchema,
    profilePic: fileSchema,
    policeVerification: yup.mixed().nullable().notRequired(),
  });
};
