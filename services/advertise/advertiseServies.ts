import { APIENDPOINT } from "./apiEndPoint";
import {
  Advertise,
  AdvertiseActiveAd,
  AdvertiseCreate,
  AdvertiseDetails,
  AdvertiseProviderAdPagination,
  AdvertiseUpdate,
  ProviderAdFilters,
  pagination
} from "./advertise.intreface";
import { DELETE, GET, POST, PUT } from "../api";
import { verifyDocumentService } from "../auth/verifyDocument.service";

class AdvertiseService {
  async getActiveAdvertisements(
    limit: number = 5,
    page?: number,
  ): Promise<{ ads: AdvertiseActiveAd[]; pagination?: pagination }> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
      });

      if (page) {
        params.append("page", page.toString());
      }

      const response = await GET<{
        ads: AdvertiseActiveAd[];
        hasNextPage?: boolean;
      }>(`${APIENDPOINT.GET_ACTIVE_ADVERTISEMENTS}?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async createAdvertise(
    advertise: Omit<AdvertiseCreate, "image_url">,
    imageFile: File,
  ): Promise<Advertise> {
    try {
      // Upload the image and get the URL
      const uploadedUrls = await verifyDocumentService.uploadImages([
        imageFile,
      ]);

      if (uploadedUrls.length === 0) {
        throw new Error("Failed to upload advertisement image.");
      }

      const advertiseData: AdvertiseCreate = {
        ...advertise,
        image_url: uploadedUrls[0],
      };

      const response = await POST<Advertise>(
        APIENDPOINT.CREATE_ADVERTISEMENTS,
        advertiseData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async updateAdvertise(
    advertise: Omit<AdvertiseUpdate, "image_url">,
    imageFile?: File,
  ): Promise<AdvertiseDetails> {
    try {
      let advertiseData: AdvertiseUpdate = {
        ...advertise,
      };

      if (imageFile) {
        const uploadedUrls = await verifyDocumentService.uploadImages([
          imageFile,
        ]);

        if (uploadedUrls.length === 0) {
          throw new Error("Failed to upload advertisement image.");
        }

        advertiseData.image_url = uploadedUrls[0];
      }

      const response = await PUT<AdvertiseDetails>(
        APIENDPOINT.UPDATE_ADVERTISEMENTS(advertise.advertise_id),
        advertiseData,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async deleteAdvertise(advertise_id: string): Promise<boolean> {
    try {
      const response = await DELETE(
        APIENDPOINT.DELETE_ADVERTISEMENTS(advertise_id),
      );
      return response.success;
    } catch (error) {
      throw error;
    }
  }
  async AdvertiseClicked(advertise_id: string): Promise<boolean> {
    try {
      const response = await POST(
        APIENDPOINT.ADVERTIES_CLICKS(advertise_id),
        {},
      );
      return response.success;
    } catch (error) {
      throw error;
    }
  }
  async getProviderAdvertisements(
    filters: ProviderAdFilters,
  ): Promise<AdvertiseProviderAdPagination> {
    try {
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
    } catch (error) {
      throw error;
    }
  }
  async getAdvertisementsById(id: string): Promise<AdvertiseDetails> {
    try {
      const response = await GET<AdvertiseDetails>(
        APIENDPOINT.GET_ADVERTISEMENTS_BY_ID(id),
        {},
        true,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async updateAdvertiseStatus(
    advertise_id: string,
    status: string,
  ): Promise<AdvertiseDetails> {
    try {
      const response = await PUT<AdvertiseDetails>(
        APIENDPOINT.UPDATE_ADVERTISEMENT_STATUS(advertise_id),
        { status },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const advertiseService = new AdvertiseService();
