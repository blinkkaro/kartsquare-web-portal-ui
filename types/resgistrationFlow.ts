export enum UserRegisterSteps {
  // Common user steps
  REGISTERED = 1,               // Account created
  EMAIL_VERIFIED = 2,           // Email verified
  BUSINESS_INFO = 3,            // Business / Profile info
  DOCUMENT_VERIFIED = 4,        // KYC / Documents verified
  SCHEDULE_ADDED = 5,           // Availability / schedule
  PREFERENCES_ADDED = 6,        // Preferences
  COMPLETED = 7,                // User onboarding complete

  // Supplier-specific (starts AFTER normal completion)
  SUPPLIER_PROFILE_COMPLETED = 8,
  SUPPLIER_KYC_SUBMITTED = 9,
  SUPPLIER_KYC_VERIFIED = 10,
  SUPPLIER_STORE_CREATED = 11,
}

import { AppUserType } from "@/services/auth/auth.interface";

export type RegistrationStackParamList = {
  VerifyEmail: undefined;
  BusinessInfo: undefined;
  UploadDocuments: undefined;
  ScheduleScreen: undefined;
  SetPreferences: undefined;
  SupplierOnboarding: undefined;
};

type UserFlowMap = Partial<
  Record<UserRegisterSteps, keyof RegistrationStackParamList>
>;

export const registrationStepMap: Record<AppUserType, UserFlowMap> = {
  CUSTOMER: {
    [UserRegisterSteps.REGISTERED]: "VerifyEmail",
    [UserRegisterSteps.EMAIL_VERIFIED]: "SetPreferences",
    [UserRegisterSteps.SCHEDULE_ADDED]: "SetPreferences",
  },
  SERVICE_PROVIDER: {
    [UserRegisterSteps.REGISTERED]: "VerifyEmail",
    [UserRegisterSteps.EMAIL_VERIFIED]: "BusinessInfo",
    [UserRegisterSteps.BUSINESS_INFO]: "UploadDocuments",
    [UserRegisterSteps.DOCUMENT_VERIFIED]: "ScheduleScreen",
    [UserRegisterSteps.SCHEDULE_ADDED]: "SetPreferences",
  },
  SUPPLIER: {
    [UserRegisterSteps.REGISTERED]: "VerifyEmail",
    [UserRegisterSteps.EMAIL_VERIFIED]: "SupplierOnboarding",
    [UserRegisterSteps.SUPPLIER_PROFILE_COMPLETED]: "SupplierOnboarding",
    [UserRegisterSteps.SUPPLIER_KYC_SUBMITTED]: "SupplierOnboarding",
    [UserRegisterSteps.SUPPLIER_KYC_VERIFIED]: "SupplierOnboarding",
  },
  INFLUENCER: {
    [UserRegisterSteps.REGISTERED]: "VerifyEmail",
    [UserRegisterSteps.EMAIL_VERIFIED]: "SetPreferences",
    [UserRegisterSteps.SCHEDULE_ADDED]: "SetPreferences",
  },
};

/**
 * Maps registration screen names to their corresponding route paths
 */
export const getPathForScreen = (
  screen: keyof RegistrationStackParamList | undefined,
): string => {
  if (!screen) return "/";

  const screenToPathMap: Record<keyof RegistrationStackParamList, string> = {
    VerifyEmail: "/emailVerfication",
    BusinessInfo: "/businessInfo",
    UploadDocuments: "/verifyDocuments",
    ScheduleScreen: "/schedule",
    SetPreferences: "/preferences",
    SupplierOnboarding: "/supplier/onboarding",
  };

  return screenToPathMap[screen] || "/";
};
