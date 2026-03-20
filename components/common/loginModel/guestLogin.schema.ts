import { TranslationKey } from "@/features/i18n/TranslationContext";
import * as yup from "yup";

const phoneRegex = /^\+?\d{8,15}$/;

type TFunction = (key: TranslationKey) => string;

export const guestLoginSchema = (t: TFunction) => yup.object().shape({
  first_name: yup
    .string()
    .required(t("firstNameRequired"))
    .min(2, t("firstNameMin"))
    .max(50, t("firstNameMax"))
    .trim(),
  last_name: yup
    .string()
    .required(t("lastNameRequired"))
    .min(2, t("lastNameMin"))
    .max(50, t("lastNameMax"))
    .trim(),
  email: yup
    .string()
    .email(t("emailInvalid"))
    .required(t("emailRequired"))
    .trim()
    .lowercase(),
  country_code: yup
    .string()
    .required(t("countryCodeRequired"))
    .trim(),
  phone_number: yup
    .string()
    .required(t("phoneNumberRequired"))
    .matches(phoneRegex, t("phoneNumberInvalid"))
    .length(10, t("phoneNumberLength"))
    .trim(),
  password: yup
    .string()
    .required(t("passwordRequired"))
    .min(8, t("passwordMin"))
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      t("passwordComplexity")
    ),
  country: yup
    .string()
    .required(t("countryRequired"))
    .trim(),
});

export type GuestLoginFormData = yup.InferType<ReturnType<typeof guestLoginSchema>>;
