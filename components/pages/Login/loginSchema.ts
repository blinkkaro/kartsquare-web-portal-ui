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
      .max(100, t("valNameMax"))
      .required(t("passwordRequired")),
  });

export type LoginFormData = yup.InferType<ReturnType<typeof LoginSchema>>;
