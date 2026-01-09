"use client";
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { english } from "./en";
// Define available languages
// export type Locale = "en" | "es" | "hi";

// Define translation keys (example)
export type TranslationKey =
  | "welcome_back"
  | "email_address"
  | "password"
  | "forgot_password"
  | "login"
  | "continue_with_google"
  | "no_account"
  | "sign_up"
  | "brand_tagline"
  | "continue_as"
  | "customer"
  | "service_provider"
  | "supplier"
  | "login_subtitle"
  | "emailInvalid"
  | "emailRequired"
  | "passwordMin"
  | "passwordComplexity"
  | "passwordRequired"
  | "email_verification"
  | "email_verification_subtitle"
  | "email_verification_success"
  | "email_verification_success_description"
  | "signUp"
  | "signUpSubtitle"
  | "firstNameRequired"
  | "firstNameMin"
  | "lastNameRequired"
  | "lastNameMin"
  | "phoneNumberRequired"
  | "countryCodeRequired"
  | "countryRequired"
  | "birthDateRequired"
  | "genderRequired"
  | "genderRequired"
  | "genderRequired"
  | "genderRequired"
  | "by_signup_to_accept"
  | "privacy_policy"
  | "first_name"
  | "last_name"
  | "email_address"
  | "password"
  | "phone_number"
  | "country"
  | "birth_date"
  | "gender"
  | "select_gender"
  | "male"
  | "female"
  | "other"
  | "prefer_not_to_say"
  | "signup"
  | "skip"
  | "forgetPassword"
  | "forgetPasswordSubtitle"
  | "codeRequired"
  | "codeMin"
  | "resetPassword"
  | "resetPasswordSubtitle"
  | "passwordMatch"
  | "confirmPasswordRequired"
  | "newPassword"
  | "confirmPassword"
  | "code"
  | "preferences"
  | "category"
  | "continue"
  | "verify_documents"
  | "imageRequired"
  | "documentNumberRequired"
  | "documentNumberInvalid"
  | "documentNumberLength"
  | "aadhar_number"
  | "front_image"
  | "back_image"
  | "profile_pic"
  | "police_verification"
  | "upload_image"
  | "take_photo"
  | "retake"
  | "verify_now"
  | "camera_error"
  | "upload_error"
  | "front_image_required"
  | "back_image_required"
  | "profile_pic_required"
  | "schedule"
  | "scheduleSubtitle"
  | "alreadyHaveAnAccount"
  | "resend_otp"
  | "verify"
  | "privacyPolicytitle"
  | "termsConditionsTitle"
  | "lastUpdatedAt"
  | "something_went_wrong";

// Sample dictionaries
const dictionaries: Record<"en", Record<TranslationKey, string>> = {
  en: english,
  // es: {
  //   welcome_back: "¡Bienvenido de nuevo!",
  //   email_address: "Correo electrónico",
  //   password: "Contraseña",
  //   forgot_password: "¿Olvidaste tu contraseña?",
  //   login: "Iniciar sesión",
  //   continue_with_google: "Continuar con Google",
  //   no_account: "¿No tienes una cuenta?",
  //   sign_up: "Regístrate",
  //   brand_tagline: "Tu socio de 8 manos",
  //   continue_as: "Continuar como",
  //   customer: "Cliente",
  //   service_provider: "Proveedor de servicios",
  //   supplier: "Proveedor",
  //   login_subtitle:
  //     "Ingrese su correo electrónico y contraseña para iniciar sesión.",
  //   emailInvalid: "Correo electrónico no válido",
  //   emailRequired: "El correo electrónico es obligatorio",
  //   passwordMin: "La contraseña debe tener al menos 8 caracteres",
  //   passwordComplexity:
  //     "La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales",
  //   passwordRequired: "Se requiere contraseña",
  //   email_verification: "Verificar tu dirección de correo electrónico",
  //   email_verification_subtitle: "Por favor, ingresa el código de verificación enviado a tu correo electrónico registrado para verificar tu identidad.",
  // },
  // hi: {
  //   welcome_back: "वापसी पर स्वागत है!",
  //   email_address: "ईमेल पता",
  //   password: "पासवर्ड",
  //   forgot_password: "पासवर्ड भूल गए?",
  //   login: "लॉग इन करें",
  //   continue_with_google: "Google के साथ जारी रखें",
  //   no_account: "क्या आपके पास खाता नहीं है?",
  //   sign_up: "साइन अप करें",
  //   brand_tagline: "आपका 8 हाथों वाला साथी",
  //   continue_as: "के रूप में जारी रखें",
  //   customer: "ग्राहक",
  //   service_provider: "सेवा प्रदाता",
  //   supplier: "आपूर्तिकर्ता",
  //   login_subtitle: "लॉगिन करने के लिए अपना ईमेल और पासवर्ड दर्ज करें।",
  //   emailInvalid: "अमान्य ईमेल",
  //   emailRequired: "ईमेल आवश्यक है",
  //   passwordMin: "पासवर्ड कम से कम 8 वर्ण का होना चाहिए",
  //   passwordComplexity:
  //     "पासवर्ड में अपरकेस, लोअरकेस, नंबर और विशेष वर्ण होने चाहिए",
  //   passwordRequired: "पासवर्ड आवश्यक है",
  //   email_verification: "अपने ईमेल पते की पुष्टि करें",
  //   email_verification_subtitle: "कृपया अपनी पहचान सत्यापित करने के लिए अपने पंजीकृत ईमेल पते पर भेजा गया वन-टाइम पासवर्ड (OTP) दर्ज करें।",
  // },
};

interface TranslationContextType {
  locale: "en";
  setLocale: (locale: "en") => void;
  t: (key: TranslationKey) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<"en">("en");

  const t = (key: TranslationKey): string => {
    return dictionaries[locale][key] || key;
  };

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslationContext() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error(
      "useTranslationContext must be used within a TranslationProvider"
    );
  }
  return context;
}
