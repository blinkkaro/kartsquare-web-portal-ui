import { useState, useEffect, useRef } from "react";
import { UseFormSetValue } from "react-hook-form";
import { mapService } from "@/services/map/mapService";
import { AddressFormData } from "@/components/common/address/AddressSchema";
import { Address } from "@/services/address/addressInterface";

interface UseAddressMapProps {
  initialData: Address | null;
  setValue: UseFormSetValue<AddressFormData>;
  coordinates: { latitude: number; longitude: number } | null | undefined;
  watch: any;
  onReverseGeocodeComplete?: () => void;
}

export const useAddressMap = ({
  initialData,
  setValue,
  coordinates,
  watch,
  onReverseGeocodeComplete,
}: UseAddressMapProps) => {
  const [mapCoordinates, setMapCoordinates] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 28.6139, lng: 77.209 }); // Default to New Delhi
  const [isInternalUpdate, setIsInternalUpdate] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const isTypingRef = useRef(false);
  const lastFetchedCoordsRef = useRef<{ lat: number; lng: number } | null>(null);

  // Form values watched
  const watchedAddress = watch("address");
  const watchedLandmark = watch("landmark");
  const watchedCityTown = watch("city_town");
  const watchedState = watch("state");
  const watchedPincode = watch("pincode");

  // Update map coordinates when geolocation coordinates change
  useEffect(() => {
    if (coordinates?.latitude && coordinates?.longitude) {
      setMapCoordinates({
        lat: coordinates.latitude,
        lng: coordinates.longitude,
      });
    }
  }, [coordinates]);

  // Update map coordinates for edit mode
  useEffect(() => {
    if (initialData?.latitude && initialData?.longitude) {
      setMapCoordinates({
        lat: Number(initialData.latitude),
        lng: Number(initialData.longitude),
      });
      // Also ensure form values are set
      setValue("latitude", Number(initialData.latitude));
      setValue("longitude", Number(initialData.longitude));
    }
  }, [initialData, setValue]);

  const handleMapLocationChange = (lat: number, lng: number) => {
    setMapCoordinates({ lat, lng });
    setValue("latitude", lat);
    setValue("longitude", lng);
  };

  const fetchAddressFromCoordinates = async (lat: number, lng: number) => {
    // Check if Google Maps API is loaded
    if (typeof window === "undefined" || !window.google || !window.google.maps) {
      return;
    }

    try {
      // Check if we already fetched for this exact location (with small threshold)
      if (lastFetchedCoordsRef.current) {
        const dLat = Math.abs(lastFetchedCoordsRef.current.lat - lat);
        const dLng = Math.abs(lastFetchedCoordsRef.current.lng - lng);
        if (dLat < 0.00001 && dLng < 0.00001) return;
      }

      setIsValidating(true);
      lastFetchedCoordsRef.current = { lat, lng };
      
      const addressData = await mapService.reverseGeocode(lat, lng);

      if (!addressData?.address_components) return;

      const components = addressData.address_components;
      const findComp = (types: string[]) => 
        components.find((c: any) => types.some(type => c.types.includes(type)))?.long_name || "";

      const streetNumber = findComp(["street_number"]);
      const route = findComp(["route"]);
      const neighborhood = findComp(["neighborhood"]);
      const subLocality = findComp(["sublocality", "sublocality_level_1"]);
      const subLocality2 = findComp(["sublocality_level_2"]);
      const premise = findComp(["premise"]);
      const locality = findComp(["locality"]);
      const adminArea2 = findComp(["administrative_area_level_2"]);
      const adminArea1 = findComp(["administrative_area_level_1"]);
      const countryName = findComp(["country"]);
      const postalCode = findComp(["postal_code"]);
      const pointOfInterest = findComp(["point_of_interest"]);

      setIsInternalUpdate(true);
      
      const finalBuildingNo = streetNumber || premise || "";
      setValue("building_no", finalBuildingNo, { shouldValidate: true, shouldDirty: true });

      // Landmark/Area
      const finalLandmark = pointOfInterest || neighborhood || "";
      setValue("landmark", finalLandmark, { shouldValidate: true, shouldDirty: true });

      // Better Street Address Construction
      // If we have a route, use it. Otherwise use sublocalities.
      let streetAddress = [route, subLocality, subLocality2]
        .filter(Boolean)
        .join(", ");
      
      // If the constructed address is too short or redundant, use formatted_address (cleaned up)
      if (!streetAddress && addressData.formatted_address) {
        // Strip city, state, country, pincode from formatted_address for the "Address" field
        streetAddress = addressData.formatted_address.split(", " + locality)[0];
      }

      setValue("address", streetAddress || "", { shouldValidate: true, shouldDirty: true });

      const finalCity = locality || subLocality || adminArea2 || "";
      setValue("city_town", finalCity, { shouldValidate: true, shouldDirty: true });
      setValue("state", adminArea1 || "", { shouldValidate: true, shouldDirty: true });
      setValue("country", countryName || "India", { shouldValidate: true, shouldDirty: true });
      setValue("pincode", postalCode || "", { shouldValidate: true, shouldDirty: true });
      
      setTimeout(() => {
        setIsInternalUpdate(false);
        setIsValidating(false);
        if (onReverseGeocodeComplete) onReverseGeocodeComplete();
      }, 1000);

    } catch (error) {
      setIsValidating(false);
      // console.error("Error fetching address from coordinates:", error);
    }
  };

  // Form Population Logic (from Reverse Geocode) - DEBOUNCED
  useEffect(() => {
    // If we're currently geocoding from a manual form entry, don't reverse geocode
    if (isInternalUpdate || isTypingRef.current) return;

    // Skip if we are in edit mode and just loaded (to prevent overwriting existing data)
    // We only want to reverse geocode if the coordinates actually change from the map movement
    
    const timer = setTimeout(() => {
      if (mapCoordinates.lat && mapCoordinates.lng) {
        // Only fetch if coordinates are different from what's currently in        // Fetch if coordinates changed from map movement
        const currentLat = watch("latitude");
        const currentLng = watch("longitude");
        
        // Final safety check against last fetched
        const dLat = lastFetchedCoordsRef.current ? Math.abs(lastFetchedCoordsRef.current.lat - mapCoordinates.lat) : 1;
        const dLng = lastFetchedCoordsRef.current ? Math.abs(lastFetchedCoordsRef.current.lng - mapCoordinates.lng) : 1;

        if (dLat > 0.0001 || dLng > 0.0001) {
          fetchAddressFromCoordinates(mapCoordinates.lat, mapCoordinates.lng);
        }
      }
    }, 1500); // 1.5s debounce for map movement to ensure user is done dragging

    return () => clearTimeout(timer);
  }, [mapCoordinates.lat, mapCoordinates.lng, isInternalUpdate]);

  const refreshAddressFromMap = () => {
    fetchAddressFromCoordinates(mapCoordinates.lat, mapCoordinates.lng);
  };

  // Handle location selection from search suggestions
  const handleLocationSelect = async (location: {
    lat: number;
    lng: number;
    address: string;
    placeId: string;
    addressComponents?: any;
  }) => {
    setMapCoordinates({ lat: location.lat, lng: location.lng });
    setValue("latitude", location.lat);
    setValue("longitude", location.lng);

    if (location.addressComponents) {
      const components = location.addressComponents;
      const findComponent = (type: string) => components.find((c: any) => c.types.includes(type))?.long_name || "";

      const streetNumber = findComponent("street_number");
      const route = findComponent("route");
      const locality = findComponent("locality");
      const sublocality = findComponent("sublocality_level_1");
      const sublocality2 = findComponent("sublocality_level_2");
      const administrativeArea = findComponent("administrative_area_level_1");
      const country = findComponent("country");
      const postalCode = findComponent("postal_code");
      const premise = findComponent("premise");
      const pointOfInterest = findComponent("point_of_interest");
      const neighborhood = findComponent("neighborhood");

      setIsInternalUpdate(true);
      
      // Override/Clear fields with fallbacks to avoid leaking old/current address details
      setValue("building_no", premise || streetNumber || "", { shouldValidate: true, shouldDirty: true });
      setValue("floor", "", { shouldValidate: false, shouldDirty: true });

      let streetAddress = [streetNumber, route, sublocality, sublocality2]
        .filter(Boolean)
        .join(", ");
      
      if (!streetAddress && location.address) {
        streetAddress = location.address;
        if (locality && streetAddress.includes(locality)) {
          streetAddress = streetAddress.split(", " + locality)[0];
        }
      }
      
      setValue("address", streetAddress || "", { shouldValidate: true, shouldDirty: true });
      setValue("city_town", locality || sublocality || "", { shouldValidate: true, shouldDirty: true });
      setValue("state", administrativeArea || "", { shouldValidate: true, shouldDirty: true });
      setValue("country", country || "India", { shouldValidate: true, shouldDirty: true });
      setValue("pincode", postalCode || "", { shouldValidate: true, shouldDirty: true });
      
      const finalLandmark = pointOfInterest || neighborhood || sublocality2 || "";
      setValue("landmark", finalLandmark, { shouldValidate: true, shouldDirty: true });
      
      setTimeout(() => setIsInternalUpdate(false), 500);
    }
  };

  return {
    mapCoordinates,
    setMapCoordinates,
    handleMapLocationChange,
    handleLocationSelect,
    refreshAddressFromMap,
    isValidating
  };
};
