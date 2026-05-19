export enum UserRegisterSteps {
  // Common user steps
  ANONYMOUS = 0,
  REGISTERED = 1,               // Account created
  EMAIL_VERIFIED = 2,           // Email verified
  BUSINESS_INFO = 3,            // Business / Profile info
  DOCUMENT_VERIFIED = 4,        // KYC / Documents verified
  SCHEDULE_ADDED = 5,           // Availability / schedule
  PREFERENCES_ADDED = 6,        // Preferences
  COMPLETED = 7,                // User onboarding complete

  // Supplier-specific (starts AFTER normal completion)
  // SUPPLIER_PROFILE_COMPLETED = 8,
  // SUPPLIER_KYC_SUBMITTED = 9,
  SUPPLIER_STORE_CREATED = 8,
  SUPPLIER_KYC_SUBMITTED = 9,
}

import { AppUserType } from "@/services/auth/auth.interface";

export type RegistrationStackParamList = {
  Register: undefined;
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
    [UserRegisterSteps.ANONYMOUS]: "Register",
    [UserRegisterSteps.REGISTERED]: "VerifyEmail",
    [UserRegisterSteps.EMAIL_VERIFIED]: "SetPreferences",
    [UserRegisterSteps.SCHEDULE_ADDED]: "SetPreferences",
  },
  SERVICE_PROVIDER: {
    [UserRegisterSteps.REGISTERED]: "VerifyEmail",
    [UserRegisterSteps.EMAIL_VERIFIED]: "BusinessInfo",
    [UserRegisterSteps.BUSINESS_INFO]: "ScheduleScreen",
    [UserRegisterSteps.DOCUMENT_VERIFIED]: "ScheduleScreen",
    [UserRegisterSteps.SCHEDULE_ADDED]: undefined,
  },
  SUPPLIER: {
    [UserRegisterSteps.REGISTERED]: "VerifyEmail",
    [UserRegisterSteps.EMAIL_VERIFIED]: "SupplierOnboarding",
    // [UserRegisterSteps.BUSINESS_INFO]: "SupplierOnboarding",
    // [UserRegisterSteps.DOCUMENT_VERIFIED]: "SupplierOnboarding",
    // [UserRegisterSteps.SCHEDULE_ADDED]: "SupplierOnboarding",
    // [UserRegisterSteps.PREFERENCES_ADDED]: "SupplierOnboarding",
    // [UserRegisterSteps.COMPLETED]: "SupplierOnboarding",
    // [UserRegisterSteps.SUPPLIER_PROFILE_COMPLETED]: "SupplierOnboarding",
    [UserRegisterSteps.SUPPLIER_KYC_SUBMITTED]: "SupplierOnboarding",
    [UserRegisterSteps.SUPPLIER_STORE_CREATED]: "SupplierOnboarding",
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
    Register: "/signUp?role=customer",
    VerifyEmail: "/emailVerfication",
    BusinessInfo: "/businessInfo",
    UploadDocuments: "/verifyDocuments",
    ScheduleScreen: "/schedule",
    SetPreferences: "/preferences",
    SupplierOnboarding: "/supplier/onboarding",
  };

  return screenToPathMap[screen] || "/";
};
