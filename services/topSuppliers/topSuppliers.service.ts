import { GET } from "../api";
import { ApiEndPoints } from "./apiEndPoints";
import { TopProvider, TopService } from "./topSupplires.interfaces";

class TopSuppliersService {
  async getTopProviders(
    limit: string,
    latitude: string,
    longitude: string,
  ): Promise<TopProvider[]> {
    try {
      const res = await GET<TopProvider[]>(
        ApiEndPoints.GET_TOP_PROVIDERS(limit, latitude, longitude),
      );
      console.log("Top Providers Response:", res);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  async getTopServices(
    limit: string,
    latitude: string,
    longitude: string,
  ): Promise<TopService[]> {
    try {
      const res = await GET<TopService[]>(
        ApiEndPoints.GET_TOP_SERVICES(limit, latitude, longitude),
      );
      console.log("Top Services Response:", res);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}

export const topSuppliersService = new TopSuppliersService();