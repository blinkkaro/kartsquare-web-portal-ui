const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const BASE_URL = "https://maps.googleapis.com/maps/api";

export const mapService = {
  reverseGeocode: async (
    latitude: number,
    longitude: number,
  ): Promise<google.maps.GeocoderResult | null> => {
    try {
      // Use Google Maps JavaScript SDK Geocoder instead of REST API
      // This works with HTTP referrer-restricted API keys
      if (!window.google || !window.google.maps) {
        // console.error("Google Maps API not loaded");
        return null;
      }

      const geocoder = new google.maps.Geocoder();
      const latLng = { lat: latitude, lng: longitude };

      return new Promise((resolve) => {
        geocoder.geocode({ location: latLng }, (results, status) => {
          // console.log("Reverse Geocoding Response:", { status, results });
          if (
            status === google.maps.GeocoderStatus.OK &&
            results &&
            results.length > 0
          ) {
            resolve(results[0]);
          } else {
            // console.error("Reverse Geocoding failed:", status);
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error("Reverse Geocoding Error:", error);
      return null;
    }
  },
  geocodeAddress: async (
    address: string,
  ): Promise<google.maps.GeocoderResult | null> => {
    try {
      if (!window.google || !window.google.maps) {
        return null;
      }

      const geocoder = new google.maps.Geocoder();
      return new Promise((resolve) => {
        geocoder.geocode({ address }, (results, status) => {
          if (
            status === google.maps.GeocoderStatus.OK &&
            results &&
            results.length > 0
          ) {
            resolve(results[0]);
          } else {
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error("Geocoding Error:", error);
      return null;
    }
  },

  searchPlaces: async (
    query: string,
    location?: { lat: number; lng: number },
    radius?: number,
  ) => {
    try {
      let url = `${BASE_URL}/place/autocomplete/json?input=${encodeURIComponent(
        query,
      )}&key=${GOOGLE_MAPS_API_KEY}`;

      // Add location bias if provided
      if (location) {
        url += `&location=${location.lat},${location.lng}`;
        if (radius) {
          url += `&radius=${radius * 1000}`; // Convert km to meters
        }
      }

      const response = await fetch(url);
      const data = await response.json();
      if (data.status === "OK") {
        return data.predictions;
      }
      return [];
    } catch (error) {
      // console.error("Place Search Error:", error);
      return [];
    }
  },

  searchPlacesNearby: async (
    query: string,
    latitude: number,
    longitude: number,
    radiusKm: number = 5,
  ) => {
    try {
      const url = `${BASE_URL}/place/autocomplete/json?input=${encodeURIComponent(
        query,
      )}&location=${latitude},${longitude}&radius=${radiusKm * 1000}&key=${GOOGLE_MAPS_API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK") {
        return data.predictions;
      }
      return [];
    } catch (error) {
      // console.error("Nearby Place Search Error:", error);
      return [];
    }
  },

  getPlaceDetails: async (placeId: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/place/details/json?place_id=${placeId}&fields=geometry,formatted_address,address_components&key=${GOOGLE_MAPS_API_KEY}`,
      );
      const data = await response.json();
      if (data.status === "OK") {
        return {
          lat: data.result.geometry.location.lat,
          lng: data.result.geometry.location.lng,
          formatted_address: data.result.formatted_address,
          address_components: data.result.address_components,
        };
      }
      return null;
    } catch (error) {
      // console.error("Place Details Error:", error);
      return null;
    }
  },
};
