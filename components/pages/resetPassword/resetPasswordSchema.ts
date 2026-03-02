import { TranslationKey } from "@/features/i18n/TranslationContext";
import * as yup from "yup";

type CFunction = (key: TranslationKey) => string;

export const createResetPasswordSchema = (t: CFunction) => {
  const passwordComplexityRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  return yup.object({
    code: yup
      .string()
      .trim()
      .required(t("codeRequired"))
      .min(6, t("codeMin"))
      .max(6, t("valOtpMax")),
    password: yup
      .string()
      .trim()
      .min(8, t("passwordMin"))
      .max(100, t("valNameMax"))
      .matches(passwordComplexityRegex, t("passwordComplexity"))
      .required(t("passwordRequired")),
    confirmPassword: yup
      .string()
      .trim()
      .oneOf([yup.ref("password"), undefined], t("passwordMatch"))
      .required(t("confirmPasswordRequired")),
  });
};

export type ResetPasswordFormData = yup.InferType<
  ReturnType<typeof createResetPasswordSchema>
>;
