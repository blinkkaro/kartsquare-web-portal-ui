import { useQuery } from "@tanstack/react-query";
import { appConfigService } from "../services/appConfig/appConfigServices";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import {
  fetchAIServiceConfig,
  selectAIServiceConfig,
  selectAppConfigLoading,
  selectAppConfigError,
} from "@/features/ui/appConfigSlice";
import { AIServiceConfigResponse } from "@/services/appConfig/appConfigInterface";

export const useTermsAndConditions = () => {
    return useQuery({
        queryKey: ['termsAndConditions'],
        queryFn: () => appConfigService.getAppTermsAndConditions(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    });
};

export const usePrivacyPolicy = () => {
    return useQuery({
        queryKey: ['privacyPolicy'],
        queryFn: () => appConfigService.getAppPrivacyPolicy(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};

/**
 * Hook to get AI Service Config from Redux store
 * Automatically fetches if not cached or cache is stale
 * Uses Redux for state management to reduce API calls across components
 */
export const useAppAIServiceConfig = () => {
    const dispatch = useAppDispatch();
    const aiServiceConfig = useAppSelector(selectAIServiceConfig);
    const loading = useAppSelector(selectAppConfigLoading);
    const error = useAppSelector(selectAppConfigError);

    useEffect(() => {
        // Only fetch if we don't have data or it's stale
        if (!aiServiceConfig && !loading) {
            // dispatch(fetchAIServiceConfig());
        }
    }, [dispatch, aiServiceConfig, loading]);

    return {
        data: aiServiceConfig,
        isLoading: loading,
        error: error,
    };
};
