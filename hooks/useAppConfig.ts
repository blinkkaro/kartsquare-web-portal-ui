import { useQuery } from "@tanstack/react-query";
import { appConfigService } from "../services/appConfig/appConfigServices";

export const useTermsAndConditions = () => {
    return useQuery({
        queryKey: ['termsAndConditions'],
        queryFn: () => appConfigService.getAppTermsAndConditions(),
    });
};

export const usePrivacyPolicy = () => {
    return useQuery({
        queryKey: ['privacyPolicy'],
        queryFn: () => appConfigService.getAppPrivacyPolicy(),
    });
};

export const useAppAIServiceConfig = () => {
    return useQuery({
        queryKey: ['appAIServiceConfig'],
        queryFn: () => appConfigService.getAppAIServiceConfig(),
    });
};
