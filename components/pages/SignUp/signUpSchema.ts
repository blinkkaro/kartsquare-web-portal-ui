import * as yup from "yup";
import { TranslationKey } from "@/features/i18n/TranslationContext";
import { AppUserType, Gender } from "@/services/auth/auth.interface";
type TFunction = (key: TranslationKey) => string;

export const SignUpSchema = (t: TFunction, role: AppUserType) =>
  yup.object({
    first_name: yup
      .string()
      .min(2, t("firstNameMin"))
      .required(t("firstNameRequired")),
    last_name: yup
      .string()
      .min(2, t("lastNameMin"))
      .required(t("lastNameRequired")),
    email: yup
      .string()
      .email(t("emailInvalid"))
      .lowercase()
      .required(t("emailRequired")),
    password: yup
      .string()
      .min(8, t("passwordMin"))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        t("passwordComplexity"),
      )
      .required(t("passwordRequired")),
    phone_number: yup
      .string()
      .required(t("phoneNumberRequired"))
      .length(10, t("phoneNumberLength"))
      .matches(/^[0-9]+$/, t("phoneNumberInvalid")),
    whatsapp_number:
      role === AppUserType.SERVICE_PROVIDER || role === AppUserType.SUPPLIER
        ? yup
            .string()
            .required(t("whatsappNumberRequired"))
            .length(10, t("whatsappNumberLength"))
            .matches(/^[0-9]+$/, t("whatsappNumberInvalid"))
        : yup.string().notRequired(),
    whatsapp_country_code:
      role === AppUserType.SERVICE_PROVIDER || role === AppUserType.SUPPLIER
        ? yup.string().required(t("whatsappCountryCodeRequired"))
        : yup.string().notRequired(),
    country_code: yup.string().required(t("countryCodeRequired")),
    country: yup.string().required(t("countryRequired")),
    birth_date: yup.string().required(t("birthDateRequired")),
    gender: yup
      .mixed<Gender>()
      .oneOf(Object.values(Gender) as Gender[])
      .required(t("genderRequired")),
    role: yup
      .mixed<AppUserType>()
      .oneOf(Object.values(AppUserType) as AppUserType[])
      .required(t("roleRequired")),
  });

export type SignUpFormData = yup.InferType<ReturnType<typeof SignUpSchema>>;
