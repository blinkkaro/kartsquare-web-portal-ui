import { GET } from "@/services/api";
import { MapDetailsResponse } from "./mapInterface";

const MAP_ENDPOINTS = {
  MAP_DETAILS: "/auth/map",
} as const;

export interface MapDetailsParams {
  page?: number;
  limit?: number;
}

export const mapDetailsService = {
  getMapDetails: async (
    params?: MapDetailsParams
  ): Promise<MapDetailsResponse> => {
    const query: Record<string, number> = {};
    if (params?.page != null) query.page = params.page;
    if (params?.limit != null) query.limit = params.limit;
    const response = await GET<MapDetailsResponse>(
      MAP_ENDPOINTS.MAP_DETAILS,
      query,
      false
    );
    return response.data;
  },
};
