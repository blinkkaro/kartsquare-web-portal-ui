import { AIServiceConfigResponse } from "@/services/appConfig/appConfigInterface";
import { AppUserType } from "@/services/auth/auth.interface";

const AI_BOT_ENABLED_ROUTES = ["/", "/cus/servicesList"];

export const shouldShowAIBot = (
  currentPath: string,
  userRole?: AppUserType | null,
  appAIServiceConfig?: AIServiceConfigResponse | null,
): boolean => {
  return true;
  if (!appAIServiceConfig?.is_active) {
    return false;
  }

  if (userRole === AppUserType.SERVICE_PROVIDER) {
    return false;
  }

  if (AI_BOT_ENABLED_ROUTES.includes(currentPath)) {
    return true;
  }

  return false;
};

export { AI_BOT_ENABLED_ROUTES };
