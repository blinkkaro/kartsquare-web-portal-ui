import { APIENDPOINT } from "./apiEndPoint";
import {
  Advertise,
  AdvertiseCreate,
  AdvertiseDetails,
  AdvertiseProviderAdPagination,
  AdvertiseUpdate,
  ProviderAdFilters,
} from "./advertise.intreface";
import { DELETE, GET, POST, PUT } from "../api";

class AdvertiseService {
  async getActiveAdvertisements() {
    const response = await GET(APIENDPOINT.GET_ACTIVE_ADVERTISEMENTS);
    return response.data;
  }
  async createAdvertise(advertise: AdvertiseCreate): Promise<Advertise> {
    const response = await POST<Advertise>(
      APIENDPOINT.CREATE_ADVERTISEMENTS,
      advertise,
    );
    return response.data;
  }
  async updateAdvertise(advertise: AdvertiseUpdate): Promise<AdvertiseDetails> {
    const response = await PUT<AdvertiseDetails>(
      APIENDPOINT.UPDATE_ADVERTISEMENTS(advertise.advertise_id),
      advertise,
    );
    return response.data;
  }
  async deleteAdvertise(advertise_id: string): Promise<boolean> {
    const response = await DELETE(
      APIENDPOINT.DELETE_ADVERTISEMENTS(advertise_id),
    );
    return response.success;
  }
  async addAdvertiseClicks(advertise_id: string): Promise<boolean> {
    const response = await POST(APIENDPOINT.ADVERTIES_CLICKS(advertise_id), {});
    return response.success;
  }
  async getProviderAdvertisements(
    filters: ProviderAdFilters,
  ): Promise<AdvertiseProviderAdPagination> {
    const baseUrl = APIENDPOINT.GET_PROVIDER_ADVERTISEMENTS;
    const queryParams = new URLSearchParams({
      page: filters.page?.toString() || "1",
      limit: filters.limit?.toString() || "10",
    });
    if (filters.category_id) {
      queryParams.set("category_id", filters.category_id);
    }
    if (filters.service_id) {
      queryParams.set("service_id", filters.service_id);
    }
    if (filters.status) {
      queryParams.set("status", filters.status);
    }
    const response = await GET<AdvertiseProviderAdPagination>(
      `${baseUrl}?${queryParams.toString()}`,
    );
    return response.data;
  }
  async getAdvertisementsById(id: string): Promise<AdvertiseDetails> {
    const response = await GET<AdvertiseDetails>(
      APIENDPOINT.GET_ADVERTISEMENTS_BY_ID(id),
      {},
      true
    );
    return response.data;
  }
}

export const advertiseService = new AdvertiseService();
