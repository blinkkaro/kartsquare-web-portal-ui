import * as yup from "yup";
import { TranslationKey } from "@/features/i18n/TranslationContext";

type TFunction = (key: TranslationKey) => string;

export const SupplierQuotationSchema = (t: TFunction) =>
  yup.object({
    phone_number: yup
      .string()
      .required(t("phoneNumberRequired"))
      .length(10, t("phoneNumberLength"))
      .matches(/^[0-9]+$/, t("phoneNumberDigitsOnly")),
    customer_name: yup
      .string()
      .min(2, t("nameMin"))
      .required(t("nameRequired")),
    email: yup
      .string()
      .email(t("emailInvalid"))
      .required(t("emailRequired")),
    quantity: yup
      .number()
      .min(1, t("quantityMin"))
      .required(t("quantityRequired"))
      .typeError(t("quantityTypeError")),
    details: yup
      .string()
      .min(10, t("detailsMinLength"))
      .required(t("detailsRequired")),
    country_code: yup.string().required(t("countryCodeRequired")),
  });

export type SupplierQuotationFormData = yup.InferType<
  ReturnType<typeof SupplierQuotationSchema>
>;
