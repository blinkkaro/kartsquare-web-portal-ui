import * as yup from "yup";
import { TranslationKey } from "@/features/i18n/TranslationContext";
type TFunction = (key: TranslationKey) => string;

export const changePasswordSchema = (t: TFunction) =>
  yup.object({
    currentPassword: yup
      .string()
      .trim()
      .min(8, t("passwordMin"))
      .max(100, t("valNameMax"))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        t("passwordComplexity"),
      )
      .required(t("currentPasswordRequired")),
    password: yup
      .string()
      .trim()
      .min(8, t("passwordMin"))
      .max(100, t("valNameMax"))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        t("passwordComplexity"),
      )
      .notOneOf([yup.ref("currentPassword")], t("newPasswordNotMatch"))
      .required(t("newPasswordRequired")),
    confirmPassword: yup
      .string()
      .trim()
      .min(8, t("passwordMin"))
      .max(100, t("valNameMax"))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        t("passwordComplexity"),
      )
      .oneOf([yup.ref("password")], t("passwordMatch"))
      .required(t("confirmPasswordRequired")),
  });
