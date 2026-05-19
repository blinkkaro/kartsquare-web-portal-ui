import * as yup from "yup";
import { TranslationKey } from "@/features/i18n/TranslationContext";
import { AppUserType, Gender } from "@/services/auth/auth.interface";
type TFunction = (key: TranslationKey) => string;

export const SignUpSchema = (t: TFunction, role: AppUserType) =>
  yup.object({
    first_name: yup
      .string()
      .trim()
      .min(2, t("firstNameMin"))
      .max(100, t("valNameMax"))
      .required(t("firstNameRequired")),
    last_name:
      role === AppUserType.SERVICE_PROVIDER || role === AppUserType.SUPPLIER
        ? yup.string().notRequired().default("")
        : yup
            .string()
            .trim()
            .min(2, t("lastNameMin"))
            .max(100, t("valNameMax"))
            .required(t("lastNameRequired")),
    email: yup
      .string()
      .trim()
      .email(t("emailInvalid"))
      .lowercase()
      .max(255, t("valEmailMax"))
      .required(t("emailRequired")),
    password: yup
      .string()
      .trim()
      .min(8, t("passwordMin"))
      .max(100, t("valNameMax"))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        t("passwordComplexity"),
      )
      .required(t("passwordRequired")),
    confirm_password: yup
      .string()
      .required("Confirm password is required")
      .oneOf([yup.ref("password")], "Passwords do not match"),
    // For SERVICE_PROVIDER/SUPPLIER: phone is prefilled from lead — not validated by form
    phone_number:
      role === AppUserType.SERVICE_PROVIDER || role === AppUserType.SUPPLIER
        ? yup.string().notRequired()
        : yup
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
    // country_code, country, birth_date, gender are optional for SP/Supplier (auto-set)
    country_code:
      role === AppUserType.SERVICE_PROVIDER || role === AppUserType.SUPPLIER
        ? yup.string().notRequired()
        : yup.string().required(t("countryCodeRequired")),
    country:
      role === AppUserType.SERVICE_PROVIDER || role === AppUserType.SUPPLIER
        ? yup.string().notRequired()
        : yup.string().required(t("countryRequired")),
    birth_date:
      role === AppUserType.SERVICE_PROVIDER || role === AppUserType.SUPPLIER
        ? yup.string().notRequired()
        : yup.string().required(t("birthDateRequired")),
    gender:
      role === AppUserType.SERVICE_PROVIDER || role === AppUserType.SUPPLIER
        ? yup.mixed<Gender>().oneOf(Object.values(Gender) as Gender[]).notRequired()
        : yup
            .mixed<Gender>()
            .oneOf(Object.values(Gender) as Gender[])
            .required(t("genderRequired")),
    role: yup
      .mixed<AppUserType>()
      .oneOf(Object.values(AppUserType) as AppUserType[])
      .required(t("roleRequired")),
  });

export type SignUpFormData = yup.InferType<ReturnType<typeof SignUpSchema>>;
