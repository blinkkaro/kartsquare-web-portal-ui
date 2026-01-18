import { useState, useEffect } from "react";
import { UseFormSetValue } from "react-hook-form";
import { mapService } from "@/services/map/mapService";
import { AddressFormData } from "@/components/common/address/AddressSchema";
import { Address } from "@/services/address/addressInterface";

interface UseAddressMapProps {
  initialData: Address | null;
  setValue: UseFormSetValue<AddressFormData>;
  coordinates: { latitude: number; longitude: number } | null | undefined;
}

export const useAddressMap = ({
  initialData,
  setValue,
  coordinates,
}: UseAddressMapProps) => {
  const [mapCoordinates, setMapCoordinates] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 28.6139, lng: 77.209 }); // Default to New Delhi

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
        lat: initialData.latitude,
        lng: initialData.longitude,
      });
    }
  }, [initialData]);

  const handleMapLocationChange = (lat: number, lng: number) => {
    setMapCoordinates({ lat, lng });
    setValue("latitude", lat);
    setValue("longitude", lng);
    console.log("Map location changed:", {
      latitude: lat,
      longitude: lng,
    });
  };

  // Form Population Logic (from Reverse Geocode)
  useEffect(() => {
    const fetchAddressFromCoordinates = async () => {
      if (mapCoordinates.lat && mapCoordinates.lng) {
        try {
          const addressData = await mapService.reverseGeocode(
            mapCoordinates.lat,
            mapCoordinates.lng,
          );

          console.log("Address Data:", addressData);

          if (!addressData?.address_components) return;

          const components = addressData.address_components;
          let streetNumber = "";
          let route = "";
          let neighborhood = "";
          let subLocality = "";
          let locality = "";
          let adminArea2 = ""; // District/County
          let adminArea1 = ""; // State
          let countryName = "";
          let postalCode = "";
          let premise = "";

          components.forEach((component: any) => {
            const types = component.types;
            if (types.includes("street_number"))
              streetNumber = component.long_name;
            if (types.includes("route")) route = component.long_name;
            if (types.includes("neighborhood"))
              neighborhood = component.long_name;
            if (
              types.includes("sublocality") ||
              types.includes("sublocality_level_1")
            ) {
              subLocality = component.long_name;
            }
            if (types.includes("premise")) premise = component.long_name;
            if (types.includes("locality")) locality = component.long_name;
            if (types.includes("administrative_area_level_2"))
              adminArea2 = component.long_name;
            if (types.includes("administrative_area_level_1"))
              adminArea1 = component.long_name;
            if (types.includes("country")) countryName = component.long_name;
            if (types.includes("postal_code")) postalCode = component.long_name;
          });

          // 1. Building No
          if (streetNumber) {
            setValue("building_no", streetNumber, { shouldValidate: true });
          } else if (premise) {
            setValue("building_no", premise, { shouldValidate: true });
          } else {
            setValue("building_no", "", { shouldValidate: false });
          }

          // 2. Address (Street)
          const streetAddress = [route, subLocality, neighborhood]
            .filter(Boolean)
            .join(", ");
          if (streetAddress) {
            setValue("address", streetAddress, { shouldValidate: true });
          } else if (neighborhood) {
            setValue("address", neighborhood, { shouldValidate: true });
          }

          // 3. City
          const finalCity = locality || subLocality || adminArea2;
          if (finalCity)
            setValue("city_town", finalCity, { shouldValidate: true });

          // 4. State
          if (adminArea1)
            setValue("state", adminArea1, { shouldValidate: true });

          // 5. Country
          if (countryName)
            setValue("country", countryName, { shouldValidate: true });

          // 6. Pincode
          if (postalCode)
            setValue("pincode", postalCode, { shouldValidate: true });

          console.log("Address fields populated:", {
            building_no: streetNumber || premise,
            address: streetAddress || neighborhood,
            city_town: finalCity,
            state: adminArea1,
            country: countryName,
            pincode: postalCode,
          });
        } catch (error) {
          console.error("Error fetching address from coordinates:", error);
        }
      }
    };

    fetchAddressFromCoordinates();
  }, [mapCoordinates.lat, mapCoordinates.lng, setValue]);

  // Handle location selection from search suggestions
  const handleLocationSelect = async (location: {
    lat: number;
    lng: number;
    address: string;
    placeId: string;
    addressComponents?: any;
  }) => {
    // Update map coordinates
    setMapCoordinates({ lat: location.lat, lng: location.lng });
    setValue("latitude", location.lat);
    setValue("longitude", location.lng);

    // Parse address components to populate form fields
    if (location.addressComponents) {
      const components = location.addressComponents;

      // Helper to find component by type
      const findComponent = (type: string) => {
        const component = components.find((c: any) => c.types.includes(type));
        return component?.long_name || "";
      };

      // Extract address details
      const streetNumber = findComponent("street_number");
      const route = findComponent("route");
      const locality = findComponent("locality");
      const sublocality = findComponent("sublocality_level_1");
      const administrativeArea = findComponent("administrative_area_level_1");
      const country = findComponent("country");
      const postalCode = findComponent("postal_code");
      const premise = findComponent("premise");

      // Populate form fields
      if (streetNumber || route) {
        setValue("address", `${streetNumber} ${route}`.trim());
      } else if (location.address) {
        setValue("address", location.address);
      }

      if (premise) {
        setValue("building_no", premise);
      }

      if (locality || sublocality) {
        const cityValue = locality || sublocality;
        setValue("city_town", cityValue);
      }

      if (administrativeArea) {
        setValue("state", administrativeArea);
      }

      if (country) {
        setValue("country", country);
      }

      if (postalCode) {
        setValue("pincode", postalCode);
      }
    } else {
      // Fallback: use reverse geocoding if address components not available
      try {
        const geocodeResult = await mapService.reverseGeocode(
          location.lat,
          location.lng,
        );
        if (geocodeResult) {
          setValue("address", geocodeResult.formatted_address || "");
        }
      } catch (error) {
        console.error("Reverse geocoding error:", error);
      }
    }
  };

  return {
    mapCoordinates,
    setMapCoordinates,
    handleMapLocationChange,
    handleLocationSelect,
  };
};
