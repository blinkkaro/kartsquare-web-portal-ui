import { useState, useEffect } from "react";
import { useTranslate } from "./useTranslate";

interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface GeolocationState {
  coordinates: Coordinates | null;
  isLoading: boolean;
  error: string | null;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export const useGeolocation = (options?: UseGeolocationOptions) => {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    isLoading: false,
    error: null,
  });
  const {t} = useTranslate()

  const getCoordinates = () => {
    if (!navigator.geolocation) {
      setState({
        coordinates: null,
        isLoading: false,
        error: t("geolocationNotSupported"),
      });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: options?.enableHighAccuracy ?? true,
      timeout: options?.timeout ?? 10000,
      maximumAge: options?.maximumAge ?? 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          },
          isLoading: false,
          error: null,
        });
      },
      (error) => {
        let errorMessage = t("failedToGetLocation");
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = t("locationPermissionDenied");
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = t("locationInformationUnavailable");
            break;
          case error.TIMEOUT:
            errorMessage = t("locationRequestTimedOut");
            break;
        }
        setState({
          coordinates: null,
          isLoading: false,
          error: errorMessage,
        });
      },
      defaultOptions
    );
  };

  return {
    coordinates: state.coordinates,
    isLoading: state.isLoading,
    error: state.error,
    getCoordinates,
  };
};

// Hook that automatically gets coordinates on mount
export const useAutoGeolocation = (options?: UseGeolocationOptions) => {
  const geolocation = useGeolocation(options);

  useEffect(() => {
    geolocation.getCoordinates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return geolocation;
};
