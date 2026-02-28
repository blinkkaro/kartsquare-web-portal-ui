import * as yup from "yup";
import { TranslationKey } from "@/features/i18n/TranslationContext";

type TFunction = (key: TranslationKey) => string;

export const LoginSchema = (t: TFunction) =>
  yup.object({
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
  });

export type LoginFormData = yup.InferType<ReturnType<typeof LoginSchema>>;
