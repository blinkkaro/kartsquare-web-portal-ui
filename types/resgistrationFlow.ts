export enum UserRegisterSteps {
  REGISTERED = 1,
  EMAIL_VERIFIED = 2,
  BUSINESS_INFO = 3,
  DOCUMENT_VERIFIED = 4,
  SCHEDULE_ADDED = 5,
  PREFERENCES_ADDED = 6,
  COMPLETED = 7,
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
    [UserRegisterSteps.DOCUMENT_VERIFIED]: "ScheduleScreen",
    [UserRegisterSteps.SCHEDULE_ADDED]: "SetPreferences",
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
