export enum UserRegisterSteps {
  REGISTERED = 1,
  EMAIL_VERIFIED = 2,
  DOCUMENT_VERIFIED = 3,
  SCHEDULE_ADDED = 4,
  PREFERENCES_ADDED = 5,
  COMPLETED = 6,
}

import { AppUserType } from "@/services/auth/auth.interface";

export type RegistrationStackParamList = {
  VerifyEmail: undefined;
  UploadDocuments: undefined;
  ScheduleScreen: undefined;
  SetPreferences: undefined;
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
    [UserRegisterSteps.EMAIL_VERIFIED]: "UploadDocuments",
    [UserRegisterSteps.DOCUMENT_VERIFIED]: "ScheduleScreen",
    [UserRegisterSteps.SCHEDULE_ADDED]: "SetPreferences",
  },
  SUPPLIER: {
    [UserRegisterSteps.REGISTERED]: "VerifyEmail",
    [UserRegisterSteps.EMAIL_VERIFIED]: "UploadDocuments",
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
  screen: keyof RegistrationStackParamList | undefined
): string => {
  if (!screen) return "/";

  const screenToPathMap: Record<keyof RegistrationStackParamList, string> = {
    VerifyEmail: "/emailVerfication",
    UploadDocuments: "/verifyDocuments",
    ScheduleScreen: "/schedule",
    SetPreferences: "/preferences",
  };

  return screenToPathMap[screen] || "/";
};
