import { AIServiceConfigResponse } from "@/services/appConfig/appConfigInterface";
import { AppUserType } from "@/services/auth/auth.interface";

export const shouldShowAIBot = (
  currentPath: string,
  userRole?: AppUserType | null,
  appAIServiceConfig?: AIServiceConfigResponse | null,
): boolean => {
  return true;
};
